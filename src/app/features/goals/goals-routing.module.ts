import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalsPageComponent } from './components/goals-page/goals-page.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';
import { SelectPracticeTypeComponent } from './components/select-practice-type/select-practice-type.component';
import { IdentificationPracticeComponent } from './components/practices/identification-practice/identification-practice.component';
import { ManWithGoalPracticeComponent } from './components/practices/man-with-goal-practice/man-with-goal-practice.component';
import { AlignmentPracticeComponent } from './components/practices/alignment-practice/alignment-practice.component';

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
    path: ':id/practice/identification',
    component: IdentificationPracticeComponent
  },
  {
    path: ':id/practice/man-with-goal',
    component: ManWithGoalPracticeComponent
  },
  {
    path: ':id/practice/alignment',
    component: AlignmentPracticeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalsRoutingModule { }
