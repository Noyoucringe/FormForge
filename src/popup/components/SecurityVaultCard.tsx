import React from 'react';
import Icon from './Icon';

interface SecurityVaultCardProps {
  onVerifyIdentity: () => void;
  onUnlockSensitiveFields: () => void;
}

const SecurityVaultCard: React.FC<SecurityVaultCardProps> = ({
  onVerifyIdentity,
  onUnlockSensitiveFields,
}) => {
  const protectedItems = ['Phone Number', 'Address', 'Aadhaar', 'PAN', 'Passport'];

  return (
    <div className="feature-panel">
      <div className="feature-panel__header">
        <div>
          <p className="eyebrow">Security Vault</p>
          <h3>Protect sensitive data before autofill</h3>
        </div>
        <Icon name="shield" className="feature-panel__icon" />
      </div>

      <div className="protected-list">
        {protectedItems.map((item) => (
          <span key={item} className="chip chip--soft">
            {item}
          </span>
        ))}
      </div>

      <div className="button-stack">
        <button className="btn btn-secondary btn-wide" onClick={onVerifyIdentity}>
          Verify Identity
        </button>
        <button className="btn btn-primary btn-wide" onClick={onUnlockSensitiveFields}>
          Unlock Sensitive Fields
        </button>
      </div>
    </div>
  );
};

export default SecurityVaultCard;
