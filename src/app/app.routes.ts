import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'practices',
    loadChildren: () => import('./features/practices/practices.module').then(m => m.PracticesModule)
  },
  {
    path: 'yichudim',
    loadChildren: () => import('./features/yichudim/yichudim.module').then(m => m.YichudimModule)
  },
  {
    path: 'journal',
    loadChildren: () => import('./features/journal/journal.module').then(m => m.JournalModule)
  },
  {
    path: 'diary',
    loadChildren: () => import('./features/diary/diary.module').then(m => m.DiaryModule)
  },
  {
    path: 'reminders',
    loadChildren: () => import('./features/reminders/reminders.module').then(m => m.RemindersModule)
  },
  {
    path: 'circle',
    loadChildren: () => import('./features/circle/circle.module').then(m => m.CircleModule)
  },
  {
    path: 'theory',
    loadChildren: () => import('./features/theory/theory.module').then(m => m.TheoryModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
  }
];