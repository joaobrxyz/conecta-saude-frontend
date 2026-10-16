import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { ApiService, errorMessage } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { MedicalRecord, Prescription, RecordSummary, Vitals } from '../core/api.models';

@Component({ selector: 'app-clinical-page', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './clinical-page.html', styleUrl: './data-page.scss' })
export class ClinicalPage implements OnChanges {
  @Input() patientId = '';
  @Input() mode: 'record' | 'prescriptions' = 'record';
  readonly auth = inject(AuthService);
  private api = inject(ApiService);
  records: RecordSummary[] = [];
  prescriptions: Prescription[] = [];
  vitals: Vitals | null = null;
  detail: MedicalRecord | null = null;
  loading = false;
  busy = false;
  error = '';
  success = '';
  addendum = '';
  filter = '';
  get visiblePrescriptions() { return this.prescriptions.filter(p => !this.filter || (this.filter === 'active' ? p.isActive : !p.isActive)); }
  ngOnChanges() { this.load(); }
  load() {
    const id = this.patientId || this.auth.claims?.sub;
    if (!id) return;
    this.loading = true; this.error = ''; this.detail = null;
    forkJoin({ records: this.api.history(id), prescriptions: this.api.prescriptions(id), vitals: this.api.vitals(id) })
      .pipe(finalize(() => this.loading = false)).subscribe({ next: data => {
        this.records = data.records; this.prescriptions = data.prescriptions; this.vitals = data.vitals;
      }, error: e => this.error = errorMessage(e) });
  }
  open(id: string) {
    this.busy = true; this.error = ''; this.detail = null; this.addendum = '';
    this.api.record(id).pipe(finalize(() => this.busy = false)).subscribe({ next: d => this.detail = d, error: e => this.error = errorMessage(e) });
  }
  saveAddendum() {
    if (!this.detail || !this.addendum.trim() || this.busy) return;
    const id = this.detail.id; this.busy = true; this.error = '';
    this.api.addendum(id, this.addendum).pipe(finalize(() => this.busy = false)).subscribe({ next: () => {
      this.success = 'Adendo salvo.'; this.open(id);
    }, error: e => this.error = errorMessage(e) });
  }
}
