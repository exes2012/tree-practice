import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourStagesPracticeComponent } from './four-stages-practice.component';

describe('FourStagesPracticeComponent', () => {
  let component: FourStagesPracticeComponent;
  let fixture: ComponentFixture<FourStagesPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourStagesPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourStagesPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
