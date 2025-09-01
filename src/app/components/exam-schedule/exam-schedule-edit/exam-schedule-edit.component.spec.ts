import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamScheduleEditComponent } from './exam-schedule-edit.component';

describe('ExamScheduleEditComponent', () => {
  let component: ExamScheduleEditComponent;
  let fixture: ComponentFixture<ExamScheduleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamScheduleEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamScheduleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
