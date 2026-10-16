import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService, decodeToken } from './auth.service';
import { authInterceptor } from './auth.interceptor';
import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

function token(role = 'PACIENTE', expired = false) {
  return `header.${btoa(JSON.stringify({ sub: 'patient-1', role, exp: Math.floor(Date.now() / 1000) + (expired ? -60 : 3600) }))}.signature`;
}

describe('API integration', () => {
  let http: HttpTestingController;
  let auth: AuthService;
  beforeEach(() => {
    localStorage.clear(); sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController); auth = TestBed.inject(AuthService);
  });
  afterEach(() => { http.verify(); localStorage.clear(); sessionStorage.clear(); });

  function login(expired = false, persistent = false) {
    auth.login('patient@example.com', 'secret', persistent).subscribe();
    const req = http.expectOne('/api/auth/login');
    expect(req.request.body).toEqual({ email: 'patient@example.com', senha: 'secret', manterConectado: persistent });
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ accessToken: token('PACIENTE', expired), refreshToken: 'refresh-1' });
  }
  it('uses the backend role and stores a temporary session by default', () => {
    login();
    expect(auth.home).toBe('/paciente/dashboard');
    expect(localStorage.getItem('conecta.session')).toBeNull();
    expect(sessionStorage.getItem('conecta.session')).toBeTruthy();
  });
  it('remembers the session only when requested', () => {
    login(false, true);
    expect(localStorage.getItem('conecta.session')).toBeTruthy();
    expect(sessionStorage.getItem('conecta.session')).toBeNull();
  });
  it('shares one refresh between concurrent protected requests', () => {
    login(true);
    const api = TestBed.inject(ApiService);
    api.appointments().subscribe(); api.specialties().subscribe();
    const refresh = http.expectOne('/api/auth/refresh');
    expect(refresh.request.body).toEqual({ refreshToken: 'refresh-1' });
    const accessToken = token();
    refresh.flush({ accessToken, refreshToken: 'refresh-2' });
    for (const url of ['/api/appointments', '/api/specialties']) {
      const req = http.expectOne(url); expect(req.request.headers.get('Authorization')).toBe(`Bearer ${accessToken}`); req.flush([]);
    }
  });
  it('does not send tokens to an unrelated host', () => {
    login();
    TestBed.inject(HttpClient).get('https://example.com/data').subscribe();
    const req = http.expectOne('https://example.com/data'); expect(req.request.headers.has('Authorization')).toBeFalse(); req.flush({});
  });
  it('does not refresh a genuine permission denial', () => {
    login();
    TestBed.inject(ApiService).specialties().subscribe({ error: e => expect(e.status).toBe(403) });
    http.expectOne('/api/specialties').flush({}, { status: 403, statusText: 'Forbidden' });
    http.expectNone('/api/auth/refresh');
  });
  it('clears the session when refresh fails', () => {
    login(true); spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    TestBed.inject(ApiService).appointments().subscribe({ error: () => {} });
    http.expectOne('/api/auth/refresh').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.session()).toBeNull(); expect(sessionStorage.getItem('conecta.session')).toBeNull();
  });
  it('loads every page for selectors and statistics', () => {
    const rows: unknown[] = [];
    TestBed.inject(ApiService).all('doctors').subscribe(data => rows.push(...data));
    http.expectOne('/api/doctors?page=0&size=100').flush({ content: [{ id: '1' }], number: 0, totalPages: 2, last: false });
    http.expectOne('/api/doctors?page=1&size=100').flush({ content: [{ id: '2' }], number: 1, totalPages: 2, last: true });
    expect(rows).toEqual([{ id: '1' }, { id: '2' }]);
  });
  it('redirects unauthenticated users and blocks another role area', () => {
    const route = { data: { role: 'ADMIN' } } as unknown as ActivatedRouteSnapshot;
    const check = () => TestBed.runInInjectionContext(() => authGuard(route, {} as RouterStateSnapshot));
    expect(String(check())).toBe('/login'); login(); expect(String(check())).toBe('/paciente/dashboard');
  });
  it('does not restore a session when logout happens during refresh', () => {
    login(true); spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    TestBed.inject(ApiService).appointments().subscribe({ error: () => {} });
    const refresh = http.expectOne('/api/auth/refresh');
    auth.logout();
    http.expectOne('/api/auth/logout').flush(null);
    refresh.flush({ accessToken: token(), refreshToken: 'late-refresh' });
    expect(auth.session()).toBeNull();
    expect(sessionStorage.getItem('conecta.session')).toBeNull();
    http.expectNone('/api/appointments');
  });
  it('rejects malformed tokens and unknown roles', () => {
    expect(decodeToken('bad')).toBeNull(); expect(decodeToken(token('OTHER'))).toBeNull();
  });
});
