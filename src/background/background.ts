import { ProfileService } from '../services/profileService';
import { StorageService } from '../services/storageService';

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  await ProfileService.initializeDefaultProfiles();
  const hasMasterPassword = await StorageService.hasMasterPassword();
  if (!hasMasterPassword) {
    // Set default master password on first install
    await StorageService.setMasterPassword('password');
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === 'GET_PROFILES') {
      StorageService.getProfiles().then(sendResponse);
      return true;
    } else if (message.type === 'SAVE_PROFILE') {
      StorageService.saveProfile(message.payload).then(() => {
        sendResponse({ success: true });
      });
      return true;
    } else if (message.type === 'DELETE_PROFILE') {
      StorageService.deleteProfile(message.payload).then(() => {
        sendResponse({ success: true });
      });
      return true;
    } else if (message.type === 'SET_ACTIVE_PROFILE') {
      StorageService.setActiveProfile(message.payload).then(() => {
        sendResponse({ success: true });
      });
      return true;
    } else if (message.type === 'GET_ACTIVE_PROFILE') {
      StorageService.getActiveProfile().then(sendResponse);
      return true;
    } else if (message.type === 'VERIFY_MASTER_PASSWORD') {
      StorageService.verifyMasterPassword(message.payload).then(sendResponse);
      return true;
    }
  }
);
