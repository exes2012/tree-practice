import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalsPageComponent } from './components/goals-page/goals-page.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';
import { SelectPracticeTypeComponent } from './components/select-practice-type/select-practice-type.component';



const routes: Routes = [
  {
    path: '',
    component: GoalsPageComponent,
  },
  {
    path: 'new',
    component: GoalFormComponent,
  },
  {
    path: ':id',
    component: GoalDetailComponent,
  },
  {
    path: ':id/edit',
    component: GoalFormComponent,
  },
  {
    path: ':id/add-practice',
    component: SelectPracticeTypeComponent,
  },

  {
    path: ':id/practice/man-with-goal',
    redirectTo: (route) => `/practices/goals/man-with-goal/${route.params['id']}`,
  },
  {
    path: ':id/practice/alignment',
    redirectTo: (route) => `/practices/goals/alignment/${route.params['id']}`,
  },
  {
    path: ':id/practice/identification',
    redirectTo: (route) => `/practices/goals/identification/${route.params['id']}`,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoalsRoutingModule {}
