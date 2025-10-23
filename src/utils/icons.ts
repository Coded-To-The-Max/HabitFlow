import { 
  Activity, 
  BookOpen, 
  Brain, 
  Coffee, 
  Dumbbell, 
  Heart, 
  Lightbulb, 
  Monitor, 
  Palette, 
  Users, 
  Target,
  Zap,
  Moon,
  Sun,
  Droplets,
  Leaf,
  Music,
  Camera,
  Pen,
  Calculator,
  User
} from 'lucide-react';

export const categoryIcons = {
  health: Heart,
  fitness: Dumbbell,
  learning: BookOpen,
  productivity: Monitor,
  mindfulness: Brain,
  social: Users,
  creativity: Palette,
  career: Target,
  personal: User,
  other: Activity
};

export const habitIcons = {
  // Health
  water: Droplets,
  sleep: Moon,
  vitamins: Heart,
  meditation: Brain,
  
  // Fitness
  exercise: Dumbbell,
  running: Activity,
  yoga: Leaf,
  stretching: Activity,
  
  // Learning
  reading: BookOpen,
  language: BookOpen,
  course: Monitor,
  podcast: Music,
  
  // Productivity
  planning: Calculator,
  coding: Monitor,
  writing: Pen,
  email: Monitor,
  
  // Creativity
  drawing: Palette,
  photography: Camera,
  music: Music,
  journaling: Pen,
  
  // Default
  default: Target
};

export const getHabitIcon = (iconName: string) => {
  return habitIcons[iconName as keyof typeof habitIcons] || habitIcons.default;
};

export const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.other;
};