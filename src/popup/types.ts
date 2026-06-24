export type AppView = 'dashboard' | 'settings' | 'create-persona' | 'password';

export type ConnectionState = 'signed-in' | 'signed-out';

export interface PersonaCardData {
  id: string;
  name: string;
  role: string;
  skills: string[];
  resumeCount: number;
  lastUpdated: string;
  active?: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Resumes' | 'Certificates' | 'Offer Letters';
  updatedAt: string;
  size: string;
}

export interface MetricCardData {
  label: string;
  value: string;
  hint: string;
}
