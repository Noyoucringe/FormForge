import React, { useState } from 'react';
import { Profile } from '../../types/index';
import { FormDetectionService } from '../../services/formDetectionService';

interface AutofillButtonProps {
  profile: Profile;
}

const AutofillButton: React.FC<AutofillButtonProps> = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAutofill = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        setMessage('No active tab found');
        return;
      }

      // First detect fields
      const detectResponse = await chrome.tabs.sendMessage(tab.id, {
        type: 'DETECT_FIELDS',
      });

      const fields = detectResponse.fields;

      if (fields.length === 0) {
        setMessage('No form fields detected on this page');
        return;
      }

      // Then autofill
      await chrome.tabs.sendMessage(tab.id, {
        type: 'AUTOFILL_FORM',
        payload: {
          fields,
          profile,
        },
      });

      setMessage(`Filled ${fields.length} field(s) with "${profile.name}"`);
    } catch (error) {
      setMessage('Error: Could not autofill form');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="autofill-section">
      <button
        className="btn btn-success btn-large"
        onClick={handleAutofill}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Autofilling...' : `✓ Autofill with "${profile.name}"`}
      </button>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default AutofillButton;
