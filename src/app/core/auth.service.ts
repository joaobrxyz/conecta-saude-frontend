import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, shareReplay, tap, throwError } from 'rxjs';
import { API_URL } from './api.service';
import { Claims, ROLE_PATH, Tokens, UserInput } from './api.models';

export function decodeToken(token: string): Claims | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '='))) as Claims;
    return claims.sub && claims.exp && Object.hasOwn(ROLE_PATH, claims.role) ? claims : null;
  } catch { return null; }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private url = inject(API_URL);
  private key = 'conecta.session';
  readonly session = signal<Tokens | null>(this.restore());
  private refreshRequest?: Observable<Tokens>;
  private persistent = localStorage.getItem(this.key) !== null;
  get claims() { return decodeToken(this.session()?.accessToken ?? ''); }
  get home() { return `/${ROLE_PATH[this.claims?.role ?? 'PACIENTE']}/dashboard`; }
  get expired() { return !this.claims || this.claims.exp * 1000 <= Date.now() + 30000; }

  login(email: string, senha: string, manterConectado: boolean) {
    return this.http.post<Tokens>(`${this.url}/auth/login`, { email, senha, manterConectado }).pipe(tap(tokens => {
      this.persistent = manterConectado;
      this.save(tokens);
    }));
  }
  refresh(): Observable<Tokens> {
    if (this.refreshRequest) return this.refreshRequest;
    const refreshToken = this.session()?.refreshToken;
    if (!refreshToken) return throwError(() => new Error('Sessão encerrada'));
    this.refreshRequest = this.http.post<Tokens>(`${this.url}/auth/refresh`, { refreshToken }).pipe(
      tap(tokens => {
        if (this.session()?.refreshToken !== refreshToken) throw new Error('Sessão encerrada');
        this.save(tokens);
      }),
      catchError(error => { if (this.session()?.refreshToken === refreshToken) { this.clear(); void this.router.navigate(['/login']); } return throwError(() => error); }),
      finalize(() => { this.refreshRequest = undefined; }), shareReplay({ bufferSize: 1, refCount: false }));
    return this.refreshRequest;
  }
  ensureSession() { return this.refresh().pipe(map(() => true)); }
  logout() {
    const refreshToken = this.session()?.refreshToken;
    this.clear();
    void this.router.navigate(['/login']);
    if (refreshToken) this.http.post<void>(`${this.url}/auth/logout`, { refreshToken }).subscribe({ error: () => {} });
  }
  clear() { this.session.set(null); localStorage.removeItem(this.key); sessionStorage.removeItem(this.key); localStorage.removeItem('token'); }
  register(data: UserInput) { return this.http.post<void>(`${this.url}/patients`, data); }
  forgot(email: string) { return this.http.post<void>(`${this.url}/auth/forgot-password`, { email }); }
  reset(token: string, novaSenha: string) { return this.http.post<void>(`${this.url}/auth/reset-password/${encodeURIComponent(token)}`, { novaSenha }); }
  private save(tokens: Tokens) {
    if (!decodeToken(tokens.accessToken) || !tokens.refreshToken) throw new Error('Resposta de autenticação inválida');
    localStorage.removeItem(this.key); sessionStorage.removeItem(this.key);
    (this.persistent ? localStorage : sessionStorage).setItem(this.key, JSON.stringify(tokens));
    this.session.set(tokens);
  }
  private restore(): Tokens | null {
    try {
      const value = JSON.parse(sessionStorage.getItem(this.key) ?? localStorage.getItem(this.key) ?? 'null') as Tokens | null;
      return value?.refreshToken && decodeToken(value.accessToken) ? value : null;
    } catch { return null; }
  }
}
