import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntentionPracticeComponent } from './components/intention-practice/intention-practice.component';
import { IntentionExercisePageComponent } from './components/intention-practice/intention-exercise-page.component';
import { BasicExercisesComponent } from './components/basic-exercises/basic-exercises.component';
import { SmallStatePracticeComponent } from './components/small-state-practice/small-state-practice.component';
import { ManPracticeComponent } from './components/man-practice/man-practice.component';
import { GoalsPracticeComponent } from './components/goals-practice/goals-practice.component';
import { FallRecoveryComponent } from './components/fall-recovery/fall-recovery.component';
import { CreatorSpacePracticeComponent } from './components/small-state-practice/creator-space-practice.component';
import { ZeirAnpinSpacePracticeComponent } from './components/small-state-practice/zeir-anpin-space-practice.component';
import { NetzHodLinePracticeComponent } from './components/small-state-practice/netz-hod-line-practice.component';
import { HesedGevurahLinePracticeComponent } from './components/small-state-practice/hesed-gevurah-line-practice.component';
import { SpecificRequestPracticeComponent } from './components/man-practice/specific-request-practice.component';
import { SpecificRequestPracticeV2Component } from './components/man-practice/specific-request-practice-v2.component';
import { SpaceClarificationPracticeComponent } from './components/man-practice/space-clarification-practice.component';
import { ShekhinahFieldPracticeComponent } from './components/man-practice/shekhinah-field-practice.component';
import { CreatorJustificationPracticeComponent } from './components/man-practice/creator-justification-practice.component';
import { FourStagesPracticeComponent } from './components/basic-exercises/four-stages-practice/four-stages-practice.component';
import { KeterTuningPracticeComponent } from './components/basic-exercises/keter-tuning-practice/keter-tuning-practice.component';

const routes: Routes = [
  {
    path: 'intention',
    component: IntentionPracticeComponent
  },
  {
    path: 'intention/exercise',
    component: IntentionExercisePageComponent
  },
  {
    path: 'basic',
    component: BasicExercisesComponent
  },
  {
    path: 'basic/four-stages',
    component: FourStagesPracticeComponent
  },
  {
    path: 'basic/keter-tuning',
    component: KeterTuningPracticeComponent
  },
  {
    path: 'small-state',
    component: SmallStatePracticeComponent
  },
  {
    path: 'small-state/creator-space',
    component: CreatorSpacePracticeComponent
  },
  {
    path: 'small-state/zeir-anpin-space',
    component: ZeirAnpinSpacePracticeComponent
  },
  {
    path: 'small-state/netz-hod-line',
    component: NetzHodLinePracticeComponent
  },
  {
    path: 'small-state/hesed-gevurah-line',
    component: HesedGevurahLinePracticeComponent
  },
  {
    path: 'man',
    component: ManPracticeComponent
  },
  {
    path: 'man/specific-request',
    component: SpecificRequestPracticeComponent
  },
  {
    path: 'man/specific-request-v2',
    component: SpecificRequestPracticeV2Component
  },
  {
    path: 'man/space-clarification',
    component: SpaceClarificationPracticeComponent
  },
  {
    path: 'man/shekhinah-field',
    component: ShekhinahFieldPracticeComponent
  },
  {
    path: 'man/creator-justification',
    component: CreatorJustificationPracticeComponent
  },
  {
    path: 'goals',
    component: GoalsPracticeComponent
  },
  {
    path: 'fall-recovery',
    component: FallRecoveryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticesRoutingModule { }