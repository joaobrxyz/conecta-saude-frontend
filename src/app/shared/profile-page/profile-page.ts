import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ROLE_RESOURCE, UserInput } from '../../core/api.models';
import { ProfileService } from '../../core/profile.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: '.././data-page.scss',
  templateUrl: './profile-page.html' // <-- Apontando para o ficheiro externo!
})
export class ProfilePage implements OnInit {
  
  // 1. Injeções de Dependência
  private api = inject(ApiService);
  readonly auth = inject(AuthService);
  private profile = inject(ProfileService);

  // 2. Estado do Formulário de Perfil
  form: UserInput = { nome: '', email: '', telefone: '' };
  
  // 3. Estado do Formulário de Senha
  current = '';
  newPassword = '';
  confirmation = '';

  // 4. Controles de Tela
  loading = false;
  loaded = false;
  busy = false;
  error = '';
  success = '';

  // 5. Roteamento Dinâmico
  private get resource() { 
    return ROLE_RESOURCE[this.auth.claims!.role]; 
  }

  // 6. Métodos de Ação
  ngOnInit() { 
    this.loading = true; 
    this.error = ''; 

    this.api.profile(this.resource)
      .pipe(finalize(() => this.loading = false))
      .subscribe({ 
        next: (user) => { 
          this.form = { nome: user.nome, email: user.email, telefone: user.telefone }; 
          this.loaded = true; 
        }, 
        error: (e) => this.error = errorMessage(e) 
      }); 
  }

  save() { 
    if (this.busy) return; 
    
    this.busy = true; 
    this.error = ''; 
    this.success = ''; 

    this.api.updateProfile(this.resource, this.form)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: () => { 
          this.success = 'Perfil atualizado.'; 
          this.profile.load(); 
        }, 
        error: (e) => this.error = errorMessage(e) 
      }); 
  }

  changePassword() { 
    if (this.busy || this.newPassword !== this.confirmation) return; 
    
    this.busy = true; 
    this.error = ''; 
    this.success = ''; 

    this.api.changePassword(this.current, this.newPassword)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: () => { 
          this.current = ''; 
          this.newPassword = ''; 
          this.confirmation = ''; 
          this.success = 'Senha alterada.'; 
        }, 
        error: (e) => this.error = errorMessage(e) 
      }); 
  }
}