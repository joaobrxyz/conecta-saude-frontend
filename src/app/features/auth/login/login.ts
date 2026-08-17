import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Role = "paciente" | "medico" | "recepcionista" | "administrador";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  selectedRole: Role = 'paciente';
  showPassword = false;
  email = '';
  password = '';
  isLoading = false;

  roles: { id: Role; label: string; icon: string; description: string }[] = [
    { id: "paciente", label: "Paciente", icon: "bi-person", description: "Acesse seus dados de saúde" },
    { id: "medico", label: "Médico", icon: "bi-heart-pulse", description: "Gerencie seus pacientes" },
    { id: "recepcionista", label: "Recepcionista", icon: "bi-clipboard2-data", description: "Agendamentos e cadastros" },
    { id: "administrador", label: "Administrador", icon: "bi-shield-check", description: "Gestão da plataforma" }
  ];

  selectRole(roleId: Role) {
    this.selectedRole = roleId;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 1800);
  }
}