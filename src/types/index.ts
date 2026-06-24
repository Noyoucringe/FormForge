export interface Profile {
  id: string;
  name: string;
  type: 'AI' | 'SWE' | 'Research' | 'Custom';
  data: ProfileData;
  createdAt: number;
  updatedAt: number;
}

export interface ProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  education?: Education[];
  experience?: WorkExperience[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  years: number;
}

export interface FormField {
  type: string;
  name: string;
  id: string;
  placeholder?: string;
  value?: string;
}

export interface Message {
  type: string;
  payload?: any;
}
