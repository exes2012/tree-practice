import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsPracticeComponent } from './goals-practice.component';

describe('GoalsPracticeComponent', () => {
  let component: GoalsPracticeComponent;
  let fixture: ComponentFixture<GoalsPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
