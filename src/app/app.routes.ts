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
    path: 'notes',
    loadChildren: () => import('./features/notes/notes.module').then(m => m.NotesModule)
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
    path: 'theory',
    loadChildren: () => import('./features/theory/theory.module').then(m => m.TheoryModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'goals',
    loadChildren: () => import('./features/goals/goals.module').then(m => m.GoalsModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule)
  }
];