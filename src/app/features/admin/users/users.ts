import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type UserStatus = 'active' | 'inactive';

interface UserRow {
  initials: string;
  avatarGrad: string;
  name: string;
  email: string;
  role: string;
  roleDetail?: string;
  lastAccess: string;
  status: UserStatus;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html'
})
export class Users {
  searchVal: string = '';
  roleFilter: string = 'Todos';
  statusFilter: string = 'Todos';
  page: number = 1;

  USERS: UserRow[] = [
    { initials: 'RS', avatarGrad: 'from-[#1565C0] to-[#1E88E5]', name: 'Dr. Rafael Silva', email: 'rafael@conectasaude.com.br', role: 'Médico', roleDetail: 'Cardiologia · CRM 12345-SP', lastAccess: 'Hoje, 10:23', status: 'active' },
    { initials: 'CS', avatarGrad: 'from-[#64748B] to-[#94A3B8]', name: 'Camila Santos', email: 'camila@conectasaude.com.br', role: 'Recepção', lastAccess: 'Agora', status: 'active' },
    { initials: 'MO', avatarGrad: 'from-[#C2410C] to-[#F97316]', name: 'Dr. Marcos Oliveira', email: 'marcos@conectasaude.com.br', role: 'Médico', roleDetail: 'Clínica Geral · CRM 54321-SP', lastAccess: 'Há 15 dias', status: 'inactive' },
    { initials: 'CA', avatarGrad: 'from-[#3B28CC] to-[#1565C0]', name: 'Carlos Admin', email: 'carlos@conectasaude.com.br', role: 'Administrador', lastAccess: 'Agora', status: 'active' },
    { initials: 'JF', avatarGrad: 'from-[#059669] to-[#10B981]', name: 'Dra. Julia Ferreira', email: 'julia@conectasaude.com.br', role: 'Médico', roleDetail: 'Pediatria · CRM 98765-SP', lastAccess: 'Hoje, 08:45', status: 'active' },
  ];

  ROLE_BADGES: Record<string, { bg: string; color: string }> = {
    'Médico': { bg: '#EBF3FF', color: '#1565C0' },
    'Recepção': { bg: '#F0FDF4', color: '#15803D' },
    'Administrador': { bg: '#F5F3FF', color: '#6D28D9' },
  };

  get filteredUsers() {
    const q = this.searchVal.toLowerCase();
    return this.USERS.filter(u => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.roleDetail ?? '').toLowerCase().includes(q);
      const matchRole = this.roleFilter === 'Todos' || u.role === this.roleFilter;
      
      let matchStatus = true;
      if (this.statusFilter === 'Ativos') matchStatus = u.status === 'active';
      if (this.statusFilter === 'Inativos') matchStatus = u.status === 'inactive';

      return matchSearch && matchRole && matchStatus;
    });
  }

  getRoleConfig(role: string) {
    return this.ROLE_BADGES[role] ?? { bg: '#F1F5F9', color: '#475569' };
  }

  setPage(p: number) {
    this.page = p;
  }
}