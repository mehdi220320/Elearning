import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackathonsComponent } from './hackathons.component';

describe('HackathonsComponent', () => {
  let component: HackathonsComponent;
  let fixture: ComponentFixture<HackathonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HackathonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackathonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
