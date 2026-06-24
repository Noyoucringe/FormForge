import { Profile } from '../types/index';

const STORAGE_KEY = 'formforge_profiles';
const MASTER_PASSWORD_KEY = 'formforge_master_password';
const ACTIVE_PROFILE_KEY = 'formforge_active_profile';

export class StorageService {
  static async getProfiles(): Promise<Profile[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        resolve(result[STORAGE_KEY] || []);
      });
    });
  }

  static async saveProfile(profile: Profile): Promise<void> {
    const profiles = await this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }

    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: profiles }, resolve);
    });
  }

  static async deleteProfile(profileId: string): Promise<void> {
    const profiles = await this.getProfiles();
    const filtered = profiles.filter((p) => p.id !== profileId);

    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: filtered }, resolve);
    });
  }

  static async setMasterPassword(password: string): Promise<void> {
    return new Promise((resolve) => {
      // Hash password using SHA-256 (basic example - consider bcrypt for production)
      chrome.storage.local.set(
        { [MASTER_PASSWORD_KEY]: this.hashPassword(password) },
        resolve
      );
    });
  }

  static async getMasterPasswordHash(): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([MASTER_PASSWORD_KEY], (result) => {
        resolve(result[MASTER_PASSWORD_KEY] || null);
      });
    });
  }

  static async hasMasterPassword(): Promise<boolean> {
    const hash = await this.getMasterPasswordHash();
    return hash !== null;
  }

  static async verifyMasterPassword(password: string): Promise<boolean> {
    const hash = await this.getMasterPasswordHash();
    if (!hash) return false;
    return this.hashPassword(password) === hash;
  }

  static async setActiveProfile(profileId: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [ACTIVE_PROFILE_KEY]: profileId }, resolve);
    });
  }

  static async getActiveProfile(): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([ACTIVE_PROFILE_KEY], (result) => {
        resolve(result[ACTIVE_PROFILE_KEY] || null);
      });
    });
  }

  private static hashPassword(password: string): string {
    // Simple hash for MVP - in production use proper crypto
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}
