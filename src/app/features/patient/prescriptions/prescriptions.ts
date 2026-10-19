import { Component } from '@angular/core';
import { ClinicalPage } from '../../../shared/clinical-page/clinical-page';
@Component({ selector: 'app-patient-prescriptions', standalone: true, imports: [ClinicalPage], templateUrl: './prescriptions.html' })
export class Prescriptions {}
