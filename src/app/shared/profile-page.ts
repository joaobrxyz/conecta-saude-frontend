import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, errorMessage } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { ROLE_RESOURCE, UserInput } from '../core/api.models';
import { ProfileService } from '../core/profile.service';

@Component({ selector: 'app-profile-page', standalone: true, imports: [CommonModule, FormsModule], styleUrl: './data-page.scss', template: `
  <section class="page"><h1>Meu perfil</h1><p class="muted">Atualize seus dados de contato.</p>
  <p *ngIf="error" role="alert" class="error">{{ error }}</p><p *ngIf="success" role="status" class="success">{{ success }}</p>
  <p *ngIf="loading">Carregando perfil…</p><button *ngIf="error && !loaded" (click)="ngOnInit()">Tentar novamente</button>
  <form *ngIf="loaded" class="card" #profile="ngForm" (ngSubmit)="save()"><fieldset [disabled]="busy"><div class="grid">
  <label>Nome<input name="nome" [(ngModel)]="form.nome" required></label><label>E-mail<input name="email" type="email" [(ngModel)]="form.email" required email></label><label>Telefone<input name="telefone" type="tel" [(ngModel)]="form.telefone" required></label></div><button [disabled]="profile.invalid || busy">Salvar perfil</button></fieldset></form>
  <form class="card" #password="ngForm" (ngSubmit)="changePassword()"><h2>Alterar senha</h2><fieldset [disabled]="busy"><label>Senha atual<input type="password" name="current" [(ngModel)]="current" autocomplete="current-password" required></label><label>Nova senha<input type="password" name="newPassword" [(ngModel)]="newPassword" autocomplete="new-password" minlength="6" required></label><label>Confirmar nova senha<input type="password" name="confirmation" [(ngModel)]="confirmation" autocomplete="new-password" required></label><button [disabled]="password.invalid || busy || newPassword !== confirmation">Alterar senha</button></fieldset></form>
  <div class="card"><h2>Preferências e notificações</h2><p class="muted">A personalização de notificações e as configurações gerais da clínica ainda não estão disponíveis.</p></div>
  </section>` })
export class ProfilePage implements OnInit {
  private api = inject(ApiService); readonly auth = inject(AuthService); private profile = inject(ProfileService);
  form: UserInput = { nome: '', email: '', telefone: '' };
  loading = false; loaded = false; busy = false; error = ''; success = ''; current = ''; newPassword = ''; confirmation = '';
  private get resource() { return ROLE_RESOURCE[this.auth.claims!.role]; }
  ngOnInit() { this.loading = true; this.error = ''; this.api.profile(this.resource).pipe(finalize(() => this.loading = false)).subscribe({ next: user => { this.form = { nome: user.nome, email: user.email, telefone: user.telefone }; this.loaded = true; }, error: e => this.error = errorMessage(e) }); }
  save() { if (this.busy) return; this.busy = true; this.error = ''; this.success = ''; this.api.updateProfile(this.resource, this.form).pipe(finalize(() => this.busy = false)).subscribe({ next: () => { this.success = 'Perfil atualizado.'; this.profile.load(); }, error: e => this.error = errorMessage(e) }); }
  changePassword() { if (this.busy || this.newPassword !== this.confirmation) return; this.busy = true; this.error = ''; this.success = ''; this.api.changePassword(this.current, this.newPassword).pipe(finalize(() => this.busy = false)).subscribe({ next: () => { this.current = ''; this.newPassword = ''; this.confirmation = ''; this.success = 'Senha alterada.'; }, error: e => this.error = errorMessage(e) }); }
}
