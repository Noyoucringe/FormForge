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
type AssistantMode = 'answers' | 'projects' | 'summaries';
type DocumentCategory = 'Resumes' | 'Certificates' | 'Offer Letters';

interface Persona {
  id: string;
  name: string;
  focus: string;
  tags: string[];
}

interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  updated: string;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: IconName;
}

interface ToastState {
  title: string;
  detail: string;
}

interface PersonaDraft {
  id?: string;
  name: string;
  focus: string;
  tags: string;
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

const initialPersonas: Persona[] = [
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    focus: 'ML platforms, LLM products, applied AI',
    tags: ['Python', 'LLMs', 'MLOps'],
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

const initialActivity: ActivityItem[] = [
  { id: 'a1', title: 'Generated answers', detail: 'AI Engineer persona', time: '2m ago' },
  { id: 'a2', title: 'Detected form fields', detail: '14 fields on current page', time: '8m ago' },
  { id: 'a3', title: 'Synced persona data', detail: '3 personas available', time: 'Today' },
];

const initialDocuments: DocumentItem[] = [
  { id: 'd1', name: 'AI Engineer Resume.pdf', category: 'Resumes', updated: 'Today' },
  { id: 'd2', name: 'Cloud Certificate.pdf', category: 'Certificates', updated: 'Yesterday' },
  { id: 'd3', name: 'Offer Letter.pdf', category: 'Offer Letters', updated: 'May 18' },
];

const vaultValues = [
  { label: 'Phone Number', value: '+91 98765 43210' },
  { label: 'Address', value: 'Bengaluru, Karnataka' },
  { label: 'Aadhaar', value: '1234 5678 9012' },
  { label: 'PAN', value: 'ABCDE1234F' },
  { label: 'Passport', value: 'M1234567' },
];

const integrationActions = ['Open Dashboard', 'Login', 'Sync Personas', 'Manage Account'];

const assistantCopy: Record<AssistantMode, { label: string; response: string }> = {
  answers: {
    label: 'Generate Application Answers',
    response:
      'I build production-grade AI systems that connect model quality with reliable product behavior. My recent work spans retrieval pipelines, evaluation workflows, and developer tooling for shipping applied AI features safely.',
  },
  projects: {
    label: 'Project Descriptions',
    response:
      'Built a role-aware application assistant that maps form fields to persona context, generates tailored answers, and keeps sensitive identity fields locked until verification.',
  },
  summaries: {
    label: 'Professional Summaries',
    response:
      'Applied AI engineer with experience turning model workflows into reliable user-facing products, with strengths across TypeScript interfaces, automation, retrieval systems, and evaluation.',
  },
};

const emptyPersonaDraft: PersonaDraft = {
  name: '',
  focus: '',
  tags: '',
};

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [activePersonaId, setActivePersonaId] = useState(initialPersonas[0].id);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('answers');
  const [assistantResponse, setAssistantResponse] = useState(assistantCopy.answers.response);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocuments[0].id);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [websiteIntegration, setWebsiteIntegration] = useState(true);
  const [aiTone, setAiTone] = useState<'Professional' | 'Concise' | 'Confident'>('Professional');
  const [applicationsFilled, setApplicationsFilled] = useState(128);
  const [responsesGenerated, setResponsesGenerated] = useState(416);
  const [toast, setToast] = useState<ToastState>({
    title: 'Ready',
    detail: 'FormForge popup is active.',
  });

  const activePersona = useMemo(
    () => personas.find((persona) => persona.id === activePersonaId) || personas[0],
    [activePersonaId, personas],
  );

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedDocumentId) || documents[0],
    [documents, selectedDocumentId],
  );

  const addActivity = (title: string, detail: string) => {
    setActivity((current) => [
      { id: `${Date.now()}-${title}`, title, detail, time: 'Just now' },
      ...current.slice(0, 4),
    ]);
    setToast({ title, detail });
  };

  const openWebsite = () => {
    addActivity('Opened FormForge', 'Redirecting to formforge.app');

    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: FORMFORGE_URL });
      return;
    }

    window.open(FORMFORGE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleQuickAction = (action: 'fill' | 'analyze' | 'generate' | 'upload') => {
    if (action === 'fill') {
      setApplicationsFilled((count) => count + 1);
      addActivity('Filled current form', `${activePersona.name} mapped to 14 fields`);
      return;
    }

    if (action === 'analyze') {
      addActivity('Analyzed form', 'Detected application form with high confidence');
      return;
    }

    if (action === 'generate') {
      setActiveTab('assistant');
      handleAssistantGenerate('answers');
      return;
    }

    setActiveTab('documents');
    addActivity('Opened upload workflow', 'Document library is ready for a new file');
  };

  const handleAssistantGenerate = (mode: AssistantMode) => {
    setAssistantMode(mode);
    setAssistantResponse(assistantCopy[mode].response);
    setResponsesGenerated((count) => count + 1);
    addActivity(assistantCopy[mode].label, `${activePersona.name} - ${aiTone.toLowerCase()} tone`);
  };

  const handleSavePersona = (draft: PersonaDraft) => {
    const tags = draft.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const persona: Persona = {
      id: draft.id || `persona-${Date.now()}`,
      name: draft.name.trim() || 'Untitled Persona',
      focus: draft.focus.trim() || 'Custom application profile',
      tags: tags.length ? tags : ['Custom'],
    };

    setPersonas((current) => {
      if (draft.id) {
        return current.map((item) => (item.id === draft.id ? persona : item));
      }

      return [...current, persona];
    });
    setActivePersonaId(persona.id);
    addActivity(draft.id ? 'Updated persona' : 'Created persona', persona.name);
  };

  const handleDeletePersona = (personaId: string) => {
    setPersonas((current) => {
      if (current.length === 1) {
        addActivity('Persona retained', 'At least one persona is required');
        return current;
      }

      const next = current.filter((persona) => persona.id !== personaId);
      if (activePersonaId === personaId) {
        setActivePersonaId(next[0].id);
      }
      return next;
    });
    addActivity('Deleted persona', 'Persona list updated');
  };

  const handleUploadDocument = () => {
    const nextNumber = documents.length + 1;
    const document: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: `Uploaded Resume ${nextNumber}.pdf`,
      category: 'Resumes',
      updated: 'Just now',
    };

    setDocuments((current) => [document, ...current]);
    setSelectedDocumentId(document.id);
    addActivity('Uploaded document', document.name);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments((current) => {
      const next = current.filter((document) => document.id !== documentId);
      setSelectedDocumentId(next[0]?.id || '');
      return next;
    });
    addActivity('Deleted document', 'Document library updated');
  };

  return (
    <div className="ff-popup" data-theme={theme}>
      <header className="ff-header">
        <div className="ff-brand">
          <div className="ff-logo" aria-hidden="true">F</div>
          <div>
            <h1>FormForge</h1>
            <p>{toast.title}: {toast.detail}</p>
          </div>
        </div>
        <div className="ff-header-actions">
          <IconButton
            label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
            icon="theme"
            onClick={() => {
              setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
              addActivity('Changed theme', theme === 'dark' ? 'Light mode enabled' : 'Dark mode enabled');
            }}
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
          {activeTab === 'home' && (
            <HomeTab
              activePersona={activePersona}
              activity={activity}
              onOpenWebsite={openWebsite}
              onQuickAction={handleQuickAction}
            />
          )}
          {activeTab === 'personas' && (
            <PersonasTab
              activePersonaId={activePersonaId}
              personas={personas}
              onCreateOrUpdate={handleSavePersona}
              onDelete={handleDeletePersona}
              onSelect={(persona) => {
                setActivePersonaId(persona.id);
                addActivity('Switched persona', persona.name);
              }}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantTab
              activePersona={activePersona}
              aiTone={aiTone}
              assistantMode={assistantMode}
              response={assistantResponse}
              onGenerate={handleAssistantGenerate}
            />
          )}
          {activeTab === 'vault' && (
            <VaultTab
              securityEnabled={securityEnabled}
              vaultUnlocked={vaultUnlocked}
              onToggleVault={() => {
                setVaultUnlocked((current) => !current);
                addActivity(vaultUnlocked ? 'Locked vault' : 'Unlocked vault', 'Sensitive fields updated');
              }}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab
              documents={documents}
              selectedDocument={selectedDocument}
              onDelete={handleDeleteDocument}
              onUpload={handleUploadDocument}
              onView={(document) => {
                setSelectedDocumentId(document.id);
                addActivity('Viewed document', document.name);
              }}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab
              applicationsFilled={applicationsFilled}
              personasCreated={personas.length}
              responsesGenerated={responsesGenerated}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              aiTone={aiTone}
              securityEnabled={securityEnabled}
              theme={theme}
              websiteIntegration={websiteIntegration}
              onAiToneChange={(tone) => {
                setAiTone(tone);
                addActivity('Updated AI tone', `${tone} tone selected`);
              }}
              onOpenWebsite={openWebsite}
              onSecurityChange={(enabled) => {
                setSecurityEnabled(enabled);
                if (!enabled) {
                  setVaultUnlocked(false);
                }
                addActivity('Updated security', enabled ? 'Vault security enabled' : 'Vault security disabled');
              }}
              onThemeChange={(mode) => {
                setTheme(mode);
                addActivity('Changed theme', `${mode === 'dark' ? 'Dark' : 'Light'} mode enabled`);
              }}
              onWebsiteIntegrationChange={(enabled) => {
                setWebsiteIntegration(enabled);
                addActivity('Website integration', enabled ? 'Integration enabled' : 'Integration paused');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

interface HomeTabProps {
  activePersona: Persona;
  activity: ActivityItem[];
  onOpenWebsite: () => void;
  onQuickAction: (action: 'fill' | 'analyze' | 'generate' | 'upload') => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ activePersona, activity, onOpenWebsite, onQuickAction }) => (
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
        <ActionButton icon="check" label="Fill Current Form" onClick={() => onQuickAction('fill')} />
        <ActionButton icon="analyze" label="Analyze Form" onClick={() => onQuickAction('analyze')} />
        <ActionButton icon="spark" label="Generate Answers" onClick={() => onQuickAction('generate')} />
        <ActionButton icon="upload" label="Upload Resume" onClick={() => onQuickAction('upload')} />
      </div>
    </Panel>

    <Panel title="Recent Activity" icon="analytics">
      <div className="ff-list ff-list-compact">
        {activity.slice(0, 4).map((item) => (
          <div className="ff-list-row" key={item.id}>
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

interface PersonasTabProps {
  activePersonaId: string;
  personas: Persona[];
  onCreateOrUpdate: (draft: PersonaDraft) => void;
  onDelete: (personaId: string) => void;
  onSelect: (persona: Persona) => void;
}

const PersonasTab: React.FC<PersonasTabProps> = ({
  activePersonaId,
  personas,
  onCreateOrUpdate,
  onDelete,
  onSelect,
}) => {
  const [draft, setDraft] = useState<PersonaDraft>(emptyPersonaDraft);
  const [isEditing, setIsEditing] = useState(false);

  const beginEdit = (persona: Persona) => {
    setDraft({
      id: persona.id,
      name: persona.name,
      focus: persona.focus,
      tags: persona.tags.join(', '),
    });
    setIsEditing(true);
  };

  const saveDraft = () => {
    onCreateOrUpdate(draft);
    setDraft(emptyPersonaDraft);
    setIsEditing(false);
  };

  return (
    <TabFrame
      eyebrow="Personas"
      title="Profiles for different application paths."
      description="Switch the tone, experience, and supporting material used while filling roles."
      actions={
        <PrimaryButton
          icon="plus"
          label="Create Persona"
          onClick={() => {
            setDraft(emptyPersonaDraft);
            setIsEditing(true);
          }}
        />
      }
    >
      {isEditing && (
        <Panel title={draft.id ? 'Edit Persona' : 'Create Persona'} icon="edit">
          <div className="ff-form-grid">
            <Input
              label="Name"
              value={draft.name}
              onChange={(value) => setDraft((current) => ({ ...current, name: value }))}
              placeholder="Product Engineer"
            />
            <Input
              label="Focus"
              value={draft.focus}
              onChange={(value) => setDraft((current) => ({ ...current, focus: value }))}
              placeholder="Frontend, product systems, design engineering"
            />
            <Input
              label="Tags"
              value={draft.tags}
              onChange={(value) => setDraft((current) => ({ ...current, tags: value }))}
              placeholder="React, UX, TypeScript"
            />
            <div className="ff-form-actions">
              <SecondaryButton label="Cancel" onClick={() => setIsEditing(false)} />
              <PrimaryButton icon="check" label="Save" onClick={saveDraft} />
            </div>
          </div>
        </Panel>
      )}

      <div className="ff-persona-list">
        {personas.map((persona) => (
          <Panel key={persona.id} className={persona.id === activePersonaId ? 'is-selected' : ''}>
            <div className="ff-persona-card">
              <button className="ff-persona-select" onClick={() => onSelect(persona)} type="button">
                <div className="ff-card-heading">
                  <strong>{persona.name}</strong>
                  {persona.id === activePersonaId && <Badge tone="success">Current</Badge>}
                </div>
                <p>{persona.focus}</p>
                <TagList tags={persona.tags} />
              </button>
              <div className="ff-row-actions">
                <IconButton label={`Edit ${persona.name}`} icon="edit" onClick={() => beginEdit(persona)} />
                <IconButton label={`Delete ${persona.name}`} icon="trash" onClick={() => onDelete(persona.id)} danger />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </TabFrame>
  );
};

interface AssistantTabProps {
  activePersona: Persona;
  aiTone: 'Professional' | 'Concise' | 'Confident';
  assistantMode: AssistantMode;
  response: string;
  onGenerate: (mode: AssistantMode) => void;
}

const AssistantTab: React.FC<AssistantTabProps> = ({
  activePersona,
  aiTone,
  assistantMode,
  response,
  onGenerate,
}) => (
  <TabFrame
    eyebrow="AI Assistant"
    title="Draft application-ready responses."
    description="Generate concise answers from the selected persona and saved documents."
  >
    <Panel title="Tools" icon="spark">
      <div className="ff-action-grid ff-action-grid-three">
        <ActionButton icon="arrow-right" label="Generate Application Answers" onClick={() => onGenerate('answers')} />
        <ActionButton icon="arrow-right" label="Project Descriptions" onClick={() => onGenerate('projects')} />
        <ActionButton icon="arrow-right" label="Professional Summaries" onClick={() => onGenerate('summaries')} />
      </div>
    </Panel>

    <Panel title="Response Area" icon="file">
      <div className="ff-response-box">
        <div className="ff-response-toolbar">
          <Badge>{activePersona.name}</Badge>
          <Badge>{assistantCopy[assistantMode].label}</Badge>
          <span>{aiTone} tone</span>
        </div>
        <textarea
          aria-label="Generated response"
          className="ff-response-textarea"
          onChange={() => undefined}
          readOnly
          value={response}
        />
      </div>
    </Panel>
  </TabFrame>
);

interface VaultTabProps {
  securityEnabled: boolean;
  vaultUnlocked: boolean;
  onToggleVault: () => void;
}

const VaultTab: React.FC<VaultTabProps> = ({ securityEnabled, vaultUnlocked, onToggleVault }) => (
  <TabFrame
    eyebrow="Vault"
    title="Sensitive details stay protected."
    description="Identity and personal records are hidden until security verification is complete."
    actions={
      <PrimaryButton
        icon={vaultUnlocked ? 'shield' : 'unlock'}
        label={vaultUnlocked ? 'Lock Vault' : 'Unlock Vault'}
        onClick={onToggleVault}
      />
    }
  >
    <Panel title={vaultUnlocked ? 'Unlocked Fields' : 'Locked Fields'} icon="shield">
      <div className="ff-vault-grid">
        {vaultValues.map((item) => (
          <div className="ff-vault-item" key={item.label}>
            <Icon name={vaultUnlocked ? 'unlock' : 'shield'} />
            <span>{item.label}</span>
            <strong>{vaultUnlocked && securityEnabled ? item.value : 'Locked'}</strong>
          </div>
        ))}
      </div>
    </Panel>
  </TabFrame>
);

interface DocumentsTabProps {
  documents: DocumentItem[];
  selectedDocument?: DocumentItem;
  onDelete: (documentId: string) => void;
  onUpload: () => void;
  onView: (document: DocumentItem) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  selectedDocument,
  onDelete,
  onUpload,
  onView,
}) => (
  <TabFrame
    eyebrow="Documents"
    title="Keep application files close."
    description="Manage resumes, certificates, and offer letters used across personas."
    actions={<PrimaryButton icon="upload" label="Upload" onClick={onUpload} />}
  >
    <Panel title="Document Library" icon="resume">
      {documents.length === 0 ? (
        <EmptyState title="No documents yet" detail="Upload a resume to start the library." />
      ) : (
        <div className="ff-list">
          {documents.map((document) => (
            <div className="ff-list-row ff-document-row" key={document.id}>
              <div>
                <strong>{document.name}</strong>
                <span>{document.category} - Updated {document.updated}</span>
              </div>
              <div className="ff-row-actions">
                <IconButton label={`View ${document.name}`} icon="eye" onClick={() => onView(document)} />
                <IconButton label={`Delete ${document.name}`} icon="trash" onClick={() => onDelete(document.id)} danger />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>

    {selectedDocument && (
      <Panel title="Preview" icon="eye">
        <div className="ff-preview">
          <strong>{selectedDocument.name}</strong>
          <span>{selectedDocument.category} document selected for form workflows.</span>
        </div>
      </Panel>
    )}
  </TabFrame>
);

interface AnalyticsTabProps {
  applicationsFilled: number;
  personasCreated: number;
  responsesGenerated: number;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  applicationsFilled,
  personasCreated,
  responsesGenerated,
}) => {
  const metrics = [
    { label: 'Applications Filled', value: String(applicationsFilled), delta: '+1 when Fill Current Form runs' },
    { label: 'Time Saved', value: `${Math.round(applicationsFilled * 0.19)}h`, delta: 'Estimated from autofill activity' },
    { label: 'Personas Created', value: String(personasCreated), delta: 'Live persona count' },
    { label: 'Responses Generated', value: String(responsesGenerated), delta: '+1 when assistant generates' },
  ];

  return (
    <TabFrame
      eyebrow="Analytics"
      title="Measure the workflow lift."
      description="A quick read on activity, automation value, and generated content."
    >
      <div className="ff-metric-grid">
        {metrics.map((metric) => (
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
};

interface SettingsTabProps {
  aiTone: 'Professional' | 'Concise' | 'Confident';
  securityEnabled: boolean;
  theme: ThemeMode;
  websiteIntegration: boolean;
  onAiToneChange: (tone: 'Professional' | 'Concise' | 'Confident') => void;
  onOpenWebsite: () => void;
  onSecurityChange: (enabled: boolean) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onWebsiteIntegrationChange: (enabled: boolean) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  aiTone,
  securityEnabled,
  theme,
  websiteIntegration,
  onAiToneChange,
  onOpenWebsite,
  onSecurityChange,
  onThemeChange,
  onWebsiteIntegrationChange,
}) => (
  <TabFrame
    eyebrow="Settings"
    title="Configure FormForge."
    description="Control product preferences, account sync, security, and website integration."
    actions={<IntegrationButtons onOpenWebsite={onOpenWebsite} compact />}
  >
    <Panel title="Theme" icon="theme">
      <SegmentedControl
        label="Theme"
        options={['light', 'dark']}
        value={theme}
        onChange={(value) => onThemeChange(value as ThemeMode)}
      />
    </Panel>

    <Panel title="Security" icon="shield">
      <ToggleRow
        checked={securityEnabled}
        detail="Require vault unlock before showing sensitive data"
        label="Vault protection"
        onChange={onSecurityChange}
      />
    </Panel>

    <Panel title="AI Configuration" icon="spark">
      <SegmentedControl
        label="Tone"
        options={['Professional', 'Concise', 'Confident']}
        value={aiTone}
        onChange={(value) => onAiToneChange(value as 'Professional' | 'Concise' | 'Confident')}
      />
    </Panel>

    <Panel title="Website Integration" icon="globe">
      <ToggleRow
        checked={websiteIntegration}
        detail="Allow dashboard sync and account workflows"
        label="Dashboard sync"
        onChange={onWebsiteIntegrationChange}
      />
    </Panel>
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

const IntegrationButtons: React.FC<{ onOpenWebsite: () => void; compact?: boolean }> = ({
  onOpenWebsite,
  compact = false,
}) => (
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

interface InputProps {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

const Input: React.FC<InputProps> = ({ label, onChange, placeholder, value }) => (
  <label className="ff-field">
    <span>{label}</span>
    <input
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  </label>
);

interface SegmentedControlProps {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ label, onChange, options, value }) => (
  <div className="ff-segmented" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        className={value === option ? 'is-active' : ''}
        key={option}
        onClick={() => onChange(option)}
        type="button"
      >
        {option}
      </button>
    ))}
  </div>
);

interface ToggleRowProps {
  checked: boolean;
  detail: string;
  label: string;
  onChange: (checked: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ checked, detail, label, onChange }) => (
  <label className="ff-toggle-row">
    <span>
      <strong>{label}</strong>
      <small>{detail}</small>
    </span>
    <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
  </label>
);

const EmptyState: React.FC<{ title: string; detail: string }> = ({ title, detail }) => (
  <div className="ff-empty-state">
    <strong>{title}</strong>
    <span>{detail}</span>
  </div>
);

export default Popup;
