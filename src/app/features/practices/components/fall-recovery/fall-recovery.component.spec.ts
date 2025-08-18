import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallRecoveryComponent } from './fall-recovery.component';

describe('FallRecoveryComponent', () => {
  let component: FallRecoveryComponent;
  let fixture: ComponentFixture<FallRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallRecoveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FallRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
