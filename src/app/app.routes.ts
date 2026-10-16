import { authGuard, childAuthGuard } from './core/auth.guard';
import { AccountPage } from './features/auth/account-page';
import { AppointmentsPage } from './shared/appointments-page';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/patient/dashboard/dashboard';
import { Appointments } from './features/patient/appointments/appointments';
import { Exams } from './features/patient/exams/exams';
import { Prescriptions } from './features/patient/prescriptions/prescriptions';
import { Record } from './features/patient/record/record';
import { Settings } from './features/patient/settings/settings';
import { PatientLayout } from './shared/patient-layout/patient-layout';
import { AppointmentCreate } from './features/patient/appointment-create/appointment-create';
import { DoctorLayout } from './shared/doctor-layout/doctor-layout';
import { Dashboard as DoctorDashboardComponent } from './features/doctor/dashboard/dashboard';
import { Schedule } from './features/doctor/schedule/schedule';
import { Patients as DoctorPatientsComponent } from './features/doctor/patients/patients';
import { Queue as DoctorQueueComponent } from './features/doctor/queue/queue';
import { Settings as DoctorSettingsComponent } from './features/doctor/settings/settings';
import { ReceptionLayout } from './shared/reception-layout/reception-layout';
import { Dashboard as ReceptionDashboardComponent } from './features/reception/dashboard/dashboard';
import { Agenda as ReceptionAgendaComponent } from './features/reception/agenda/agenda';
import { Patients as ReceptionPatientsComponent } from './features/reception/patients/patients';
import { Settings as ReceptionSettingsComponent } from './features/reception/settings/settings';
import { AdminLayout } from './shared/admin-layout/admin-layout';
import { Dashboard as AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { Users as AdminUsersComponent } from './features/admin/users/users';
import { Settings as AdminSettingsComponent } from './features/admin/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: AccountPage, data: { mode: 'register' } },
  { path: 'recuperar-senha', component: AccountPage, data: { mode: 'forgot' } },
  { path: 'redefinir-senha', component: AccountPage, data: { mode: 'reset' } },

  {
    path: 'paciente', canActivate: [authGuard], canActivateChild: [childAuthGuard], data: { role: 'PACIENTE' },
    component: PatientLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'consultas', component: Appointments },
      { path: 'agendar', component: AppointmentCreate },
      { path: 'exames', component: Exams },
      { path: 'prescricoes', component: Prescriptions },
      { path: 'prontuario', component: Record },
      { path: 'configuracoes', component: Settings }
    ]
  },
  {
    path: 'medico', canActivate: [authGuard], canActivateChild: [childAuthGuard], data: { role: 'MEDICO' },
    component: DoctorLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'agenda', component: Schedule },
      { path: 'pacientes', component: DoctorPatientsComponent },
      { path: 'fila', component: DoctorQueueComponent },
      { path: 'configuracoes', component: DoctorSettingsComponent }
    ]
  },
  {
    path: 'recepcao', canActivate: [authGuard], canActivateChild: [childAuthGuard], data: { role: 'RECEPCAO' },
    component: ReceptionLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ReceptionDashboardComponent },
      { path: 'agenda', component: ReceptionAgendaComponent },
      { path: 'pacientes', component: ReceptionPatientsComponent },
      { path: 'configuracoes', component: ReceptionSettingsComponent }
    ]
  },
  {
    path: 'admin', canActivate: [authGuard], canActivateChild: [childAuthGuard], data: { role: 'ADMIN' },
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'usuarios', component: AdminUsersComponent },
      { path: 'agenda', component: AppointmentsPage },
      { path: 'configuracoes', component: AdminSettingsComponent }
    ]
  }
  ,{ path: '**', redirectTo: 'login' }
];
