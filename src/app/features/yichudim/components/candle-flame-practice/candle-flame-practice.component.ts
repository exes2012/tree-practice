import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-candle-flame-practice',
  templateUrl: './candle-flame-practice.component.html',
  styleUrls: ['./candle-flame-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent],
})
export class CandleFlamePracticeComponent {
  practiceTitle = 'Пламя свечи';
  practiceSubtitle = 'Движение души как пламени';
  description =
    '«Душа человека – свеча Бога». Мы будем медитировать на движения пламени свечи как отражение движений нашей души. Практика включает физические движения - раскачивание вперед-назад (мужской аспект) и вправо-влево (женский аспект).';
  time = '20 мин';
  level = 'Начальный';
  showTimer = false;

  practiceSteps = [
    {
      title: 'Подготовка',
      instruction:
        'Обратимся к медитации над словами царя Шломо в Книге Мишлей (Притч): «Душа человека – свеча Бога».',
    },
    {
      title: 'Пламя в движении',
      instruction:
        'Пламя свечи все время живо и находится в движении, качаясь в разные стороны. Иногда эти колебания очень сильны, иногда – почти незаметны.',
    },
    {
      title: 'Душа как пламя',
      instruction:
        'Такие же движения совершает живая человеческая душа, свеча Бога: она все время колеблется в разные стороны, стремясь вернуться к своему источнику, Бесконечному Свету Бога.',
    },
    {
      title: 'Тело и душа',
      instruction:
        'В этом физическом мире душа облечена в тело, поэтому колебания души приводят к соответствующим колебаниям тела.',
    },
    {
      title: 'Раскачивание вперед-назад',
      instruction:
        'Давайте встанем прямо и будем раскачиваться. Сначала будем раскачиваться вперед–назад. Такое направление раскачивания отражает мужской аспект нашей души.',
    },
    {
      title: 'Раскачивание вправо-влево',
      instruction:
        'Теперь будем раскачиваться вправо–влево. Раскачивание в этом направлении отражает женский аспект нашей души. Если вы раскачиваетесь стоя, тело должно сгибаться в пояснице.',
    },
    {
      title: 'Тора и молитва',
      instruction:
        'Естественные колебательные движения души, подобные движениям пламени свечи, наиболее ярко проявляются при изучении святой Торы или при молитве из глубины сердца.',
    },
    {
      title: 'Стремление к Свету',
      instruction:
        'Искра Б-га в нас, пламя нашей души, всегда стремится вернуться к Б-жественному Бесконечному Свету и слиться с Ним. Пусть эта искра непрестанно разгорается ярче и ярче. Как бы ни мы колебались, любое наше движение направлено к Тебе.',
    },
    { title: 'Оценка', instruction: 'Как прошла практика?' },
  ];

  constructor(private practiceService: PracticeService) {}

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({
      name: this.practiceTitle,
      route: '/yichudim/candle-flame',
    });
    this.practiceService.recordPracticeCompletion();
  }
}
