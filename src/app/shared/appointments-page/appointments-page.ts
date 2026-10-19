import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, finalize } from 'rxjs';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Appointment, AppointmentStatus, Doctor, Patient, RecordRequest, STATUS_LABEL } from '../../core/api.models';
import { ClinicalPage } from '../clinical-page/clinical-page';

// Função utilitária exportada para lidar com datas locais
export function localDate(date = new Date()) { 
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; 
}

@Component({
  selector: 'app-appointments-page', 
  standalone: true,
  imports: [CommonModule, FormsModule, ClinicalPage],
  templateUrl: './appointments-page.html', 
  styleUrl: '.././data-page.scss'
})
export class AppointmentsPage implements OnInit {
  
  // 1. Entradas e Injeções
  @Input() mode: 'list' | 'create' | 'queue' | 'today' = 'list';
  readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly labels = STATUS_LABEL;
  
  // 2. Estado de Dados
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  
  // 3. Controles de Tela e Mensagens
  loading = false;
  busy = false;
  error = '';
  success = '';
  
  // 4. Filtros e Pesquisa
  dateFilter = '';
  doctorFilter = '';
  statusFilter = '';
  search = '';
  
  // 5. Estado do Formulário de Agendamento
  showCreate = false;
  specialty = '';
  doctorId = '';
  patientId = '';
  date = localDate();
  time = '';
  
  // 6. Estado do Prontuário Clínico (Integração com clinical-service)
  selected: Appointment | null = null;
  recordSaved = false;
  record: RecordRequest = this.emptyRecord();

  // 7. Propriedades Computadas (Getters)
  get role() { 
    return this.auth.claims?.role; 
  }
  
  get canSchedule() { 
    return this.role !== 'MEDICO'; 
  }
  
  get staff() { 
    return this.role === 'RECEPCAO' || this.role === 'ADMIN'; 
  }
  
  get specialties() { 
    return [...new Set(this.doctors.map(d => d.especialidade))].sort(); 
  }
  
  get availableDoctors() { 
    return this.doctors.filter(d => !this.specialty || d.especialidade === this.specialty); 
  }
  
  get visible() {
    return this.appointments.filter(a => 
      (!this.dateFilter || a.dataHoraConsulta.startsWith(this.dateFilter)) &&
      (!this.doctorFilter || a.doctorId === this.doctorFilter) && 
      (!this.statusFilter || a.status === this.statusFilter) &&
      (this.mode !== 'queue' || ['EM_ESPERA', 'EM_ATENDIMENTO'].includes(a.status)) &&
      `${this.doctorName(a.doctorId)} ${this.patientName(a.patientId)}`.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  get availableTimeSlots() {
    const slots = [];
    
    // Filtra todas as consultas ativas do médico escolhido na data selecionada
    const bookedTimes = this.appointments
      .filter(a => a.doctorId === this.doctorId && a.dataHoraConsulta.startsWith(this.date) && a.status !== 'CANCELADA')
      .map(a => a.dataHoraConsulta.split('T')[1].substring(0, 5)); // Pega só o "HH:mm"

    // Roda um loop gerando os horários das 08:00 às 17:30 de 15 em 15 minutos
    for (let h = 8; h <= 17; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 17 && m > 30) break; // O último agendamento é 17:30
        
        // Formata os números para sempre terem 2 casas (ex: "08:00", "14:15")
        const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        
        slots.push({
          time: timeString,
          available: !bookedTimes.includes(timeString) // Se já estiver no banco, marca como indisponível
        });
      }
    }
    return slots;
  }

  // 8. Ciclo de Vida e Inicialização
  ngOnInit() {
    this.showCreate = this.mode === 'create';
    
    // Auto-preenche a data de hoje para os modos de fila de espera ou agenda diária
    if (this.mode === 'today' || this.mode === 'queue') {
      this.dateFilter = localDate();
    }
    
    this.patientId = this.role === 'PACIENTE' ? this.auth.claims!.sub : '';
    this.load();
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    forkJoin({ 
      appointments: this.api.appointments(), 
      doctors: this.api.all<Doctor>('doctors'),
      patients: this.role === 'PACIENTE' ? of([] as Patient[]) : this.api.all<Patient>('patients')
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: data => { 
        this.appointments = data.appointments; 
        this.doctors = data.doctors; 
        this.patients = data.patients; 
      },
      error: e => this.error = errorMessage(e)
    });
  }

  // 9. Utilitários de Nomes
  doctorName(id: string) { 
    return this.doctors.find(d => d.id === id)?.nome ?? 'Médico indisponível'; 
  }
  
  patientName(id: string) { 
    return this.patients.find(p => p.id === id)?.nome ?? (id === this.auth.claims?.sub ? 'Você' : 'Paciente indisponível'); 
  }

  // 10. Ações de Agendamento e Mudança de Status
  schedule() {
    if (this.busy || !this.doctorId || !this.patientId || !this.date || !this.time) return;
    
    this.busy = true; 
    this.error = ''; 
    this.success = '';
    
    this.api.schedule({ 
      doctorId: this.doctorId, 
      patientId: this.patientId, 
      dataHoraConsulta: `${this.date}T${this.time}:00` 
    })
    .pipe(finalize(() => this.busy = false))
    .subscribe({ 
      next: () => {
        this.success = 'Consulta agendada com sucesso.'; 
        this.showCreate = false; 
        this.load();
      }, 
      error: e => this.error = errorMessage(e) 
    });
  }

  change(a: Appointment, status: AppointmentStatus) {
    if (this.busy) return;
    if (status === 'CANCELADA' && !confirm('Cancelar esta consulta?')) return;
    
    this.busy = true; 
    this.error = ''; 
    this.success = '';
    
    this.api.status(a.id, status)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: updated => {
          this.appointments = this.appointments.map(row => row.id === updated.id ? updated : row);
          this.success = 'Consulta atualizada.';
          
          // Se o médico iniciar o atendimento, abre automaticamente o modal de Prontuário
          if (status === 'EM_ATENDIMENTO') this.openRecord(updated);
          // Se concluir a consulta, fecha o modal
          if (status === 'REALIZADA') this.selected = null;
        }, 
        error: e => this.error = errorMessage(e) 
      });
  }

  isPast(a: Appointment) { 
    return new Date(a.dataHoraConsulta) < new Date(); 
  }

  // 11. Gestão de Prontuários (Integração de Receitas e Sinais Vitais)
  openRecord(a: Appointment) {
    this.selected = a; 
    this.recordSaved = false; 
    this.record = this.emptyRecord();
    this.record.patientId = a.patientId; 
    this.record.appointmentId = a.id;
    
    this.busy = true; 
    this.error = '';
    
    this.api.recordForAppointment(a.id)
      .pipe(finalize(() => this.busy = false))
      .subscribe({
        next: existing => { 
          // Mescla os dados recebidos com a estrutura vazia de segurança
          this.record = { 
            ...this.record, 
            ...existing, 
            privateNotes: existing.privateNotes ?? undefined, 
            vitals: existing.vitals ?? undefined, 
            prescriptions: existing.prescriptions ?? [] 
          }; 
          this.recordSaved = true; 
        },
        error: e => { 
          // 404 é esperado se for o primeiro atendimento desta consulta
          if (e.status !== 404) { 
            this.error = errorMessage(e); 
            this.selected = null; 
          } 
        }
      });
  }

  addPrescription() { 
    this.record.prescriptions.push({ 
      medicationName: '', 
      dosage: '', 
      instructions: '', 
      validUntil: this.date 
    }); 
  }

  saveRecord() {
    if (this.busy || !this.selected) return;
    
    this.busy = true; 
    this.error = ''; 
    this.success = '';
    
    this.api.createRecord(this.record)
      .pipe(finalize(() => this.busy = false))
      .subscribe({
        next: () => { 
          this.recordSaved = true; 
          this.success = 'Prontuário salvo. Você já pode concluir a consulta.'; 
        },
        error: e => this.error = errorMessage(e)
      });
  }

  private emptyRecord(): RecordRequest { 
    return { 
      patientId: '', 
      appointmentId: '', 
      recordTitle: '', 
      clinicalDescription: '', 
      privateNotes: '', 
      vitals: { weightKg: null, heightMeters: null, bloodPressure: null }, 
      prescriptions: [] 
    }; 
  }
}