import { Component } from '@angular/core';
import { AppointmentsPage } from '../../../shared/appointments-page';
@Component({ selector: 'app-patient-appointments', standalone: true, imports: [AppointmentsPage], templateUrl: './appointments.html' })
export class Appointments {}
