import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyreclamationsComponent } from './myreclamations.component';

describe('MyreclamationsComponent', () => {
  let component: MyreclamationsComponent;
  let fixture: ComponentFixture<MyreclamationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyreclamationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyreclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
