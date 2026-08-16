export interface StudentProfile {
  name: string;
  school: string;
  grade: string;
  bio: string;
  interests: string[];
  avatarUrl: string;
  learningDirection: string;
  currentLearning: string;
  futureAspirations: string;
  email: string;
  themeColor: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  challenge: string;
  solution: string;
  reflection: string;
  images: string[];
  videoUrl: string;
  order: number;
  createdAt: number;
}

export interface TimelineItem {
  id: string;
  yearOrPeriod: string;
  title: string;
  description: string;
  category?: string;
  order: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  order: number;
}

export interface AuthUser {
  email: string;
  displayName: string;
  photoURL?: string;
  isLoggedIn: boolean;
}
