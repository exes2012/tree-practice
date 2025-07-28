import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPracticeComponent } from './man-practice.component';

describe('ManPracticeComponent', () => {
  let component: ManPracticeComponent;
  let fixture: ComponentFixture<ManPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
