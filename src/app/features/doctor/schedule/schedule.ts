import { Component } from '@angular/core';
import { AppointmentsPage } from '../../../shared/appointments-page';
@Component({ selector: 'app-doctor-schedule', standalone: true, imports: [AppointmentsPage], templateUrl: './schedule.html' })
export class Schedule {}
