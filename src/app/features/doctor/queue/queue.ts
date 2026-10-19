import { Component } from '@angular/core';
import { AppointmentsPage } from '../../../shared/appointments-page/appointments-page';
@Component({ selector: 'app-doctor-queue', standalone: true, imports: [AppointmentsPage], templateUrl: './queue.html' })
export class Queue {}
