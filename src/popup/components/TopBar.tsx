import React from 'react';
import Icon from './Icon';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenWebsite: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenSettings, onOpenHelp, onOpenWebsite }) => {
  return (
    <header className="popup-header">
      <div className="header-brand">
        <div className="header-brand-icon">F</div>
        <h1>FormForge</h1>
      </div>

      <div className="header-actions">
        <button className="header-action-btn" onClick={onOpenSettings} title="Settings">
          <Icon name="settings" />
        </button>
        <button className="header-action-btn" onClick={onOpenHelp} title="Help">
          <Icon name="help" />
        </button>
        <button className="header-action-btn" onClick={onOpenWebsite} title="Website">
          <Icon name="globe" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
