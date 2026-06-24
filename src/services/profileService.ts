import { Profile, ProfileData } from '../types/index';
import { StorageService } from './storageService';

export class ProfileService {
  static generateId(): string {
    return 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static createProfile(
    name: string,
    type: 'AI' | 'SWE' | 'Research' | 'Custom',
    data: ProfileData = {}
  ): Profile {
    const now = Date.now();
    return {
      id: this.generateId(),
      name,
      type,
      data,
      createdAt: now,
      updatedAt: now,
    };
  }

  static async getDefaultProfiles(): Promise<Profile[]> {
    const now = Date.now();
    return [
      {
        id: this.generateId(),
        name: 'AI Engineer',
        type: 'AI',
        data: {
          skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science'],
          education: [
            { institution: 'Example University', degree: 'BS', field: 'Computer Science', year: 2020 },
          ],
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: 'Software Engineer',
        type: 'SWE',
        data: {
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
          education: [
            { institution: 'Example University', degree: 'BS', field: 'Computer Science', year: 2019 },
          ],
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: 'Research',
        type: 'Research',
        data: {
          skills: ['Data Analysis', 'Academic Writing', 'Statistics'],
          education: [
            { institution: 'Example University', degree: 'MS', field: 'Computer Science', year: 2021 },
          ],
        },
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  static async initializeDefaultProfiles(): Promise<void> {
    const profiles = await StorageService.getProfiles();
    if (profiles.length === 0) {
      const defaults = await this.getDefaultProfiles();
      for (const profile of defaults) {
        await StorageService.saveProfile(profile);
      }
    }
  }

  static async updateProfile(
    profileId: string,
    updates: Partial<Profile>
  ): Promise<Profile | null> {
    const profiles = await StorageService.getProfiles();
    const profile = profiles.find((p) => p.id === profileId);

    if (!profile) return null;

    const updated = {
      ...profile,
      ...updates,
      updatedAt: Date.now(),
    };

    await StorageService.saveProfile(updated);
    return updated;
  }

  static async getProfile(profileId: string): Promise<Profile | null> {
    const profiles = await StorageService.getProfiles();
    return profiles.find((p) => p.id === profileId) || null;
  }

  static async getActiveProfileData(): Promise<Profile | null> {
    const activeId = await StorageService.getActiveProfile();
    if (!activeId) return null;
    return this.getProfile(activeId);
  }
}
