export type Role = 'PACIENTE' | 'MEDICO' | 'RECEPCAO' | 'ADMIN';
export type Resource = 'patients' | 'doctors' | 'receptionists' | 'admins';
export interface User { id: string; nome: string; email: string; telefone: string; }
export interface Patient extends User { cpf: string; }
export interface Doctor extends User { crm: string; especialidade: string; }
export interface Specialty { id: number; nome: string; }
export interface Page<T> { content: T[]; totalElements: number; totalPages: number; number: number; size: number; last: boolean; }
export interface Tokens { accessToken: string; refreshToken: string; }
export interface Claims { sub: string; role: Role; exp: number; }
export type AppointmentStatus = 'AGENDADA' | 'EM_ESPERA' | 'EM_ATENDIMENTO' | 'REALIZADA' | 'CANCELADA' | 'NAO_COMPARECEU';
export interface Appointment { id: string; doctorId: string; patientId: string; dataHoraConsulta: string; status: AppointmentStatus; }
export interface AppointmentRequest { doctorId: string; patientId: string; dataHoraConsulta: string; }
export interface Vitals { weightKg: number | null; heightMeters: number | null; bloodPressure: string | null; }
export interface PrescriptionInput { medicationName: string; dosage: string; instructions: string; validUntil: string; }
export interface Prescription extends PrescriptionInput { doctorName: string; doctorSpecialty: string; issueDate: string; isActive: boolean; }
export interface RecordSummary { id: string; date: string; recordTitle: string; doctorName: string; doctorSpecialty: string; clinicalDescription: string; }
export interface MedicalRecord { id: string; patientId: string; appointmentId: string; doctorId: string; doctorName: string; doctorSpecialty: string; recordTitle: string; clinicalDescription: string; privateNotes?: string | null; vitals: Vitals | null; prescriptions: PrescriptionInput[] | null; createdAt: string; }
export interface RecordRequest { patientId: string; appointmentId: string; recordTitle: string; clinicalDescription: string; privateNotes?: string; vitals?: Vitals; prescriptions: PrescriptionInput[]; }
export interface UserInput { nome: string; email: string; telefone: string; senha?: string; cpf?: string; crm?: string; especialidadeId?: number; }
export const ROLE_PATH: Record<Role, string> = { PACIENTE: 'paciente', MEDICO: 'medico', RECEPCAO: 'recepcao', ADMIN: 'admin' };
export const ROLE_RESOURCE: Record<Role, Resource> = { PACIENTE: 'patients', MEDICO: 'doctors', RECEPCAO: 'receptionists', ADMIN: 'admins' };
export const ROLE_LABEL: Record<Role, string> = { PACIENTE: 'Paciente', MEDICO: 'Médico', RECEPCAO: 'Recepção', ADMIN: 'Administrador' };
export const STATUS_LABEL: Record<AppointmentStatus, string> = { AGENDADA: 'Agendada', EM_ESPERA: 'Em espera', EM_ATENDIMENTO: 'Em atendimento', REALIZADA: 'Realizada', CANCELADA: 'Cancelada', NAO_COMPARECEU: 'Não compareceu' };
