import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChapitreComponent } from './add-chapitre.component';

describe('AddChapitreComponent', () => {
  let component: AddChapitreComponent;
  let fixture: ComponentFixture<AddChapitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddChapitreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChapitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
