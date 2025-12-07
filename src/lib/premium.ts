import { habitStorage, userPrefsStorage } from './storage';
import { isPremiumTheme, FREE_HABIT_LIMIT_PER_MONTH } from '@/types/habit';
import type { ThemeType } from '@/types/habit';

// Get current month in YYYY-MM format
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Count habits created this month
export function getHabitsCreatedThisMonth(): number {
  const habits = habitStorage.getAll();
  const currentMonth = getCurrentMonth();
  return habits.filter((habit) => habit.createdMonth === currentMonth).length;
}

// Check if user can create more habits
export function canCreateHabit(): { allowed: boolean; reason?: string } {
  const userPrefs = userPrefsStorage.get();

  // Premium users have no limits
  if (userPrefs.isPremium) {
    return { allowed: true };
  }

  // Free users: check monthly limit
  const habitsThisMonth = getHabitsCreatedThisMonth();
  if (habitsThisMonth >= FREE_HABIT_LIMIT_PER_MONTH) {
    return {
      allowed: false,
      reason: `Free plan limit reached (${FREE_HABIT_LIMIT_PER_MONTH} habits/month). Upgrade to Premium for unlimited habits!`,
    };
  }

  return { allowed: true };
}

// Check if user can use a specific theme
export function canUseTheme(theme: ThemeType): { allowed: boolean; reason?: string } {
  const userPrefs = userPrefsStorage.get();

  // Premium users can use all themes
  if (userPrefs.isPremium) {
    return { allowed: true };
  }

  // Check if theme requires premium
  if (isPremiumTheme(theme)) {
    return {
      allowed: false,
      reason: `${theme.charAt(0).toUpperCase() + theme.slice(1)} requires Premium. Upgrade to unlock!`,
    };
  }

  return { allowed: true };
}

// Get remaining habit slots for free users
export function getRemainingHabitSlots(): number {
  const userPrefs = userPrefsStorage.get();

  if (userPrefs.isPremium) {
    return Infinity;
  }

  const habitsThisMonth = getHabitsCreatedThisMonth();
  return Math.max(0, FREE_HABIT_LIMIT_PER_MONTH - habitsThisMonth);
}
