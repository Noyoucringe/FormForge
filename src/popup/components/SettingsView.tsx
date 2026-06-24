import React from 'react';
import SectionCard from './SectionCard';
import Icon from './Icon';

interface SettingsViewProps {
  onBack: () => void;
  onOpenWebsite: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onOpenWebsite }) => {
  return (
    <div className="settings-view">
      <div className="settings-view__topbar">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back to Dashboard
        </button>
        <h2>Settings</h2>
      </div>

      <div className="settings-grid">
        <SectionCard title="Theme" icon="theme">
          <div className="settings-list">
            <label className="settings-toggle"><input type="radio" name="theme" defaultChecked /> Light</label>
            <label className="settings-toggle"><input type="radio" name="theme" /> Dark</label>
            <label className="settings-toggle"><input type="radio" name="theme" /> System</label>
          </div>
        </SectionCard>

        <SectionCard title="AI Settings" icon="spark">
          <p className="settings-copy">Control response generation, persona matching, and contextual answer assistance.</p>
          <button className="btn btn-secondary btn-wide">Configure AI</button>
        </SectionCard>

        <SectionCard title="Security Settings" icon="shield">
          <p className="settings-copy">Manage master password, vault access, and sensitive field unlocking behavior.</p>
          <button className="btn btn-secondary btn-wide">Update Security</button>
        </SectionCard>

        <SectionCard title="Website Integration" icon="globe">
          <p className="settings-copy">Connect with FormForge web features and future dashboard sync.</p>
          <button className="btn btn-secondary btn-wide" onClick={onOpenWebsite}>Open Website</button>
        </SectionCard>

        <SectionCard title="Export Data" icon="export">
          <p className="settings-copy">Download personas, vault metadata, and application history.</p>
          <button className="btn btn-secondary btn-wide">Export</button>
        </SectionCard>

        <SectionCard title="Import Data" icon="import">
          <p className="settings-copy">Import backed up profiles or document metadata into the extension.</p>
          <button className="btn btn-secondary btn-wide">Import</button>
        </SectionCard>

        <SectionCard title="About FormForge" icon="help">
          <p className="settings-copy">FormForge helps users fill applications faster with persona-based workflows.</p>
          <div className="settings-inline-actions">
            <button className="btn btn-secondary btn-sm">Release Notes</button>
            <button className="btn btn-secondary btn-sm">Privacy</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsView;
