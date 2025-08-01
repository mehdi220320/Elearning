import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapitresComponent } from './chapitres.component';

describe('ChapitresComponent', () => {
  let component: ChapitresComponent;
  let fixture: ComponentFixture<ChapitresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapitresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapitresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
