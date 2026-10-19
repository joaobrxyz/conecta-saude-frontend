import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expand, map, reduce, EMPTY } from 'rxjs';
import { Appointment, AppointmentRequest, AppointmentStatus, Doctor, Exam, MedicalRecord, Page, Patient, Prescription, RecordRequest, RecordSummary, Resource, Specialty, User, UserInput, Vitals } from './api.models';

export const API_URL = new InjectionToken<string>('API_URL', { providedIn: 'root', factory: () => '/api' });

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  readonly url = inject(API_URL);
  list<T>(resource: Resource, page = 0, size = 10) { return this.http.get<Page<T>>(`${this.url}/${resource}`, { params: { page, size } }); }
  // Selectors and statistics consume every page instead of silently truncating at ten rows.
  all<T>(resource: Resource) {
    return this.list<T>(resource, 0, 100).pipe(
      expand(page => page.last || page.number + 1 >= page.totalPages ? EMPTY : this.list<T>(resource, page.number + 1, 100)),
      map(page => page.content), reduce((rows, page) => rows.concat(page), [] as T[]));
  }
  getUser<T extends User>(resource: Resource, id: string) { return this.http.get<T>(`${this.url}/${resource}/${id}`); }
  profile(resource: Resource) { return this.http.get<User | Patient | Doctor>(`${this.url}/${resource}/profile`); }
  updateProfile(resource: Resource, data: UserInput) { return this.http.patch<User>(`${this.url}/${resource}/profile`, data); }
  createUser(resource: Resource, data: UserInput) { return this.http.post<void>(`${this.url}/${resource}`, data); }
  updateUser(resource: Resource, id: string, data: UserInput) {
    return resource === 'receptionists' ? this.http.put<User>(`${this.url}/${resource}/${id}`, data) : this.http.patch<User | void>(`${this.url}/${resource}/${id}`, data);
  }
  deleteUser(resource: Resource, id: string) { return this.http.delete<void>(`${this.url}/${resource}/${id}`); }
  specialties() { return this.http.get<Specialty[]>(`${this.url}/specialties`); }
  createSpecialty(nome: string) { return this.http.post<Specialty>(`${this.url}/specialties`, { nome }); }
  appointments() { return this.http.get<Appointment[]>(`${this.url}/appointments`); }
  schedule(data: AppointmentRequest) { return this.http.post<AppointmentRequest>(`${this.url}/appointments`, data); }
  status(id: string, status: AppointmentStatus) { return this.http.patch<Appointment>(`${this.url}/appointments/${id}/status`, { status }); }
  history(id: string) { return this.http.get<RecordSummary[]>(`${this.url}/records/patient/${id}`); }
  recordForAppointment(id: string) { return this.http.get<MedicalRecord>(`${this.url}/records/appointment/${id}`); }
  changePassword(senhaAtual: string, novaSenha: string) { return this.http.patch<void>(`${this.url}/account/password`, { senhaAtual, novaSenha }); }
  record(id: string) { return this.http.get<MedicalRecord>(`${this.url}/records/${id}`); }
  vitals(id: string) { return this.http.get<Vitals | null>(`${this.url}/records/patient/${id}/vitals/latest`); }
  prescriptions(id: string) { return this.http.get<Prescription[]>(`${this.url}/records/patient/${id}/prescriptions`); }
  createRecord(data: RecordRequest) { return this.http.post<RecordSummary>(`${this.url}/records`, data); }
  addendum(id: string, text: string) { return this.http.patch<void>(`${this.url}/records/${id}/addendum`, text, { headers: { 'Content-Type': 'text/plain' } }); }
  exams(patientId: string) { return this.http.get<Exam[]>(`${this.url}/exams/patient/${patientId}`); }
  uploadExam(patientId: string, title: string, file: File) {
    const data = new FormData(); data.set('patientId', patientId); data.set('title', title); data.set('file', file, file.name);
    return this.http.post<Exam>(`${this.url}/exams`, data);
  }
  downloadExam(id: string) { return this.http.get(`${this.url}/exams/${id}/download`, { responseType: 'blob' }); }
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Não foi possível concluir a operação.';
  const body = error.error;
  if (Array.isArray(body)) return body.map((item: { mensagem?: string; message?: string }) => item.mensagem ?? item.message ?? '').filter(Boolean).join(' ') || 'Verifique os dados informados.';
  if (typeof body === 'string' && !body.includes('<')) return body;
  if (Array.isArray(body?.erros)) return body.erros.map((item: { mensagem: string }) => item.mensagem).join(' ');
  if (typeof body?.message === 'string') return body.message;
  if (error.status === 0) return 'Não foi possível conectar ao servidor. Verifique se os serviços estão em execução.';
  if (error.status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (error.status === 403) return 'Você não tem permissão para esta operação.';
  if (error.status === 404) return 'Recurso não encontrado. Verifique se os serviços estão atualizados.';
  if (error.status >= 500) return 'O servidor não conseguiu concluir a operação. Tente novamente.';
  return 'Verifique os dados e tente novamente.';
}
