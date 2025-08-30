import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHackathonComponent } from './update-hackathon.component';

describe('UpdateHackathonComponent', () => {
  let component: UpdateHackathonComponent;
  let fixture: ComponentFixture<UpdateHackathonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateHackathonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHackathonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
