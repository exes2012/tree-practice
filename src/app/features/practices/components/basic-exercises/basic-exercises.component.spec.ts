import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicExercisesComponent } from './basic-exercises.component';

describe('BasicExercisesComponent', () => {
  let component: BasicExercisesComponent;
  let fixture: ComponentFixture<BasicExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicExercisesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
