import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionPracticeComponent } from './intention-practice.component';

describe('IntentionPracticeComponent', () => {
  let component: IntentionPracticeComponent;
  let fixture: ComponentFixture<IntentionPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntentionPracticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntentionPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
