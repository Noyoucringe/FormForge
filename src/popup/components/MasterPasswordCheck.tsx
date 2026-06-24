import React, { useState } from 'react';

interface MasterPasswordCheckProps {
  onVerified: () => void;
  onCancel: () => void;
}

const MasterPasswordCheck: React.FC<MasterPasswordCheckProps> = ({
  onVerified,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await chrome.runtime.sendMessage({
        type: 'VERIFY_MASTER_PASSWORD',
        payload: password,
      });

      if (result) {
        onVerified();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="password-check">
      <h2>Master Password</h2>
      <p className="password-description">
        Enter your master password to autofill sensitive information.
      </p>

      <div className="form-group">
        <label>Master Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter password"
          autoFocus
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
        <button className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MasterPasswordCheck;
