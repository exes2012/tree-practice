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
import { CreatorSpacePracticeComponent } from './components/small-state-practice/creator-space-practice.component';
import { ZeirAnpinSpacePracticeComponent } from './components/small-state-practice/zeir-anpin-space-practice.component';
import { SpecificRequestPracticeComponent } from './components/man-practice/specific-request-practice.component';
import { SpecificRequestPracticeV2Component } from './components/man-practice/specific-request-practice-v2.component';
import { SpaceClarificationPracticeComponent } from './components/man-practice/space-clarification-practice.component';
import { ShekhinahFieldPracticeComponent } from './components/man-practice/shekhinah-field-practice.component';
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
    CreatorSpacePracticeComponent,
    ZeirAnpinSpacePracticeComponent,
    SpecificRequestPracticeComponent,
    SpecificRequestPracticeV2Component,
    SpaceClarificationPracticeComponent,
    ShekhinahFieldPracticeComponent,
    CreatorJustificationPracticeComponent,
    FourStagesPracticeComponent
  ]
})
export class PracticesModule { }