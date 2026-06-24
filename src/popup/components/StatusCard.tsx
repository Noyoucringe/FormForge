import React from 'react';
import Icon from './Icon';

interface StatusCardProps {
  signedIn: boolean;
  activePersonaName: string;
  securityStatus: string;
  onOpenDashboard: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  signedIn,
  activePersonaName,
  securityStatus,
  onOpenDashboard,
}) => {
  return (
    <div className="status-card">
      <div className="status-card__row">
        <div>
          <p className="status-card__label">User Status</p>
          <h3>{signedIn ? 'Signed In' : 'Not Signed In'}</h3>
        </div>
        <span className={`status-pill ${signedIn ? 'status-pill--success' : 'status-pill--neutral'}`}>
          <Icon name={signedIn ? 'check' : 'status'} className="status-pill__icon" />
          {signedIn ? 'Active' : 'Guest'}
        </span>
      </div>

      <div className="status-card__meta">
        <div>
          <span className="status-card__meta-label">Current Persona</span>
          <strong>{signedIn ? activePersonaName : 'Connect your FormForge account'}</strong>
        </div>
        <div>
          <span className="status-card__meta-label">Security</span>
          <strong>{securityStatus}</strong>
        </div>
      </div>

      {!signedIn && (
        <button className="btn btn-primary btn-wide" onClick={onOpenDashboard}>
          Open Dashboard
        </button>
      )}
    </div>
  );
};

export default StatusCard;
