import { Component } from '@angular/core';
import { ExamsPage } from '../../../shared/exams-page/exams-page';
@Component({ selector: 'app-doctor-exams', standalone: true, imports: [ExamsPage], template: '<app-exams-page [doctorMode]="true"></app-exams-page>' })
export class DoctorExams {}
