import { portalTestProviders } from '../../../core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schedule } from './schedule';

describe('Schedule', () => {
  let component: Schedule;
  let fixture: ComponentFixture<Schedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: portalTestProviders('MEDICO'),
      imports: [Schedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Schedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
