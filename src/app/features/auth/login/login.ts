import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import { errorMessage } from '../../../core/api.service';
type Role = 'paciente' | 'medico' | 'recepcionista' | 'administrador';
@Component({ selector: 'app-login', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './login.html' })
export class Login {
  selectedRole: Role = 'paciente'; showPassword = false; email = ''; password = ''; isLoading = false; errorMessage = ''; remember = false;
  private auth = inject(AuthService); private router = inject(Router);
  roles: { id: Role; label: string; icon: string; description: string }[] = [
    { id: "paciente", label: "Paciente", icon: "bi-person", description: "Acesse seus dados de saúde" },
    { id: "medico", label: "Médico", icon: "bi-heart-pulse", description: "Gerencie seus pacientes" },
    { id: "recepcionista", label: "Recepcionista", icon: "bi-clipboard2-data", description: "Agendamentos e cadastros" },
    { id: "administrador", label: "Administrador", icon: "bi-shield-check", description: "Gestão da plataforma" }
  ];


  selectRole(role: Role) { this.selectedRole = role; this.errorMessage = ''; }
  togglePassword() { this.showPassword = !this.showPassword; }
  onSubmit() {
    if (this.isLoading) return;
    if (!this.email || !this.password) { this.errorMessage = 'Preencha o e-mail e a senha.'; return; }
    this.isLoading = true; this.errorMessage = '';
    this.auth.login(this.email.trim(), this.password, this.remember).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => { this.password = ''; void this.router.navigateByUrl(this.auth.home); },
      error: e => this.errorMessage = e.status === 401 || e.status === 403 ? 'E-mail ou senha inválidos.' : errorMessage(e)
    });
  }
}
