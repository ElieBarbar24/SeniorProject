import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSchedulerComponent } from './exam-scheduler.component';

describe('ExamSchedulerComponent', () => {
  let component: ExamSchedulerComponent;
  let fixture: ComponentFixture<ExamSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamSchedulerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
