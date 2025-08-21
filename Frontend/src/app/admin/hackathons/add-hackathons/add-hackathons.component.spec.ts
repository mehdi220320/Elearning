import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHackathonsComponent } from './add-hackathons.component';

describe('AddHackathonsComponent', () => {
  let component: AddHackathonsComponent;
  let fixture: ComponentFixture<AddHackathonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHackathonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHackathonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
