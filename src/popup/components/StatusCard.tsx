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
    <>
      <div className="status-row">
        <div className="status-info">
          <span className="status-title">{signedIn ? 'Signed In' : 'Not Signed In'}</span>
          <span className="status-subtitle">{signedIn ? activePersonaName : 'Connect your FormForge account'}</span>
        </div>
        <div className="status-badge">
          <Icon name={signedIn ? 'check' : 'status'} style={{ width: 12, height: 12 }} />
          <span>{signedIn ? 'Active' : 'Guest'}</span>
        </div>
      </div>
      <div className="status-row" style={{ borderTop: '1px solid var(--border)', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
        <div className="status-info">
          <span className="status-title" style={{ fontSize: '0.75rem' }}>Security</span>
          <span className="status-subtitle" style={{ color: 'var(--success)' }}>
            <Icon name="shield" style={{ width: 10, height: 10, marginRight: 4 }} />
            {securityStatus}
          </span>
        </div>
        {!signedIn && (
          <button className="btn btn-primary btn-sm" onClick={onOpenDashboard}>
            Open Dashboard
          </button>
        )}
      </div>
    </>
  );
};

export default StatusCard;
