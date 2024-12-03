import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreffenComponent } from './treffen.component';

describe('TreffenComponent', () => {
  let component: TreffenComponent;
  let fixture: ComponentFixture<TreffenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreffenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreffenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
