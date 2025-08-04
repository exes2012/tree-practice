import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalsPageComponent } from './components/goals-page/goals-page.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';
import { SelectPracticeTypeComponent } from './components/select-practice-type/select-practice-type.component';

import { GoalManPracticeComponent } from './components/practices/goal-man-practice/goal-man-practice.component';
import { GoalAlignmentPracticeComponent } from './components/practices/goal-alignment-practice/goal-alignment-practice.component';
import { GoalIdentificationPracticeComponent } from './components/practices/goal-identification-practice/goal-identification-practice.component';

const routes: Routes = [
  {
    path: '',
    component: GoalsPageComponent
  },
  {
    path: 'new',
    component: GoalFormComponent
  },
  {
    path: ':id',
    component: GoalDetailComponent
  },
  {
    path: ':id/edit',
    component: GoalFormComponent
  },
  {
    path: ':id/add-practice',
    component: SelectPracticeTypeComponent
  },

  {
    path: ':id/practice/man-with-goal',
    component: GoalManPracticeComponent
  },
  {
    path: ':id/practice/alignment',
    component: GoalAlignmentPracticeComponent
  },
  {
    path: ':id/practice/identification',
    component: GoalIdentificationPracticeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalsRoutingModule { }
