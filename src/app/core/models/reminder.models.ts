export interface Reminder {
  id: string;
  title: string;
  message: string;
  time: string; // HH:mm format
  days: WeekDay[];
  isEnabled: boolean;
  category: ReminderCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyIntention {
  id: string;
  isEnabled: boolean;
  intervalHours: number; // 1-8 hours
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  customMessage?: string;
  useRandomMessages: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderNotification {
  id: string;
  reminderId: string;
  type: 'reminder' | 'intention';
  scheduledTime: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type ReminderCategory = 'practice' | 'yichudim' | 'gratitude' | 'study' | 'intention' | 'custom';

export interface ReminderCategoryInfo {
  id: ReminderCategory;
  name: string;
  icon: string;
  color: string;
}

export interface CreateReminderRequest {
  title: string;
  message: string;
  time: string;
  days: WeekDay[];
  category: ReminderCategory;
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  isEnabled?: boolean;
}

export interface CreateDailyIntentionRequest {
  intervalHours: number;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  customMessage?: string;
  useRandomMessages: boolean;
}

export interface UpdateDailyIntentionRequest extends Partial<CreateDailyIntentionRequest> {
  isEnabled?: boolean;
}

// Predefined intention messages for random selection
export const INTENTION_MESSAGES = [
  'Помни о своем намерении сегодня',
  'Какое твое намерение в этот момент?',
  'Направь свои мысли к Творцу',
  'Проверь свое намерение сейчас',
  'Помни о цели своего дня',
  'Какова твоя истинная мотивация?',
  'Соедини свои действия с намерением',
  'Помни о духовной работе',
  'Направь сердце к отдаче',
  'Проверь чистоту своих мыслей'
];

// Predefined reminder categories
export const REMINDER_CATEGORIES: ReminderCategoryInfo[] = [
  {
    id: 'practice',
    name: 'Практики',
    icon: 'self_improvement',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'yichudim',
    name: 'Ихудим',
    icon: 'spa',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'gratitude',
    name: 'Благодарность',
    icon: 'favorite',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'study',
    name: 'Изучение',
    icon: 'menu_book',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'intention',
    name: 'Намерение',
    icon: 'track_changes',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'custom',
    name: 'Другое',
    icon: 'notifications',
    color: 'bg-gray-100 text-gray-800'
  }
];

// Week days configuration
export const WEEK_DAYS: { id: WeekDay; short: string; full: string }[] = [
  { id: 'monday', short: 'ПН', full: 'Понедельник' },
  { id: 'tuesday', short: 'ВТ', full: 'Вторник' },
  { id: 'wednesday', short: 'СР', full: 'Среда' },
  { id: 'thursday', short: 'ЧТ', full: 'Четверг' },
  { id: 'friday', short: 'ПТ', full: 'Пятница' },
  { id: 'saturday', short: 'СБ', full: 'Суббота' },
  { id: 'sunday', short: 'ВС', full: 'Воскресенье' }
];

// Helper functions
export function getWeekDayName(day: WeekDay): string {
  return WEEK_DAYS.find(d => d.id === day)?.full || day;
}

export function getWeekDayShort(day: WeekDay): string {
  return WEEK_DAYS.find(d => d.id === day)?.short || day;
}

export function getCategoryInfo(category: ReminderCategory): ReminderCategoryInfo {
  return REMINDER_CATEGORIES.find(c => c.id === category) || REMINDER_CATEGORIES[REMINDER_CATEGORIES.length - 1];
}

export function getRandomIntentionMessage(): string {
  return INTENTION_MESSAGES[Math.floor(Math.random() * INTENTION_MESSAGES.length)];
}
