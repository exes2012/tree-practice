import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticesRoutingModule } from './practices-routing.module';
import { IntentionPracticeComponent } from './components/intention-practice/intention-practice.component';
import { BasicExercisesComponent } from './components/basic-exercises/basic-exercises.component';
import { SmallStatePracticeComponent } from './components/small-state-practice/small-state-practice.component';
import { ManPracticeComponent } from './components/man-practice/man-practice.component';
import { GoalsPracticeComponent } from './components/goals-practice/goals-practice.component';
import { FallRecoveryComponent } from './components/fall-recovery/fall-recovery.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PracticesRoutingModule,
    IntentionPracticeComponent,
    BasicExercisesComponent,
    SmallStatePracticeComponent,
    ManPracticeComponent,
    GoalsPracticeComponent,
    FallRecoveryComponent
  ]
})
export class PracticesModule { }
