import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinesListComponent } from './vaccines-list.component';

describe('VaccinesListComponent', () => {
  let component: VaccinesListComponent;
  let fixture: ComponentFixture<VaccinesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaccinesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaccinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
