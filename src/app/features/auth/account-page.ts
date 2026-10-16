import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/api.service';
import { UserInput } from '../../core/api.models';

@Component({ selector: 'app-account-page', standalone: true, imports: [CommonModule, FormsModule, RouterLink], styleUrl: '../../shared/data-page.scss', template: `
<main class="page" style="max-width:650px"><h1>Conecta Saúde</h1><form class="card" #account="ngForm" (ngSubmit)="submit()"><h2>{{ mode === 'register' ? 'Criar conta de paciente' : mode === 'reset' ? 'Redefinir senha' : 'Recuperar acesso' }}</h2>
<p *ngIf="error" role="alert" class="error">{{ error }}</p><p *ngIf="success" role="status" class="success">{{ success }}</p>
<fieldset [disabled]="busy"><ng-container *ngIf="mode === 'register'"><label>Nome<input name="nome" [(ngModel)]="form.nome" required></label><label>CPF<input name="cpf" [(ngModel)]="form.cpf" required></label><label>Telefone<input name="phone" [(ngModel)]="form.telefone" required></label></ng-container>
<label *ngIf="mode !== 'reset'">E-mail<input type="email" name="email" [(ngModel)]="form.email" required email></label>
<ng-container *ngIf="mode !== 'forgot'"><label>{{ mode === 'reset' ? 'Nova senha' : 'Senha' }}<input type="password" name="password" [(ngModel)]="form.senha" minlength="6" required autocomplete="new-password"></label><label>Confirme a senha<input type="password" name="confirm" [(ngModel)]="confirmation" required autocomplete="new-password"></label></ng-container>
<button [disabled]="account.invalid || busy || (mode !== 'forgot' && confirmation !== form.senha)">{{ busy ? 'Enviando…' : 'Confirmar' }}</button></fieldset><div class="toolbar"><a routerLink="/login">Voltar ao login</a></div></form></main>` })
export class AccountPage {
  private auth = inject(AuthService); private route = inject(ActivatedRoute);
  mode = this.route.snapshot.data['mode'] as 'register' | 'forgot' | 'reset';
  form: UserInput = { nome: '', email: '', telefone: '', cpf: '', senha: '' };
  confirmation = ''; busy = false; error = ''; success = '';
  submit() {
    if (this.busy) return;
    const token = this.route.snapshot.queryParamMap.get('token');
    if (this.mode === 'reset' && !token) { this.error = 'Link de recuperação inválido.'; return; }
    this.busy = true; this.error = ''; this.success = '';
    const request = this.mode === 'register' ? this.auth.register(this.form) : this.mode === 'forgot' ? this.auth.forgot(this.form.email) : this.auth.reset(token!, this.form.senha!);
    request.pipe(finalize(() => this.busy = false)).subscribe({ next: () => {
      this.success = this.mode === 'register' ? 'Conta criada. Você já pode entrar.' : this.mode === 'reset' ? 'Senha redefinida. Entre com sua nova senha.' : 'Solicitação registrada. O envio automático de e-mail ainda não está disponível; entre em contato com o suporte para recuperar o acesso.';
      this.form.senha = ''; this.confirmation = '';
    }, error: e => this.error = errorMessage(e) });
  }
}
