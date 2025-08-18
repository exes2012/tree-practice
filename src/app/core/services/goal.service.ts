import { Injectable } from '@angular/core';

export interface Goal {
  id: string;
  title: string;
  imageUrl?: string;
  complexity: number;
  direction: 'relationships' | 'health' | 'money' | 'destiny';
  isMainGoal: boolean;
  practices: GoalPractice[];
}

export interface GoalPractice {
  id: string;
  type: string; // e.g., 'Выявление установки', 'Подъем МАН с целью', 'Сонастройка цели с Творцом'
  formulation: string; // The specific text entered by the user for this practice
  date: string; // YYYY-MM-DD
}

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private readonly GOALS_KEY = 'goals';

  constructor() {}

  private getGoals(): Goal[] {
    const goalsJson = localStorage.getItem(this.GOALS_KEY);
    return goalsJson ? JSON.parse(goalsJson) : [];
  }

  private saveGoals(goals: Goal[]): void {
    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
  }

  getAllGoals(): Goal[] {
    return this.getGoals();
  }

  getGoalById(id: string): Goal | undefined {
    return this.getGoals().find((goal) => goal.id === id);
  }

  addGoal(goal: Goal): void {
    const goals = this.getGoals();
    if (goal.isMainGoal) {
      // Ensure only one main goal
      goals.forEach((g) => (g.isMainGoal = false));
    }
    goals.push(goal);
    this.saveGoals(goals);
  }

  updateGoal(updatedGoal: Goal): void {
    let goals = this.getGoals();
    if (updatedGoal.isMainGoal) {
      // Ensure only one main goal
      goals.forEach((g) => (g.isMainGoal = false));
    }
    goals = goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal));
    this.saveGoals(goals);
  }

  deleteGoal(id: string): void {
    let goals = this.getGoals();
    goals = goals.filter((goal) => goal.id !== id);
    this.saveGoals(goals);
  }

  addPracticeToGoal(goalId: string, practice: GoalPractice): void {
    const goals = this.getGoals();
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      goal.practices.push(practice);
      this.saveGoals(goals);
    }
  }
}
