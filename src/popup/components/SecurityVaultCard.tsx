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
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">
          <Icon name="shield" />
          Security Vault
        </h2>
      </div>

      <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-sm)' }}>
          Protect sensitive data before autofill
        </p>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
          {protectedItems.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <button className="btn btn-secondary btn-block" onClick={onVerifyIdentity}>
            Verify Identity
          </button>
          <button className="btn btn-primary btn-block" onClick={onUnlockSensitiveFields}>
            Unlock Sensitive Fields
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityVaultCard;
