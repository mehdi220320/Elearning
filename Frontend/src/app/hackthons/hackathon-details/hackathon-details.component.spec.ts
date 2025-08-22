import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackathonDetailsComponent } from './hackathon-details.component';

describe('HackathonDetailsComponent', () => {
  let component: HackathonDetailsComponent;
  let fixture: ComponentFixture<HackathonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HackathonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackathonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
