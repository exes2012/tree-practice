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

import { SpaceClarificationPracticeComponent } from './components/man-practice/space-clarification-practice.component';

import { CreatorJustificationPracticeComponent } from './components/man-practice/creator-justification-practice.component';
import { FourStagesPracticeComponent } from './components/basic-exercises/four-stages-practice/four-stages-practice.component';
import { KeterTuningPracticeComponent } from './components/basic-exercises/keter-tuning-practice/keter-tuning-practice.component';
import { PracticeRunnerDemoComponent } from './components/practice-runner-demo/practice-runner-demo.component';

const routes: Routes = [
  {
    path: 'intention',
    component: IntentionPracticeComponent,
  },
  {
    path: 'intention/exercise',
    component: IntentionExercisePageComponent,
  },
  {
    path: 'basic',
    component: BasicExercisesComponent,
  },
  {
    path: 'basic/four-stages',
    component: FourStagesPracticeComponent,
  },
  {
    path: 'basic/keter-tuning',
    component: KeterTuningPracticeComponent,
  },
  {
    path: 'small-state',
    component: SmallStatePracticeComponent,
  },
  {
    path: 'small-state/creator-space',
    redirectTo: 'runner/small-state-creator-space',
  },
  {
    path: 'small-state/zeir-anpin-space',
    redirectTo: 'runner/small-state-zeir-anpin-space',
  },
  {
    path: 'small-state/netz-hod-line',
    redirectTo: 'runner/small-state-netz-hod-line',
  },
  {
    path: 'small-state/hesed-gevurah-line',
    redirectTo: 'runner/small-state-hesed-gevurah-line',
  },
  {
    path: 'man',
    component: ManPracticeComponent,
  },

  {
    path: 'man/space-clarification',
    component: SpaceClarificationPracticeComponent,
  },

  {
    path: 'man/creator-justification',
    component: CreatorJustificationPracticeComponent,
  },
  {
    path: 'goals',
    component: GoalsPracticeComponent,
  },
  {
    path: 'fall-recovery',
    component: FallRecoveryComponent,
  },
  // Новая архитектура - тестовые роуты
  {
    path: 'runner/:practiceId',
    component: PracticeRunnerDemoComponent,
  },
  {
    path: 'runner/:practiceId/:goalId',
    component: PracticeRunnerDemoComponent,
  },
  // Small State Practices на новом движке
  {
    path: 'small-state-v2/creator-space',
    redirectTo: 'runner/small-state-creator-space',
  },
  {
    path: 'small-state-v2/zeir-anpin-space',
    redirectTo: 'runner/small-state-zeir-anpin-space',
  },
  {
    path: 'small-state-v2/netz-hod-line',
    redirectTo: 'runner/small-state-netz-hod-line',
  },
  {
    path: 'small-state-v2/hesed-gevurah-line',
    redirectTo: 'runner/small-state-hesed-gevurah-line',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PracticesRoutingModule {}
