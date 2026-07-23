export interface Trade {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  category: string;
}

export interface InterviewMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
  options?: string[];
  timestamp: number;
}

export interface InterviewState {
  tradeId: string;
  tradeName: string;
  messages: InterviewMessage[];
  completed: boolean;
  identifiedSkills: Skill[];
}

export interface UserProfile {
  name: string;
  trade: string;
  location: string;
  yearsOfExperience: number;
  bio: string;
  avatar?: string;
  skills: Skill[];
  passportCreated: boolean;
  passportId?: string;
  evidence: Evidence[];
  language: string;
}

export interface Evidence {
  id: string;
  type: 'photo' | 'project' | 'reference';
  title: string;
  description: string;
  date: string;
  verified: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  type: 'course' | 'job' | 'mentorship' | 'certification';
  description: string;
  matchScore: number;
  location?: string;
  link?: string;
}

export type ViewType = 'welcome' | 'dashboard' | 'interview' | 'passport' | 'opportunities' | 'evidence';