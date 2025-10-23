import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export class DateUtils {
  static formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
    return format(date, formatStr);
  }

  static today(): string {
    return this.formatDate(new Date());
  }

  static isToday(dateStr: string): boolean {
    return dateStr === this.today();
  }

  static isSameDay(date1: Date | string, date2: Date | string): boolean {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(d1, d2);
  }

  static getWeekDays(date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date[] {
    const start = startOfWeek(date, { weekStartsOn });
    const end = endOfWeek(date, { weekStartsOn });
    return eachDayOfInterval({ start, end });
  }

  static getWeekDayNames(short: boolean = false): string[] {
    const days = short 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days;
  }

  static getDaysInMonth(year: number, month: number): Date[] {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return eachDayOfInterval({ start, end });
  }

  static calculateStreak(completions: { date: string; completed: boolean }[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (completions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort completions by date (most recent first)
    const sortedCompletions = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (from today backwards)
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateStr = this.formatDate(checkDate);
      const completion = sortedCompletions.find(c => c.date === dateStr);
      
      if (completion) {
        if (i === 0 || currentStreak > 0) {
          currentStreak++;
        }
        tempStreak++;
      } else {
        if (i > 0) break; // Stop if we hit a gap after the first day
        tempStreak = 0;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak by examining all completions
    tempStreak = 0;
    let lastDate: Date | null = null;

    for (const completion of sortedCompletions.reverse()) {
      const currentDate = new Date(completion.date);
      
      if (lastDate && 
          currentDate.getTime() - lastDate.getTime() === 24 * 60 * 60 * 1000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = currentDate;
    }

    return { currentStreak, longestStreak };
  }

  static getOptimalTime(completions: { date: string; completedAt?: Date }[]): string | null {
    const completedTimes = completions
      .filter(c => c.completedAt)
      .map(c => c.completedAt!.getHours());

    if (completedTimes.length === 0) return null;

    // Find most common hour
    const hourCounts: { [hour: number]: number } = {};
    completedTimes.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const mostCommonHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];

    return `${mostCommonHour.toString().padStart(2, '0')}:00`;
  }
}