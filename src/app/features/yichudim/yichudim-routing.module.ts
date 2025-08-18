import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YichudimPageComponent } from './components/yichudim-page/yichudim-page.component';
import { BreathingJoyPracticeComponent } from './components/breathing-joy-practice/breathing-joy-practice.component';
import { CandleFlamePracticeComponent } from './components/candle-flame-practice/candle-flame-practice.component';
import { DivineSpacePracticeComponent } from './components/divine-space-practice/divine-space-practice.component';
import { GratitudePracticeComponent } from './components/gratitude-practice/gratitude-practice.component';
import { LovePracticeComponent } from './components/love-practice/love-practice.component';
import { ShabbatPracticeComponent } from './components/shabbat-practice/shabbat-practice.component';
import { SeventyTwoNamesPracticeComponent } from './components/seventy-two-names-practice/seventy-two-names-practice.component';
import { TetragrammatonPracticeComponent } from './components/tetragrammaton-practice/tetragrammaton-practice.component';

const routes: Routes = [
  { path: '', component: YichudimPageComponent },
  { path: 'breathing-joy', component: BreathingJoyPracticeComponent },
  { path: 'candle-flame', component: CandleFlamePracticeComponent },
  { path: 'divine-space', component: DivineSpacePracticeComponent },
  { path: 'gratitude', component: GratitudePracticeComponent },
  { path: 'love', component: LovePracticeComponent },
  { path: 'seventy-two-names', component: SeventyTwoNamesPracticeComponent },
  { path: 'shabbat', component: ShabbatPracticeComponent },
  { path: 'tetragrammaton', component: TetragrammatonPracticeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YichudimRoutingModule {}
