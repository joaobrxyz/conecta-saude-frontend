import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { MedicalRecord, Prescription, RecordSummary, Vitals } from '../../core/api.models';

@Component({ 
  selector: 'app-clinical-page', 
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './clinical-page.html',
  styleUrl: '.././data-page.scss' 
})
export class ClinicalPage implements OnChanges {
  
  // 1. Entradas Dinâmicas (Inputs do componente pai) e Injeções
  @Input() patientId = '';
  @Input() mode: 'record' | 'prescriptions' = 'record';
  
  readonly auth = inject(AuthService);
  private api = inject(ApiService);

  // 2. Estado de Dados
  records: RecordSummary[] = [];
  prescriptions: Prescription[] = [];
  vitals: Vitals | null = null;
  detail: MedicalRecord | null = null;

  // 3. Controles de Tela e Mensagens
  loading = false;
  busy = false;
  error = '';
  success = '';
  
  // 4. Campos de Formulário e Filtros
  addendum = '';
  filter = '';

  // 5. Propriedades Computadas (Getters)
  get visiblePrescriptions() { 
    return this.prescriptions.filter(p => 
      !this.filter || (this.filter === 'active' ? p.isActive : !p.isActive)
    ); 
  }

  // 6. Ciclo de Vida
  // Usa ngOnChanges em vez de ngOnInit para recarregar os dados sempre que 
  // o @Input() patientId mudar (ex: o médico clicou em outro paciente na tabela)
  ngOnChanges() { 
    this.load(); 
  }

  // 7. Chamadas à API (Integração com o clinical-service)
  load() {
    // Inteligência do componente: Se um ID foi passado por @Input, usa ele. 
    // Se não, assume que é o próprio paciente a ver o seu histórico e usa o ID do token JWT.
    const id = this.patientId || this.auth.claims?.sub;
    if (!id) return;
    
    this.loading = true; 
    this.error = ''; 
    this.detail = null;
    
    // Dispara as 3 buscas simultaneamente e aguarda todas finalizarem
    forkJoin({ 
      records: this.api.history(id), 
      prescriptions: this.api.prescriptions(id), 
      vitals: this.api.vitals(id) 
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe({ 
      next: data => {
        this.records = data.records; 
        this.prescriptions = data.prescriptions; 
        this.vitals = data.vitals;
      }, 
      error: e => this.error = errorMessage(e) 
    });
  }

  open(id: string) {
    this.busy = true; 
    this.error = ''; 
    this.detail = null; 
    this.addendum = '';
    
    this.api.record(id)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: d => this.detail = d, 
        error: e => this.error = errorMessage(e) 
      });
  }

  saveAddendum() {
    if (!this.detail || !this.addendum.trim() || this.busy) return;
    
    const id = this.detail.id; 
    this.busy = true; 
    this.error = '';
    
    this.api.addendum(id, this.addendum)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: () => {
          this.success = 'Adendo salvo.'; 
          this.open(id); // Recarrega o prontuário para mostrar o adendo recém-adicionado
        }, 
        error: e => this.error = errorMessage(e) 
      });
  }
}