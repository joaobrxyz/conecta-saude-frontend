import { portalTestProviders } from '../../../core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCreate } from './appointment-create';

describe('AppointmentCreate', () => {
  let component: AppointmentCreate;
  let fixture: ComponentFixture<AppointmentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: portalTestProviders('PACIENTE'),
      imports: [AppointmentCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
