import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotesPageComponent } from './components/notes-page/notes-page.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';

const routes: Routes = [
  {
    path: '',
    component: NotesPageComponent,
  },
  {
    path: 'new',
    component: NoteEditorComponent,
  },
  {
    path: ':id',
    component: NoteEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NotesPageComponent, NoteEditorComponent],
  exports: [RouterModule],
})
export class NotesModule {}
