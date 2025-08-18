import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YichudimPageComponent } from './yichudim-page.component';

describe('YichudimPageComponent', () => {
  let component: YichudimPageComponent;
  let fixture: ComponentFixture<YichudimPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YichudimPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YichudimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
