import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalService } from '@app/core/services/goal.service';
import { v4 as uuidv4 } from 'uuid';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticePageLayoutComponent],
})
export class GoalFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  goal: Goal = {
    id: '',
    title: '',
    complexity: 0,
    direction: 'relationships',
    isMainGoal: false,
    practices: [],
  };
  isEditMode: boolean = false;

  constructor(
    private goalService: GoalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const goalId = this.route.snapshot.paramMap.get('id');
    if (goalId) {
      this.isEditMode = true;
      const existingGoal = this.goalService.getGoalById(goalId);
      if (existingGoal) {
        this.goal = { ...existingGoal };
      }
    }
  }

  saveGoal(): void {
    // Validate that title is not empty
    if (!this.goal.title || this.goal.title.trim() === '') {
      alert('Пожалуйста, заполните поле цели');
      return;
    }

    if (this.isEditMode) {
      this.goalService.updateGoal(this.goal);
    } else {
      this.goal.id = uuidv4();
      this.goalService.addGoal(this.goal);
    }
    this.router.navigate(['/goals']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.goal.imageUrl = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  selectDirection(direction: 'relationships' | 'health' | 'money' | 'destiny'): void {
    this.goal.direction = direction;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  isFormValid(): boolean {
    return !!(this.goal.title && this.goal.title.trim() !== '');
  }
}
