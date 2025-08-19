import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PracticesRoutingModule } from './practices-routing.module';
import { IntentionPracticeComponent } from './components/intention-practice/intention-practice.component';
import { IntentionExercisePageComponent } from './components/intention-practice/intention-exercise-page.component';
import { BasicExercisesComponent } from './components/basic-exercises/basic-exercises.component';
import { SmallStatePracticeComponent } from './components/small-state-practice/small-state-practice.component';
import { ManPracticeComponent } from './components/man-practice/man-practice.component';
import { GoalsPracticeComponent } from './components/goals-practice/goals-practice.component';
import { FallRecoveryComponent } from './components/fall-recovery/fall-recovery.component';

import { SpaceClarificationPracticeComponent } from './components/man-practice/space-clarification-practice.component';

import { CreatorJustificationPracticeComponent } from './components/man-practice/creator-justification-practice.component';
import { FourStagesPracticeComponent } from './components/basic-exercises/four-stages-practice/four-stages-practice.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    PracticesRoutingModule,
    IntentionPracticeComponent,
    IntentionExercisePageComponent,
    BasicExercisesComponent,
    SmallStatePracticeComponent,
    ManPracticeComponent,
    GoalsPracticeComponent,
    FallRecoveryComponent,

    SpaceClarificationPracticeComponent,

    CreatorJustificationPracticeComponent,
    FourStagesPracticeComponent,
  ],
})
export class PracticesModule {}
