import React from 'react';
import SectionCard from './SectionCard';
import Icon from './Icon';

interface SettingsViewProps {
  onBack: () => void;
  onOpenWebsite: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onOpenWebsite }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="popup-header">
        <div className="header-brand">
          <button className="header-action-btn" onClick={onBack} title="Back">
            <Icon name="arrow-right" style={{ transform: 'rotate(180deg)' }} />
          </button>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="popup-content">
        <SectionCard title="Theme" icon="theme">
          <div className="list-group">
            <label className="list-item" style={{ cursor: 'pointer', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
              <span className="persona-name" style={{ fontSize: '0.75rem' }}>Light</span>
              <input type="radio" name="theme" />
            </label>
            <label className="list-item" style={{ cursor: 'pointer', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
              <span className="persona-name" style={{ fontSize: '0.75rem' }}>Dark</span>
              <input type="radio" name="theme" defaultChecked />
            </label>
            <label className="list-item" style={{ cursor: 'pointer', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
              <span className="persona-name" style={{ fontSize: '0.75rem' }}>System</span>
              <input type="radio" name="theme" />
            </label>
          </div>
        </SectionCard>

        <SectionCard title="AI Settings" icon="spark">
          <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>Control response generation, persona matching, and contextual answer assistance.</p>
            <button className="btn btn-secondary btn-block">Configure AI</button>
          </div>
        </SectionCard>

        <SectionCard title="Security Settings" icon="shield">
          <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>Manage master password, vault access, and sensitive field unlocking behavior.</p>
            <button className="btn btn-secondary btn-block">Update Security</button>
          </div>
        </SectionCard>

        <SectionCard title="Website Integration" icon="globe">
          <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>Connect with FormForge web features and future dashboard sync.</p>
            <button className="btn btn-secondary btn-block" onClick={onOpenWebsite}>Open Website</button>
          </div>
        </SectionCard>

        <SectionCard title="Export Data" icon="export">
          <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>Download personas, vault metadata, and application history.</p>
            <button className="btn btn-secondary btn-block">Export</button>
          </div>
        </SectionCard>

        <SectionCard title="Import Data" icon="import">
          <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>Import backed up profiles or document metadata into the extension.</p>
            <button className="btn btn-secondary btn-block">Import</button>
          </div>
        </SectionCard>

        <SectionCard title="About FormForge" icon="help">
          <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>FormForge helps users fill applications faster with persona-based workflows.</p>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Release Notes</button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Privacy</button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsView;
