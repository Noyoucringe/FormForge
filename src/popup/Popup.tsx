import React, { useMemo, useState } from 'react';
import Icon, { IconName } from './components/Icon';
import './popup.css';

type TabId =
  | 'home'
  | 'personas'
  | 'assistant'
  | 'vault'
  | 'documents'
  | 'analytics'
  | 'settings';

type ThemeMode = 'light' | 'dark';

interface Persona {
  id: string;
  name: string;
  focus: string;
  tags: string[];
  active?: boolean;
}

interface ActivityItem {
  title: string;
  detail: string;
  time: string;
}

interface DocumentItem {
  name: string;
  category: string;
  updated: string;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: IconName;
}

const FORMFORGE_URL = 'https://formforge.app/';

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'dashboard' },
  { id: 'personas', label: 'Personas', icon: 'persona' },
  { id: 'assistant', label: 'AI Assistant', icon: 'spark' },
  { id: 'vault', label: 'Vault', icon: 'shield' },
  { id: 'documents', label: 'Documents', icon: 'resume' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const personas: Persona[] = [
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    focus: 'ML platforms, LLM products, applied AI',
    tags: ['Python', 'LLMs', 'MLOps'],
    active: true,
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    focus: 'Frontend, backend, systems interviews',
    tags: ['TypeScript', 'React', 'Node.js'],
  },
  {
    id: 'research',
    name: 'Research',
    focus: 'Academic roles, papers, analysis',
    tags: ['Papers', 'Statistics', 'Experiments'],
  },
];

const activity: ActivityItem[] = [
  { title: 'Generated answers', detail: 'AI Engineer persona', time: '2m ago' },
  { title: 'Detected form fields', detail: '14 fields on current page', time: '8m ago' },
  { title: 'Synced persona data', detail: '3 personas available', time: 'Today' },
];

const vaultItems = ['Phone Number', 'Address', 'Aadhaar', 'PAN', 'Passport'];

const documents: DocumentItem[] = [
  { name: 'AI Engineer Resume.pdf', category: 'Resumes', updated: 'Today' },
  { name: 'Cloud Certificate.pdf', category: 'Certificates', updated: 'Yesterday' },
  { name: 'Offer Letter.pdf', category: 'Offer Letters', updated: 'May 18' },
];

const analytics = [
  { label: 'Applications Filled', value: '128', delta: '+12 this month' },
  { label: 'Time Saved', value: '24h', delta: 'Based on autofill activity' },
  { label: 'Personas Created', value: '3', delta: 'All ready to use' },
  { label: 'Responses Generated', value: '416', delta: 'Across all personas' },
];

const assistantActions = [
  'Generate Application Answers',
  'Project Descriptions',
  'Professional Summaries',
];

const integrationActions = ['Open Dashboard', 'Login', 'Sync Personas', 'Manage Account'];

const settingGroups = [
  {
    title: 'Theme',
    description: 'Light and dark interface modes',
    icon: 'theme' as IconName,
  },
  {
    title: 'Security',
    description: 'Vault lock, master password, local storage',
    icon: 'shield' as IconName,
  },
  {
    title: 'AI Configuration',
    description: 'Response tone, model preferences, context',
    icon: 'spark' as IconName,
  },
  {
    title: 'Website Integration',
    description: 'Dashboard sync and account management',
    icon: 'globe' as IconName,
  },
];

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const activePersona = useMemo(() => personas.find((persona) => persona.active) || personas[0], []);

  const openWebsite = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: FORMFORGE_URL });
      return;
    }

    window.open(FORMFORGE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="ff-popup" data-theme={theme}>
      <header className="ff-header">
        <div className="ff-brand">
          <div className="ff-logo" aria-hidden="true">F</div>
          <div>
            <h1>FormForge</h1>
            <p>Application workflow</p>
          </div>
        </div>
        <div className="ff-header-actions">
          <IconButton
            label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
            icon="theme"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          />
          <IconButton label="Open FormForge" icon="globe" onClick={openWebsite} />
        </div>
      </header>

      <div className="ff-body">
        <aside className="ff-sidebar" aria-label="Popup navigation">
          {navItems.map((item) => (
            <button
              className={`ff-nav-item ${activeTab === item.id ? 'is-active' : ''}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              type="button"
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        <main className="ff-main">
          {activeTab === 'home' && <HomeTab activePersona={activePersona} onOpenWebsite={openWebsite} />}
          {activeTab === 'personas' && <PersonasTab onOpenWebsite={openWebsite} />}
          {activeTab === 'assistant' && <AssistantTab onOpenWebsite={openWebsite} />}
          {activeTab === 'vault' && <VaultTab onOpenWebsite={openWebsite} />}
          {activeTab === 'documents' && <DocumentsTab onOpenWebsite={openWebsite} />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && (
            <SettingsTab
              theme={theme}
              onThemeChange={setTheme}
              onOpenWebsite={openWebsite}
            />
          )}
        </main>
      </div>
    </div>
  );
};

interface TabProps {
  onOpenWebsite: () => void;
}

const HomeTab: React.FC<TabProps & { activePersona: Persona }> = ({ activePersona, onOpenWebsite }) => (
  <TabFrame
    eyebrow="Home"
    title="Ready to fill forms with precision."
    description="Your active persona, page detection, and core actions in one focused workspace."
    actions={<IntegrationButtons onOpenWebsite={onOpenWebsite} />}
  >
    <div className="ff-grid ff-grid-two">
      <Panel title="Current Persona" icon="persona">
        <div className="ff-persona-summary">
          <div>
            <strong>{activePersona.name}</strong>
            <span>{activePersona.focus}</span>
          </div>
          <Badge tone="success">Active</Badge>
        </div>
        <TagList tags={activePersona.tags} />
      </Panel>

      <Panel title="Form Detection Status" icon="status">
        <StatusRow label="Current page" value="Application form detected" tone="success" />
        <StatusRow label="Fields mapped" value="14 fields" />
        <StatusRow label="Confidence" value="High" />
      </Panel>
    </div>

    <Panel title="Quick Actions" icon="dashboard">
      <div className="ff-action-grid">
        <ActionButton icon="check" label="Fill Current Form" onClick={onOpenWebsite} />
        <ActionButton icon="analyze" label="Analyze Form" onClick={onOpenWebsite} />
        <ActionButton icon="spark" label="Generate Answers" onClick={onOpenWebsite} />
        <ActionButton icon="upload" label="Upload Resume" onClick={onOpenWebsite} />
      </div>
    </Panel>

    <Panel title="Recent Activity" icon="analytics">
      <div className="ff-list">
        {activity.map((item) => (
          <div className="ff-list-row" key={item.title}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
            <small>{item.time}</small>
          </div>
        ))}
      </div>
    </Panel>
  </TabFrame>
);

const PersonasTab: React.FC<TabProps> = ({ onOpenWebsite }) => (
  <TabFrame
    eyebrow="Personas"
    title="Profiles for different application paths."
    description="Switch the tone, experience, and supporting material used while filling roles."
    actions={<PrimaryButton icon="plus" label="Create Persona" onClick={onOpenWebsite} />}
  >
    <div className="ff-persona-list">
      {personas.map((persona) => (
        <Panel key={persona.id} className={persona.active ? 'is-selected' : ''}>
          <div className="ff-persona-card">
            <div>
              <div className="ff-card-heading">
                <strong>{persona.name}</strong>
                {persona.active && <Badge tone="success">Current</Badge>}
              </div>
              <p>{persona.focus}</p>
              <TagList tags={persona.tags} />
            </div>
            <div className="ff-row-actions">
              <IconButton label={`Edit ${persona.name}`} icon="edit" onClick={onOpenWebsite} />
              <IconButton label={`Delete ${persona.name}`} icon="trash" onClick={onOpenWebsite} danger />
            </div>
          </div>
        </Panel>
      ))}
    </div>
  </TabFrame>
);

const AssistantTab: React.FC<TabProps> = ({ onOpenWebsite }) => (
  <TabFrame
    eyebrow="AI Assistant"
    title="Draft application-ready responses."
    description="Generate concise answers from the selected persona and saved documents."
  >
    <Panel title="Tools" icon="spark">
      <div className="ff-stack">
        {assistantActions.map((action) => (
          <ActionButton key={action} icon="arrow-right" label={action} onClick={onOpenWebsite} />
        ))}
      </div>
    </Panel>

    <Panel title="Mock Response" icon="file">
      <div className="ff-response-box">
        <div className="ff-response-toolbar">
          <Badge>AI Engineer</Badge>
          <span>Professional tone</span>
        </div>
        <p>
          I build production-grade AI systems that connect model quality with reliable product
          behavior. My recent work spans retrieval pipelines, evaluation workflows, and developer
          tooling for shipping applied AI features safely.
        </p>
      </div>
    </Panel>
  </TabFrame>
);

const VaultTab: React.FC<TabProps> = ({ onOpenWebsite }) => (
  <TabFrame
    eyebrow="Vault"
    title="Sensitive details stay locked."
    description="Identity and personal records are hidden until security verification is complete."
    actions={<PrimaryButton icon="unlock" label="Unlock Vault" onClick={onOpenWebsite} />}
  >
    <Panel title="Locked Fields" icon="shield">
      <div className="ff-vault-grid">
        {vaultItems.map((item) => (
          <div className="ff-vault-item" key={item}>
            <Icon name="shield" />
            <span>{item}</span>
            <Badge>Locked</Badge>
          </div>
        ))}
      </div>
    </Panel>
  </TabFrame>
);

const DocumentsTab: React.FC<TabProps> = ({ onOpenWebsite }) => (
  <TabFrame
    eyebrow="Documents"
    title="Keep application files close."
    description="Manage resumes, certificates, and offer letters used across personas."
    actions={<PrimaryButton icon="upload" label="Upload" onClick={onOpenWebsite} />}
  >
    <Panel title="Document Library" icon="resume">
      <div className="ff-list">
        {documents.map((document) => (
          <div className="ff-list-row ff-document-row" key={document.name}>
            <div>
              <strong>{document.name}</strong>
              <span>{document.category} - Updated {document.updated}</span>
            </div>
            <div className="ff-row-actions">
              <IconButton label={`View ${document.name}`} icon="eye" onClick={onOpenWebsite} />
              <IconButton label={`Delete ${document.name}`} icon="trash" onClick={onOpenWebsite} danger />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  </TabFrame>
);

const AnalyticsTab: React.FC = () => (
  <TabFrame
    eyebrow="Analytics"
    title="Measure the workflow lift."
    description="A quick read on activity, automation value, and generated content."
  >
    <div className="ff-metric-grid">
      {analytics.map((metric) => (
        <Panel key={metric.label}>
          <div className="ff-metric">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.delta}</small>
          </div>
        </Panel>
      ))}
    </div>
  </TabFrame>
);

const SettingsTab: React.FC<TabProps & { theme: ThemeMode; onThemeChange: (theme: ThemeMode) => void }> = ({
  theme,
  onThemeChange,
  onOpenWebsite,
}) => (
  <TabFrame
    eyebrow="Settings"
    title="Configure FormForge."
    description="Control product preferences, account sync, security, and website integration."
    actions={<IntegrationButtons onOpenWebsite={onOpenWebsite} compact />}
  >
    <Panel title="Theme" icon="theme">
      <div className="ff-segmented" role="group" aria-label="Theme">
        <button
          className={theme === 'light' ? 'is-active' : ''}
          onClick={() => onThemeChange('light')}
          type="button"
        >
          Light
        </button>
        <button
          className={theme === 'dark' ? 'is-active' : ''}
          onClick={() => onThemeChange('dark')}
          type="button"
        >
          Dark
        </button>
      </div>
    </Panel>

    <div className="ff-settings-grid">
      {settingGroups.slice(1).map((group) => (
        <Panel key={group.title}>
          <div className="ff-setting-row">
            <span className="ff-setting-icon"><Icon name={group.icon} /></span>
            <div>
              <strong>{group.title}</strong>
              <p>{group.description}</p>
            </div>
            <IconButton label={`Open ${group.title}`} icon="arrow-right" onClick={onOpenWebsite} />
          </div>
        </Panel>
      ))}
    </div>
  </TabFrame>
);

interface TabFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const TabFrame: React.FC<TabFrameProps> = ({ eyebrow, title, description, actions, children }) => (
  <section className="ff-tab">
    <div className="ff-tab-header">
      <div>
        <span className="ff-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions && <div className="ff-tab-actions">{actions}</div>}
    </div>
    <div className="ff-tab-content">{children}</div>
  </section>
);

interface PanelProps {
  title?: string;
  icon?: IconName;
  className?: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, icon, className = '', children }) => (
  <section className={`ff-panel ${className}`}>
    {title && (
      <div className="ff-panel-header">
        <div>
          {icon && <Icon name={icon} />}
          <h3>{title}</h3>
        </div>
      </div>
    )}
    {children}
  </section>
);

const IntegrationButtons: React.FC<TabProps & { compact?: boolean }> = ({ onOpenWebsite, compact = false }) => (
  <div className={compact ? 'ff-integration-actions is-compact' : 'ff-integration-actions'}>
    {integrationActions.map((action) => (
      <SecondaryButton key={action} label={action} onClick={onOpenWebsite} />
    ))}
  </div>
);

interface ButtonProps {
  icon?: IconName;
  label: string;
  onClick: () => void;
}

const PrimaryButton: React.FC<ButtonProps> = ({ icon, label, onClick }) => (
  <button className="ff-button ff-button-primary" onClick={onClick} type="button">
    {icon && <Icon name={icon} />}
    <span>{label}</span>
  </button>
);

const SecondaryButton: React.FC<ButtonProps> = ({ icon, label, onClick }) => (
  <button className="ff-button ff-button-secondary" onClick={onClick} type="button">
    {icon && <Icon name={icon} />}
    <span>{label}</span>
  </button>
);

const ActionButton: React.FC<ButtonProps> = ({ icon, label, onClick }) => (
  <button className="ff-action-button" onClick={onClick} type="button">
    {icon && <Icon name={icon} />}
    <span>{label}</span>
  </button>
);

const IconButton: React.FC<ButtonProps & { danger?: boolean }> = ({ icon, label, onClick, danger = false }) => (
  <button
    className={danger ? 'ff-icon-button is-danger' : 'ff-icon-button'}
    onClick={onClick}
    title={label}
    type="button"
    aria-label={label}
  >
    {icon && <Icon name={icon} />}
  </button>
);

const Badge: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'success' }> = ({
  children,
  tone = 'neutral',
}) => (
  <span className={`ff-badge ff-badge-${tone}`}>{children}</span>
);

const TagList: React.FC<{ tags: string[] }> = ({ tags }) => (
  <div className="ff-tags">
    {tags.map((tag) => (
      <span key={tag}>{tag}</span>
    ))}
  </div>
);

const StatusRow: React.FC<{ label: string; value: string; tone?: 'success' }> = ({ label, value, tone }) => (
  <div className="ff-status-row">
    <span>{label}</span>
    <strong className={tone === 'success' ? 'is-success' : ''}>{value}</strong>
  </div>
);

export default Popup;
