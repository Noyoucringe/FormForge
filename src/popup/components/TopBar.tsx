import React from 'react';
import Icon from './Icon';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenWebsite: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenSettings, onOpenHelp, onOpenWebsite }) => {
  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <div className="top-bar__logo">F</div>
        <div>
          <h1>FormForge</h1>
          <p>Powered intelligent form filling.</p>
        </div>
      </div>

      <div className="top-bar__actions">
        <button className="icon-button" onClick={onOpenSettings} title="Settings">
          <Icon name="settings" />
        </button>
        <button className="icon-button" onClick={onOpenHelp} title="Help">
          <Icon name="help" />
        </button>
        <button className="icon-button icon-button--primary" onClick={onOpenWebsite} title="Website">
          <Icon name="globe" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
