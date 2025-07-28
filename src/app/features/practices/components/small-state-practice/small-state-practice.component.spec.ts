import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallStatePracticeComponent } from './small-state-practice.component';

describe('SmallStatePracticeComponent', () => {
  let component: SmallStatePracticeComponent;
  let fixture: ComponentFixture<SmallStatePracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallStatePracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallStatePracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
