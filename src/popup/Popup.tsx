import React, { useMemo, useState } from 'react';
import Badge from './components/Badge';
import Button from './components/Button';
import Card from './components/Card';
import Icon, { IconName } from './components/Icon';
import Modal from './components/Modal';
import PersonaCard, { PersonaCardModel } from './components/PersonaCard';
import SearchBar from './components/SearchBar';
import './popup.css';

type TabId =
  | 'home'
  | 'personas'
  | 'assistant'
  | 'vault'
  | 'documents'
  | 'analytics'
  | 'autofill'
  | 'templates'
  | 'integrations'
  | 'team'
  | 'settings';

type ThemeMode = 'light' | 'dark';
type AssistantMode = 'answers' | 'projects' | 'summaries';
type DocumentCategory = 'Resumes' | 'Certificates' | 'Offer Letters';
type AiTone = 'Professional' | 'Concise' | 'Confident';

interface ActivityItem {
  detail: string;
  id: string;
  time: string;
  title: string;
}

interface DocumentItem {
  category: DocumentCategory;
  id: string;
  name: string;
  updated: string;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: IconName;
  status?: 'soon';
}

interface PersonaDraft {
  focus: string;
  id?: string;
  name: string;
  tags: string;
}

interface ToastState {
  detail: string;
  title: string;
}

const FORMFORGE_URL = 'https://formforge.app/';

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'dashboard' },
  { id: 'personas', label: 'Personas', icon: 'persona' },
  { id: 'assistant', label: 'AI Assistant', icon: 'spark' },
  { id: 'vault', label: 'Vault', icon: 'shield' },
  { id: 'documents', label: 'Documents', icon: 'resume' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'autofill', label: 'Autofill Rules', icon: 'check', status: 'soon' },
  { id: 'templates', label: 'Templates', icon: 'file', status: 'soon' },
  { id: 'integrations', label: 'Integrations', icon: 'globe', status: 'soon' },
  { id: 'team', label: 'Team', icon: 'persona', status: 'soon' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const initialPersonas: PersonaCardModel[] = [
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
    focus: 'Academic roles, papers, quantitative analysis',
    tags: ['Papers', 'Statistics', 'Experiments'],
  },
];

const initialDocuments: DocumentItem[] = [
  { id: 'd1', name: 'AI Engineer Resume.pdf', category: 'Resumes', updated: 'Today' },
  { id: 'd2', name: 'Cloud Certificate.pdf', category: 'Certificates', updated: 'Yesterday' },
  { id: 'd3', name: 'Offer Letter.pdf', category: 'Offer Letters', updated: 'May 18' },
];

const initialActivity: ActivityItem[] = [
  { id: 'a1', title: 'Generated answers', detail: 'AI Engineer persona', time: '2m ago' },
  { id: 'a2', title: 'Detected form fields', detail: '14 fields on current page', time: '8m ago' },
  { id: 'a3', title: 'Synced persona data', detail: '3 personas available', time: 'Today' },
];

const vaultValues = [
  { label: 'Phone Number', value: '+91 98765 43210' },
  { label: 'Address', value: 'Bengaluru, Karnataka' },
  { label: 'Aadhaar', value: '1234 5678 9012' },
  { label: 'PAN', value: 'ABCDE1234F' },
  { label: 'Passport', value: 'M1234567' },
];

const assistantCopy: Record<AssistantMode, { label: string; response: string }> = {
  answers: {
    label: 'Application Answers',
    response:
      'I build production-grade AI systems that connect model quality with reliable product behavior. My recent work spans retrieval pipelines, evaluation workflows, and developer tooling for shipping applied AI features safely.',
  },
  projects: {
    label: 'Project Descriptions',
    response:
      'Built a role-aware application assistant that maps form fields to persona context, generates tailored answers, and keeps sensitive identity fields locked until verification.',
  },
  summaries: {
    label: 'Professional Summary',
    response:
      'Applied AI engineer with experience turning model workflows into reliable user-facing products, with strengths across TypeScript interfaces, automation, retrieval systems, and evaluation.',
  },
};

const featureDetails: Record<Exclude<TabId, 'home' | 'personas' | 'assistant' | 'vault' | 'documents' | 'analytics' | 'settings'>, {
  description: string;
  title: string;
}> = {
  autofill: {
    title: 'Autofill Rules',
    description: 'Create site-specific field rules, fallback values, and confidence thresholds.',
  },
  templates: {
    title: 'Templates',
    description: 'Reusable answer blocks, project examples, cover letter snippets, and recruiter notes.',
  },
  integrations: {
    title: 'Integrations',
    description: 'Connect FormForge to job boards, cloud drives, applicant trackers, and the web dashboard.',
  },
  team: {
    title: 'Team',
    description: 'Shared persona libraries, approval workflows, and organization-level vault policies.',
  },
};

const emptyPersonaDraft: PersonaDraft = {
  focus: '',
  name: '',
  tags: '',
};

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [personas, setPersonas] = useState<PersonaCardModel[]>(initialPersonas);
  const [activePersonaId, setActivePersonaId] = useState(initialPersonas[0].id);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('answers');
  const [assistantResponse, setAssistantResponse] = useState(assistantCopy.answers.response);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocuments[0].id);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [websiteIntegration, setWebsiteIntegration] = useState(true);
  const [aiTone, setAiTone] = useState<AiTone>('Professional');
  const [applicationsFilled, setApplicationsFilled] = useState(128);
  const [responsesGenerated, setResponsesGenerated] = useState(416);
  const [personaQuery, setPersonaQuery] = useState('');
  const [documentQuery, setDocumentQuery] = useState('');
  const [personaDraft, setPersonaDraft] = useState<PersonaDraft>(emptyPersonaDraft);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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

  const filteredPersonas = useMemo(() => {
    const query = personaQuery.trim().toLowerCase();
    if (!query) {
      return personas;
    }

    return personas.filter((persona) =>
      [persona.name, persona.focus, ...persona.tags].some((value) => value.toLowerCase().includes(query)),
    );
  }, [personaQuery, personas]);

  const filteredDocuments = useMemo(() => {
    const query = documentQuery.trim().toLowerCase();
    if (!query) {
      return documents;
    }

    return documents.filter((document) =>
      [document.name, document.category, document.updated].some((value) => value.toLowerCase().includes(query)),
    );
  }, [documentQuery, documents]);

  const addActivity = (title: string, detail: string) => {
    setActivity((current) => [
      { id: `${Date.now()}-${title}`, title, detail, time: 'Just now' },
      ...current.slice(0, 4),
    ]);
    setToast({ title, detail });
  };

  const openWebsite = (label = 'Opened FormForge') => {
    addActivity(label, 'Redirecting to formforge.app');

    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: FORMFORGE_URL });
      return;
    }

    window.open(FORMFORGE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleSync = () => {
    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      addActivity('Synced workspace', 'Personas, documents, and settings are up to date');
    }, 700);
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

  const openPersonaModal = (persona?: PersonaCardModel) => {
    setPersonaDraft(
      persona
        ? {
            id: persona.id,
            name: persona.name,
            focus: persona.focus,
            tags: persona.tags.join(', '),
          }
        : emptyPersonaDraft,
    );
    setIsPersonaModalOpen(true);
  };

  const handleSavePersona = () => {
    const tags = personaDraft.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const persona: PersonaCardModel = {
      id: personaDraft.id || `persona-${Date.now()}`,
      name: personaDraft.name.trim() || 'Untitled Persona',
      focus: personaDraft.focus.trim() || 'Custom application profile',
      tags: tags.length ? tags : ['Custom'],
    };

    setPersonas((current) => {
      if (personaDraft.id) {
        return current.map((item) => (item.id === personaDraft.id ? persona : item));
      }

      return [...current, persona];
    });
    setActivePersonaId(persona.id);
    setIsPersonaModalOpen(false);
    addActivity(personaDraft.id ? 'Updated persona' : 'Created persona', persona.name);
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
          <Button icon="theme" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} variant="ghost">
            Theme
          </Button>
          <Button icon="globe" onClick={() => openWebsite()} variant="ghost">
            Web
          </Button>
        </div>
      </header>

      <div className="ff-body">
        <aside className="ff-sidebar" aria-label="Popup navigation">
          <div className="ff-nav-section">
            {navItems.map((item) => (
              <button
                className={`ff-nav-item ${activeTab === item.id ? 'is-active' : ''}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.status === 'soon' && <Badge>Soon</Badge>}
              </button>
            ))}
          </div>
          <div className="ff-sidebar-footer">
            <Button icon="import" isLoading={isSyncing} onClick={handleSync} variant="secondary">
              Sync
            </Button>
          </div>
        </aside>

        <main className="ff-main">
          {activeTab === 'home' && (
            <HomeTab
              activePersona={activePersona}
              activity={activity}
              isSyncing={isSyncing}
              onOpenWebsite={openWebsite}
              onQuickAction={handleQuickAction}
              onSync={handleSync}
            />
          )}
          {activeTab === 'personas' && (
            <PersonasTab
              activePersonaId={activePersonaId}
              filteredPersonas={filteredPersonas}
              onCreate={() => openPersonaModal()}
              onDelete={handleDeletePersona}
              onEdit={openPersonaModal}
              onQueryChange={setPersonaQuery}
              onSelect={(persona) => {
                setActivePersonaId(persona.id);
                addActivity('Switched persona', persona.name);
              }}
              query={personaQuery}
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
              documents={filteredDocuments}
              onDelete={handleDeleteDocument}
              onQueryChange={setDocumentQuery}
              onUpload={handleUploadDocument}
              onView={(document) => {
                setSelectedDocumentId(document.id);
                addActivity('Viewed document', document.name);
              }}
              query={documentQuery}
              selectedDocument={selectedDocument}
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
          {isFutureTab(activeTab) && <FutureFeatureTab feature={featureDetails[activeTab]} onOpenWebsite={openWebsite} />}
        </main>
      </div>

      <Modal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        title={personaDraft.id ? 'Edit Persona' : 'Create Persona'}
      >
        <div className="ff-form-grid">
          <Input
            label="Name"
            onChange={(value) => setPersonaDraft((current) => ({ ...current, name: value }))}
            placeholder="Product Engineer"
            value={personaDraft.name}
          />
          <Input
            label="Focus"
            onChange={(value) => setPersonaDraft((current) => ({ ...current, focus: value }))}
            placeholder="Frontend, product systems, design engineering"
            value={personaDraft.focus}
          />
          <Input
            label="Tags"
            onChange={(value) => setPersonaDraft((current) => ({ ...current, tags: value }))}
            placeholder="React, UX, TypeScript"
            value={personaDraft.tags}
          />
          <div className="ff-form-actions">
            <Button onClick={() => setIsPersonaModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button icon="check" onClick={handleSavePersona} variant="primary">
              Save Persona
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const isFutureTab = (
  tab: TabId,
): tab is Exclude<TabId, 'home' | 'personas' | 'assistant' | 'vault' | 'documents' | 'analytics' | 'settings'> =>
  tab === 'autofill' || tab === 'templates' || tab === 'integrations' || tab === 'team';

interface HomeTabProps {
  activePersona?: PersonaCardModel;
  activity: ActivityItem[];
  isSyncing: boolean;
  onOpenWebsite: (label?: string) => void;
  onQuickAction: (action: 'fill' | 'analyze' | 'generate' | 'upload') => void;
  onSync: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ activePersona, activity, isSyncing, onOpenWebsite, onQuickAction, onSync }) => (
  <TabFrame
    eyebrow="Home"
    title="Application automation, organized."
    description="A compact command center for filling forms, managing personas, and preparing responses."
    actions={
      <div className="ff-hero-actions">
        <Button icon="globe" onClick={() => onOpenWebsite('Opened dashboard')} variant="secondary">
          Open Dashboard
        </Button>
        <Button icon="import" isLoading={isSyncing} onClick={onSync} variant="primary">
          Sync Personas
        </Button>
      </div>
    }
  >
    <div className="ff-dashboard-grid">
      <Card icon="persona" title="Current Persona">
        {activePersona ? (
          <>
            <div className="ff-persona-summary">
              <div>
                <strong>{activePersona.name}</strong>
                <span>{activePersona.focus}</span>
              </div>
              <Badge tone="success">Active</Badge>
            </div>
            <TagList tags={activePersona.tags} />
          </>
        ) : (
          <EmptyState detail="Create a persona to start using FormForge." title="No persona selected" />
        )}
      </Card>

      <Card icon="status" title="Form Detection">
        <StatusRow label="Current page" tone="success" value="Application form detected" />
        <StatusRow label="Fields mapped" value="14 fields" />
        <StatusRow label="Confidence" value="High" />
      </Card>

      <Card className="ff-span-2" icon="dashboard" title="Quick Actions">
        <div className="ff-action-grid">
          <Button icon="check" onClick={() => onQuickAction('fill')} variant="action">
            Fill Current Form
          </Button>
          <Button icon="analyze" onClick={() => onQuickAction('analyze')} variant="action">
            Analyze Form
          </Button>
          <Button icon="spark" onClick={() => onQuickAction('generate')} variant="action">
            Generate Answers
          </Button>
          <Button icon="upload" onClick={() => onQuickAction('upload')} variant="action">
            Upload Resume
          </Button>
        </div>
      </Card>

      <Card className="ff-span-2" icon="analytics" title="Recent Activity">
        <ActivityList activity={activity} />
      </Card>
    </div>
  </TabFrame>
);

interface PersonasTabProps {
  activePersonaId: string;
  filteredPersonas: PersonaCardModel[];
  onCreate: () => void;
  onDelete: (personaId: string) => void;
  onEdit: (persona: PersonaCardModel) => void;
  onQueryChange: (value: string) => void;
  onSelect: (persona: PersonaCardModel) => void;
  query: string;
}

const PersonasTab: React.FC<PersonasTabProps> = ({
  activePersonaId,
  filteredPersonas,
  onCreate,
  onDelete,
  onEdit,
  onQueryChange,
  onSelect,
  query,
}) => (
  <TabFrame
    eyebrow="Personas"
    title="Role-specific application profiles."
    description="Maintain separate positioning, skills, and documents for each target role."
    actions={<Button icon="plus" onClick={onCreate} variant="primary">Create Persona</Button>}
  >
    <div className="ff-toolbar">
      <SearchBar onChange={onQueryChange} placeholder="Search personas" value={query} />
    </div>
    <div className="ff-persona-list">
      {filteredPersonas.length === 0 ? (
        <Card>
          <EmptyState detail="Try a different search or create a new persona." title="No personas found" />
        </Card>
      ) : (
        filteredPersonas.map((persona) => (
          <PersonaCard
            isActive={persona.id === activePersonaId}
            key={persona.id}
            onDelete={() => onDelete(persona.id)}
            onEdit={() => onEdit(persona)}
            onSelect={() => onSelect(persona)}
            persona={persona}
          />
        ))
      )}
    </div>
  </TabFrame>
);

interface AssistantTabProps {
  activePersona?: PersonaCardModel;
  aiTone: AiTone;
  assistantMode: AssistantMode;
  response: string;
  onGenerate: (mode: AssistantMode) => void;
}

const AssistantTab: React.FC<AssistantTabProps> = ({ activePersona, aiTone, assistantMode, response, onGenerate }) => (
  <TabFrame
    eyebrow="AI Assistant"
    title="Draft application-ready responses."
    description="Generate concise answers from the selected persona and saved documents."
  >
    <div className="ff-assistant-grid">
      <Card icon="spark" title="Tools">
        <div className="ff-stack">
          <Button icon="arrow-right" onClick={() => onGenerate('answers')} variant="action">
            Generate Application Answers
          </Button>
          <Button icon="arrow-right" onClick={() => onGenerate('projects')} variant="action">
            Project Descriptions
          </Button>
          <Button icon="arrow-right" onClick={() => onGenerate('summaries')} variant="action">
            Professional Summaries
          </Button>
        </div>
      </Card>

      <Card icon="file" title="Response Area">
        <div className="ff-response-box">
          <div className="ff-response-toolbar">
            <Badge>{activePersona?.name || 'No persona'}</Badge>
            <Badge>{assistantCopy[assistantMode].label}</Badge>
            <span>{aiTone} tone</span>
          </div>
          <textarea aria-label="Generated response" className="ff-response-textarea" readOnly value={response} />
        </div>
      </Card>
    </div>
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
    description="Identity and personal records are hidden until verification is complete."
    actions={
      <Button icon={vaultUnlocked ? 'shield' : 'unlock'} onClick={onToggleVault} variant="primary">
        {vaultUnlocked ? 'Lock Vault' : 'Unlock Vault'}
      </Button>
    }
  >
    <Card icon="shield" title={vaultUnlocked ? 'Unlocked Fields' : 'Locked Fields'}>
      <div className="ff-vault-grid">
        {vaultValues.map((item) => (
          <div className="ff-vault-item" key={item.label}>
            <Icon name={vaultUnlocked ? 'unlock' : 'shield'} />
            <span>{item.label}</span>
            <strong>{vaultUnlocked && securityEnabled ? item.value : 'Locked'}</strong>
          </div>
        ))}
      </div>
    </Card>
  </TabFrame>
);

interface DocumentsTabProps {
  documents: DocumentItem[];
  onDelete: (documentId: string) => void;
  onQueryChange: (value: string) => void;
  onUpload: () => void;
  onView: (document: DocumentItem) => void;
  query: string;
  selectedDocument?: DocumentItem;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onDelete,
  onQueryChange,
  onUpload,
  onView,
  query,
  selectedDocument,
}) => (
  <TabFrame
    eyebrow="Documents"
    title="Keep application files close."
    description="Manage resumes, certificates, and offer letters used across personas."
    actions={<Button icon="upload" onClick={onUpload} variant="primary">Upload</Button>}
  >
    <div className="ff-toolbar">
      <SearchBar onChange={onQueryChange} placeholder="Search documents" value={query} />
    </div>
    <div className="ff-document-grid">
      <Card className="ff-library-card" icon="resume" title="Document Library">
        {documents.length === 0 ? (
          <EmptyState detail="Upload a resume or clear the search filter." title="No documents found" />
        ) : (
          <div className="ff-list">
            {documents.map((document) => (
              <div className="ff-list-row ff-document-row" key={document.id}>
                <div>
                  <strong>{document.name}</strong>
                  <span>{document.category} - Updated {document.updated}</span>
                </div>
                <div className="ff-row-actions">
                  <Button icon="eye" onClick={() => onView(document)} title={`View ${document.name}`} variant="ghost">
                    View
                  </Button>
                  <Button icon="trash" onClick={() => onDelete(document.id)} title={`Delete ${document.name}`} variant="danger">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card icon="eye" title="Preview">
        {selectedDocument ? (
          <div className="ff-preview">
            <strong>{selectedDocument.name}</strong>
            <span>{selectedDocument.category} document selected for form workflows.</span>
            <Badge>Mock preview</Badge>
          </div>
        ) : (
          <EmptyState detail="Select a document to preview its metadata." title="Nothing selected" />
        )}
      </Card>
    </div>
  </TabFrame>
);

interface AnalyticsTabProps {
  applicationsFilled: number;
  personasCreated: number;
  responsesGenerated: number;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ applicationsFilled, personasCreated, responsesGenerated }) => {
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
      description="Activity, automation value, and generated content in one operational view."
    >
      <div className="ff-metric-grid">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="ff-metric">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.delta}</small>
            </div>
          </Card>
        ))}
      </div>
    </TabFrame>
  );
};

interface SettingsTabProps {
  aiTone: AiTone;
  securityEnabled: boolean;
  theme: ThemeMode;
  websiteIntegration: boolean;
  onAiToneChange: (tone: AiTone) => void;
  onOpenWebsite: (label?: string) => void;
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
    actions={
      <div className="ff-hero-actions">
        <Button icon="globe" onClick={() => onOpenWebsite('Opened account')} variant="secondary">
          Manage Account
        </Button>
      </div>
    }
  >
    <div className="ff-settings-grid">
      <Card icon="theme" title="Theme">
        <SegmentedControl label="Theme" onChange={(value) => onThemeChange(value as ThemeMode)} options={['light', 'dark']} value={theme} />
      </Card>

      <Card icon="shield" title="Security">
        <ToggleRow checked={securityEnabled} detail="Require vault unlock before showing sensitive data" label="Vault protection" onChange={onSecurityChange} />
      </Card>

      <Card icon="spark" title="AI Configuration">
        <SegmentedControl
          label="Tone"
          onChange={(value) => onAiToneChange(value as AiTone)}
          options={['Professional', 'Concise', 'Confident']}
          value={aiTone}
        />
      </Card>

      <Card icon="globe" title="Website Integration">
        <ToggleRow checked={websiteIntegration} detail="Allow dashboard sync and account workflows" label="Dashboard sync" onChange={onWebsiteIntegrationChange} />
      </Card>
    </div>
  </TabFrame>
);

const FutureFeatureTab: React.FC<{
  feature: { description: string; title: string };
  onOpenWebsite: (label?: string) => void;
}> = ({ feature, onOpenWebsite }) => (
  <TabFrame
    eyebrow="Roadmap"
    title={feature.title}
    description={feature.description}
    actions={<Button icon="globe" onClick={() => onOpenWebsite(`Opened ${feature.title}`)} variant="primary">Open Dashboard</Button>}
  >
    <Card>
      <EmptyState
        detail="This feature has a permanent place in navigation and will connect to the FormForge web app as it ships."
        title={`${feature.title} is coming soon`}
      />
    </Card>
    <div className="ff-roadmap-grid">
      <Card icon="check" title="Planned Controls">
        <StatusRow label="Navigation" tone="success" value="Available now" />
        <StatusRow label="Mock data" tone="success" value="Ready" />
        <StatusRow label="Backend integration" value="Future" />
      </Card>
      <Card icon="globe" title="Website Entry">
        <div className="ff-preview">
          <strong>formforge.app</strong>
          <span>Use the dashboard button to access account, billing, and web workflows.</span>
        </div>
      </Card>
    </div>
  </TabFrame>
);

interface TabFrameProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

const TabFrame: React.FC<TabFrameProps> = ({ actions, children, description, eyebrow, title }) => (
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

const ActivityList: React.FC<{ activity: ActivityItem[] }> = ({ activity }) => {
  if (activity.length === 0) {
    return <EmptyState detail="Recent actions will appear here." title="No activity yet" />;
  }

  return (
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
  );
};

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
    <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type="text" value={value} />
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
      <button className={value === option ? 'is-active' : ''} key={option} onClick={() => onChange(option)} type="button">
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

const EmptyState: React.FC<{ detail: string; title: string }> = ({ detail, title }) => (
  <div className="ff-empty-state">
    <strong>{title}</strong>
    <span>{detail}</span>
  </div>
);

export default Popup;
