import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnfrageListeComponent } from './anfrage-liste.component';

describe('AnfrageListeComponent', () => {
  let component: AnfrageListeComponent;
  let fixture: ComponentFixture<AnfrageListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnfrageListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnfrageListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
