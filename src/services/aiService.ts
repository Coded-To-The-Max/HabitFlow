import { Habit, HabitCompletion, HabitStreak, HabitInsight, HabitStats } from '../types/habit';

export class AIService {
  private static readonly API_KEY = '***REMOVED***';
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  static async generateHabitInsights(
    habits: Habit[],
    completions: HabitCompletion[],
    streaks: HabitStreak[],
    stats: HabitStats[]
  ): Promise<HabitInsight[]> {
    try {
      const prompt = this.buildInsightsPrompt(habits, completions, streaks, stats);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful habit coach that provides personalized insights and suggestions to help users improve their habits. Respond with practical, encouraging, and actionable advice. Keep responses concise but motivating.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI service');
      }

      return this.parseInsightsResponse(aiResponse, habits);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackInsights(habits, stats);
    }
  }

  static async generateMotivationalMessage(
    habit: Habit,
    currentStreak: number,
    completionRate: number
  ): Promise<string> {
    try {
      const prompt = `Generate a short, encouraging message for someone who has a habit called "${habit.name}" in the ${habit.category} category. Their current streak is ${currentStreak} days and completion rate is ${completionRate.toFixed(1)}%. Make it personal and motivating. Keep it under 50 words.`;

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an encouraging habit coach. Provide short, positive, and personalized motivation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackMotivation(habit.name, currentStreak);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackMotivation(habit.name, currentStreak);
    }
  }

  static async suggestOptimalTime(
    habit: Habit,
    completions: HabitCompletion[]
  ): Promise<string> {
    try {
      const completionTimes = completions
        .filter(c => c.completed && c.completedAt)
        .map(c => ({
          time: c.completedAt!.getHours(),
          day: new Date(c.date).getDay()
        }));

      const prompt = `Based on the following completion data for a "${habit.name}" habit in the ${habit.category} category, suggest the optimal time of day to perform this habit. Completion times: ${JSON.stringify(completionTimes)}. Consider the category and typical patterns. Respond with just a time in HH:MM format and a brief explanation.`;

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a habit optimization expert. Analyze patterns and suggest optimal timing.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackOptimalTime(habit.category);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackOptimalTime(habit.category);
    }
  }

  private static buildInsightsPrompt(
    habits: Habit[],
    completions: HabitCompletion[],
    streaks: HabitStreak[],
    stats: HabitStats[]
  ): string {
    const habitSummaries = habits.map(habit => {
      const habitStats = stats.find(s => s.habitId === habit.id);
      const habitStreak = streaks.find(s => s.habitId === habit.id);
      
      return {
        name: habit.name,
        category: habit.category,
        completionRate: habitStats?.completionRate || 0,
        currentStreak: habitStreak?.currentStreak || 0,
        consistencyScore: habitStats?.consistencyScore || 0
      };
    });

    return `Analyze these habits and provide 2-3 personalized insights:
${JSON.stringify(habitSummaries, null, 2)}

Focus on:
1. Which habits are doing well and why
2. Which habits need improvement and specific suggestions
3. Patterns or opportunities for better consistency

Format each insight as a JSON object with: {"type": "suggestion|motivation|improvement", "message": "your message", "confidence": 0.8}`;
  }

  private static parseInsightsResponse(response: string, habits: Habit[]): HabitInsight[] {
    try {
      // Try to extract JSON objects from the response
      const jsonMatches = response.match(/\{[^}]+\}/g);
      if (!jsonMatches) {
        throw new Error('No JSON found in response');
      }

      const insights: HabitInsight[] = [];
      
      jsonMatches.forEach((jsonStr, index) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.message && parsed.type) {
            insights.push({
              habitId: habits[index % habits.length]?.id || 'general',
              type: parsed.type,
              message: parsed.message,
              confidence: parsed.confidence || 0.7,
              generatedAt: new Date(),
              actionable: parsed.type === 'suggestion' || parsed.type === 'improvement'
            });
          }
        } catch (e) {
          console.warn('Failed to parse insight JSON:', jsonStr);
        }
      });

      return insights;
    } catch (error) {
      console.error('Failed to parse AI insights:', error);
      return this.getFallbackInsights(habits, []);
    }
  }

  private static getFallbackInsights(habits: Habit[], stats: HabitStats[]): HabitInsight[] {
    const insights: HabitInsight[] = [];
    
    if (habits.length === 0) {
      insights.push({
        habitId: 'general',
        type: 'suggestion',
        message: 'Start building your first habit! Choose something small and achievable to build momentum.',
        confidence: 1.0,
        generatedAt: new Date(),
        actionable: true
      });
    } else {
      // Find lowest performing habit
      const lowestStat = stats.sort((a, b) => a.completionRate - b.completionRate)[0];
      if (lowestStat) {
        const habit = habits.find(h => h.id === lowestStat.habitId);
        if (habit) {
          insights.push({
            habitId: habit.id,
            type: 'improvement',
            message: `Consider breaking down "${habit.name}" into smaller, more manageable steps to improve consistency.`,
            confidence: 0.8,
            generatedAt: new Date(),
            actionable: true
          });
        }
      }

      // Motivational insight
      insights.push({
        habitId: 'general',
        type: 'motivation',
        message: 'Remember: consistency beats perfection. Every small step counts toward building lasting habits!',
        confidence: 1.0,
        generatedAt: new Date(),
        actionable: false
      });
    }

    return insights;
  }

  private static getFallbackMotivation(habitName: string, streak: number): string {
    if (streak === 0) {
      return `Today is perfect day to start your ${habitName} journey! 🚀`;
    } else if (streak < 7) {
      return `Great start with ${habitName}! Keep the momentum going. 💪`;
    } else if (streak < 30) {
      return `${streak} days strong! You're building an amazing ${habitName} habit. 🔥`;
    } else {
      return `Incredible ${streak}-day streak with ${habitName}! You're a habit champion! 🏆`;
    }
  }

  private static getFallbackOptimalTime(category: string): string {
    const defaultTimes: { [key: string]: string } = {
      'health': '08:00 - Morning routines help establish healthy patterns for the day',
      'fitness': '07:00 - Early morning workouts boost energy and consistency',
      'learning': '19:00 - Evening learning sessions help with retention and reflection',
      'productivity': '09:00 - Peak focus hours for productive work habits',
      'mindfulness': '06:30 - Morning mindfulness sets a calm tone for the day',
      'social': '18:00 - Evening social activities fit well with most schedules',
      'creativity': '10:00 - Mid-morning creative sessions leverage peak mental clarity',
      'career': '14:00 - Afternoon career development maintains work-life balance'
    };

    return defaultTimes[category] || '09:00 - Morning consistency helps build lasting habits';
  }
}