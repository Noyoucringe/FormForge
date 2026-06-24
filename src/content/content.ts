import { Message } from '../types/index';
import { FormDetectionService } from '../services/formDetectionService';
import { AutofillService } from '../services/autofillService';

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.type === 'DETECT_FIELDS') {
      const fields = FormDetectionService.detectFields();
      sendResponse({ fields });
    } else if (message.type === 'AUTOFILL_FORM') {
      const { fields, profile } = message.payload;
      try {
        AutofillService.autofillForm(fields, profile);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: (error as Error).message });
      }
    }
  }
);

// Inject a button on form pages to trigger detection
if (document.querySelector('form')) {
  window.addEventListener('load', () => {
    console.log('FormForge: Form detected on page');
  });
}
