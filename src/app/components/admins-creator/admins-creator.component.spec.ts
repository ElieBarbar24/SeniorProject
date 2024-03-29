import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsCreatorComponent } from './admins-creator.component';

describe('AdminsCreatorComponent', () => {
  let component: AdminsCreatorComponent;
  let fixture: ComponentFixture<AdminsCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminsCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
