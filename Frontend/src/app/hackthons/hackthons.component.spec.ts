import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackthonsComponent } from './hackthons.component';

describe('HackthonsComponent', () => {
  let component: HackthonsComponent;
  let fixture: ComponentFixture<HackthonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HackthonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackthonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
