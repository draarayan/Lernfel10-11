import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeierComponent } from './feier.component';

describe('FeierComponent', () => {
  let component: FeierComponent;
  let fixture: ComponentFixture<FeierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
