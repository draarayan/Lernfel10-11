import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinkaufenComponent } from './einkaufen.component';

describe('EinkaufenComponent', () => {
  let component: EinkaufenComponent;
  let fixture: ComponentFixture<EinkaufenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EinkaufenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinkaufenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
