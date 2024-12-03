import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EigenesComponent } from './eigenes.component';

describe('EigenesComponent', () => {
  let component: EigenesComponent;
  let fixture: ComponentFixture<EigenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EigenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EigenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
