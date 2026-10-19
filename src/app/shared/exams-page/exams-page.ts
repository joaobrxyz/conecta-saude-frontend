import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Exam, Patient } from '../../core/api.models';

@Component({ 
  selector: 'app-exams-page', 
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './exams-page.html', 
  styleUrl: '.././data-page.scss' 
})
export class ExamsPage implements OnInit {
  
  // 1. Entradas e Injeções
  @Input() doctorMode = false;
  readonly auth = inject(AuthService); 
  private api = inject(ApiService);

  // 2. Variáveis de Estado (Dados)
  exams: Exam[] = []; 
  patients: Patient[] = []; 
  patientId = ''; 
  title = ''; 
  file: File | null = null;

  // 3. Variáveis de Controle de Tela
  loading = false; 
  busy = false; 
  error = ''; 
  success = '';

  // 4. Inicialização
  ngOnInit() { 
    // Se for médico, não tem paciente pré-definido. Se for paciente, pega o ID do token JWT.
    this.patientId = this.doctorMode ? '' : this.auth.claims?.sub ?? ''; 
    
    // O médico precisa ver a lista de pacientes primeiro. O paciente já carrega os exames direto.
    if (this.doctorMode) {
      this.loadPatients(); 
    } else {
      this.load(); 
    }
  }

  // 5. Busca de Dados
  loadPatients() { 
    this.api.all<Patient>('patients').subscribe({ 
      next: rows => this.patients = rows, 
      error: error => this.error = errorMessage(error) 
    }); 
  }

  load() { 
    if (!this.patientId) { 
      this.exams = []; 
      return; 
    } 
    
    this.loading = true; 
    this.error = ''; 
    
    // O operador finalize garante que o loading será false mesmo se der erro
    this.api.exams(this.patientId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({ 
        next: rows => this.exams = rows, 
        error: error => this.error = errorMessage(error) 
      }); 
  }

  // 6. Manipulação de Arquivos (Upload/Download)
  chooseFile(event: Event) { 
    const input = event.target as HTMLInputElement;
    this.file = input.files?.item(0) ?? null; 
  }

  upload() { 
    // Validação de segurança antes de enviar
    if (!this.file || !this.title.trim() || !this.patientId || this.busy) return; 
    
    this.busy = true; 
    this.error = ''; 
    this.success = ''; 
    
    this.api.uploadExam(this.patientId, this.title.trim(), this.file)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: () => { 
          this.title = ''; 
          this.file = null; 
          this.success = 'Exame enviado com sucesso.'; 
          this.load(); // Atualiza a lista automaticamente após o envio
        }, 
        error: error => this.error = errorMessage(error) 
      }); 
  }

  download(exam: Exam) { 
    this.busy = true; 
    this.error = ''; 
    
    this.api.downloadExam(exam.id)
      .pipe(finalize(() => this.busy = false))
      .subscribe({ 
        next: blob => { 
          // Cria uma URL temporária no navegador para forçar o download do arquivo
          const url = URL.createObjectURL(blob); 
          const link = document.createElement('a'); 
          link.href = url; 
          link.download = exam.fileName; 
          link.click(); 
          URL.revokeObjectURL(url); // Limpa a memória
        }, 
        error: error => this.error = errorMessage(error) 
      }); 
  }

  // 7. Utilidades
  fileSize(size: number) { 
    return size < 1024 * 1024 
      ? Math.ceil(size / 1024) + ' KB' 
      : (size / (1024 * 1024)).toFixed(1) + ' MB'; 
  }
}