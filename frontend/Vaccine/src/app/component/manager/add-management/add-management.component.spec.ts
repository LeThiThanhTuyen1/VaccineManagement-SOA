import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagementComponent } from './add-management.component';

describe('AddManagementComponent', () => {
  let component: AddManagementComponent;
  let fixture: ComponentFixture<AddManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
