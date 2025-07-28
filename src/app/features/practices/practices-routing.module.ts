import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntentionPracticeComponent } from './components/intention-practice/intention-practice.component';
import { BasicExercisesComponent } from './components/basic-exercises/basic-exercises.component';
import { SmallStatePracticeComponent } from './components/small-state-practice/small-state-practice.component';
import { ManPracticeComponent } from './components/man-practice/man-practice.component';
import { GoalsPracticeComponent } from './components/goals-practice/goals-practice.component';
import { FallRecoveryComponent } from './components/fall-recovery/fall-recovery.component';

const routes: Routes = [
  {
    path: 'intention',
    component: IntentionPracticeComponent
  },
  {
    path: 'basic-exercises',
    component: BasicExercisesComponent
  },
  {
    path: 'small-state',
    component: SmallStatePracticeComponent
  },
  {
    path: 'man',
    component: ManPracticeComponent
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
