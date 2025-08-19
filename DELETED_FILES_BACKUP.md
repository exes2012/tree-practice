# Резервная копия удаленных файлов

## Дата удаления: 2025-01-19

## Причина удаления
Компоненты yichudim практик не используются в приложении. Все маршруты из YichudimPageComponent ведут на `/practices/runner/` архитектуру, минуя локальные компоненты.

## Удаленные компоненты yichudim

### 1. BreathingJoyPracticeComponent
- **Путь**: `src/app/features/yichudim/components/breathing-joy-practice/`
- **Файлы**: 
  - `breathing-joy-practice.component.ts`
  - `breathing-joy-practice.component.html`
  - `breathing-joy-practice.component.spec.ts`
- **Маршрут**: `/yichudim/breathing-joy` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/breathing-joy-yichud`

### 2. CandleFlamePracticeComponent
- **Путь**: `src/app/features/yichudim/components/candle-flame-practice/`
- **Файлы**: 
  - `candle-flame-practice.component.ts`
  - `candle-flame-practice.component.html`
  - `candle-flame-practice.component.spec.ts`
- **Маршрут**: `/yichudim/candle-flame` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/candle-flame-yichud`

### 3. DivineSpacePracticeComponent
- **Путь**: `src/app/features/yichudim/components/divine-space-practice/`
- **Файлы**: 
  - `divine-space-practice.component.ts`
  - `divine-space-practice.component.html`
  - `divine-space-practice.component.spec.ts`
- **Маршрут**: `/yichudim/divine-space` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/divine-space-yichud`

### 4. GratitudePracticeComponent
- **Путь**: `src/app/features/yichudim/components/gratitude-practice/`
- **Файлы**: 
  - `gratitude-practice.component.ts`
  - `gratitude-practice.component.html`
  - `gratitude-practice.component.spec.ts`
- **Маршрут**: `/yichudim/gratitude` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/gratitude-yichud`

### 5. LovePracticeComponent
- **Путь**: `src/app/features/yichudim/components/love-practice/`
- **Файлы**: 
  - `love-practice.component.ts`
  - `love-practice.component.html`
  - `love-practice.component.spec.ts`
- **Маршрут**: `/yichudim/love` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/love-yichud`

### 6. SeventyTwoNamesPracticeComponent
- **Путь**: `src/app/features/yichudim/components/seventy-two-names-practice/`
- **Файлы**: 
  - `seventy-two-names-practice.component.ts`
  - `seventy-two-names-practice.component.html`
  - `seventy-two-names-practice.component.spec.ts`
- **Маршрут**: `/yichudim/seventy-two-names` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/seventy-two-names-yichud`

### 7. ShabbatPracticeComponent
- **Путь**: `src/app/features/yichudim/components/shabbat-practice/`
- **Файлы**: 
  - `shabbat-practice.component.ts`
  - `shabbat-practice.component.html`
  - `shabbat-practice.component.spec.ts`
- **Маршрут**: `/yichudim/shabbat` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/shabbat-yichud`

### 8. TetragrammatonPracticeComponent
- **Путь**: `src/app/features/yichudim/components/tetragrammaton-practice/`
- **Файлы**: 
  - `tetragrammaton-practice.component.ts`
  - `tetragrammaton-practice.component.html`
  - `tetragrammaton-practice.component.spec.ts`
- **Маршрут**: `/yichudim/tetragrammaton` (НЕ ИСПОЛЬЗУЕТСЯ)
- **Замена**: `/practices/runner/tetragrammaton-yichud`

## Удаленные orphan файлы

### practice.model.ts
- **Путь**: `src/app/core/models/practice.model.ts`
- **Причина**: Не используется, заменен на practice-engine.types.ts

## Очищенные неиспользуемые экспорты

### reminder.models.ts
- **Удаленные функции**: `getWeekDayName`, `getWeekDayShort`
- **Причина**: Не используются в коде

### core.module.ts
- **Удаленный экспорт**: `CoreModule`
- **Причина**: Не используется в standalone архитектуре

## Очищенные маршруты

### yichudim-routing.module.ts
- **Удаленные маршруты**: Все кроме главной страницы
- **Оставлен**: `{ path: '', component: YichudimPageComponent }`

## Проверка безопасности

### Подтверждение неиспользования:
1. ✅ Все маршруты в YichudimPageComponent ведут на `/practices/runner/`
2. ✅ Компоненты не импортируются в других модулях
3. ✅ Нет прямых ссылок на удаляемые компоненты
4. ✅ Функциональность полностью заменена новой архитектурой

### Восстановление:
Если потребуется восстановление, файлы можно восстановить из git истории или использовать новую архитектуру practice-runner.
