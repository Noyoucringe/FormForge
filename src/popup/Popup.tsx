import React, { useMemo, useState } from 'react';
import Badge from './components/Badge';
import Icon, { IconName } from './components/Icon';
import './popup.css';

/* ================================================================
   TYPES
   ================================================================ */

type TabId = 'home' | 'profileWorkspace' | 'vault' | 'analytics' | 'settings';
type WorkspaceTab = 'overview' | 'skills' | 'projects' | 'documents';
type ThemeMode = 'light' | 'dark';
type AiTone = 'Professional' | 'Concise' | 'Confident';

interface KnowledgeBaseEntry { key: string; value: string; }
interface KnowledgeBaseGroup { label: string; entries: KnowledgeBaseEntry[]; }
interface ProjectItem { id: string; name: string; description: string; }
interface DocumentItem { id: string; name: string; category: string; updated: string; }

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  date: string;
}

interface ProfileModel {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  skills: string[];
  focusAreas: string[];
  projects: ProjectItem[];
  documents: DocumentItem[];
  knowledgeBase: KnowledgeBaseGroup[];
  resume?: { name: string; updated: string };
  experience: string;
  lastUpdated: string;
  health: number;
  missingFields: string[];
}

interface ProfileDraft {
  id?: string;
  name: string;
  emoji: string;
  subtitle: string;
  skills: string;
  focusAreas: string;
  experience: string;
}

/* ================================================================
   INITIAL DATA
   ================================================================ */

const KB_TEMPLATE: KnowledgeBaseGroup[] = [
  {
    label: 'Personal',
    entries: [
      { key: 'About Me', value: '' },
      { key: 'Career Objective', value: '' },
    ],
  },
  {
    label: 'Professional',
    entries: [
      { key: 'Leadership', value: '' },
      { key: 'Achievements', value: '' },
      { key: 'Open Source', value: '' },
    ],
  },
  {
    label: 'Interview',
    entries: [
      { key: 'Strengths', value: '' },
      { key: 'Weaknesses', value: '' },
      { key: 'Preferred Stack', value: '' },
    ],
  },
];

const initialProfiles: ProfileModel[] = [
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    emoji: '🤖',
    subtitle: 'Applied AI · LLM Engineering',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'RAG', 'Docker', 'FastAPI', 'HuggingFace', 'CUDA', 'MLflow', 'Weights & Biases', 'OpenAI API', 'Pinecone', 'Redis', 'PostgreSQL', 'Kubernetes', 'AWS SageMaker', 'Transformers', 'ONNX', 'Streamlit', 'Gradio'],
    focusAreas: ['Generative AI', 'LLMs', 'RAG', 'Computer Vision'],
    projects: [
      { id: 'p1', name: 'AI Interviewer', description: 'Real-time interview simulation with LLM feedback' },
      { id: 'p2', name: 'SentinelAI', description: 'Automated threat detection using vision transformers' },
      { id: 'p3', name: 'FormForge', description: 'Intelligent form autofill with persona-aware AI' },
      { id: 'p4', name: 'DocuMind', description: 'RAG pipeline for internal document Q&A' },
      { id: 'p5', name: 'EvalKit', description: 'LLM evaluation framework with custom metrics' },
      { id: 'p6', name: 'VoiceClone', description: 'Zero-shot voice synthesis using diffusion models' },
      { id: 'p7', name: 'CodeReview AI', description: 'Automated PR reviews with context-aware suggestions' },
      { id: 'p8', name: 'DataForge', description: 'Synthetic data generation for ML training pipelines' },
    ],
    documents: [
      { id: 'd1', name: 'AI_Resume.pdf', category: 'Resume', updated: 'Yesterday' },
      { id: 'd2', name: 'TensorFlow_Certificate.pdf', category: 'Certificate', updated: '3 days ago' },
      { id: 'd3', name: 'AWS_ML_Specialty.pdf', category: 'Certificate', updated: 'Last week' },
      { id: 'd4', name: 'Cover_Letter_Google.pdf', category: 'Cover Letter', updated: 'Today' },
      { id: 'd5', name: 'Research_Paper.pdf', category: 'Publication', updated: '2 weeks ago' },
    ],
    knowledgeBase: [
      {
        label: 'Personal',
        entries: [
          { key: 'About Me', value: 'Applied AI engineer building production LLM systems' },
          { key: 'Career Objective', value: 'Lead AI infrastructure at a top-tier tech company' },
        ],
      },
      {
        label: 'Professional',
        entries: [
          { key: 'Leadership', value: 'Led 4-person ML team shipping RAG pipeline' },
          { key: 'Achievements', value: 'Published 2 papers, 3x hackathon winner' },
          { key: 'Open Source', value: 'Contributor to LangChain and HuggingFace' },
        ],
      },
      {
        label: 'Interview',
        entries: [
          { key: 'Strengths', value: 'System design, rapid prototyping, evaluation' },
          { key: 'Weaknesses', value: 'Perfectionism in early-stage projects' },
          { key: 'Preferred Stack', value: 'Python, FastAPI, PostgreSQL, Docker, AWS' },
        ],
      },
    ],
    resume: { name: 'AI_Resume.pdf', updated: 'Yesterday' },
    experience: '2 Years',
    lastUpdated: '3 hours ago',
    health: 82,
    missingFields: ['Portfolio', 'LinkedIn', 'Certifications Page'],
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    emoji: '💻',
    subtitle: 'Full Stack · Systems Design',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js', 'Redis', 'Prisma', 'TailwindCSS', 'Jest'],
    focusAreas: ['Backend Systems', 'API Design', 'Cloud Architecture'],
    projects: [
      { id: 'p1', name: 'FormForge', description: 'Browser extension for intelligent form autofill' },
      { id: 'p2', name: 'TaskFlow', description: 'Real-time collaborative project management app' },
      { id: 'p3', name: 'PayStream', description: 'Payment processing microservice with Stripe' },
    ],
    documents: [
      { id: 'd1', name: 'SWE_Resume.pdf', category: 'Resume', updated: 'Today' },
      { id: 'd2', name: 'AWS_Solutions_Architect.pdf', category: 'Certificate', updated: 'Last week' },
    ],
    knowledgeBase: KB_TEMPLATE,
    resume: { name: 'SWE_Resume.pdf', updated: 'Today' },
    experience: '3 Years',
    lastUpdated: '1 day ago',
    health: 64,
    missingFields: ['Portfolio', 'GitHub', 'Cover Letter', 'About Me'],
  },
  {
    id: 'research',
    name: 'Research',
    emoji: '🔬',
    subtitle: 'Academic Research · Quantitative Analysis',
    skills: ['Python', 'R', 'LaTeX', 'Statistics', 'MATLAB', 'Pandas', 'NumPy', 'Jupyter'],
    focusAreas: ['Machine Learning Theory', 'Statistical Modeling', 'Experiment Design'],
    projects: [
      { id: 'p1', name: 'Attention Dynamics', description: 'Novel attention mechanism for long-context LLMs' },
      { id: 'p2', name: 'BioStat Toolkit', description: 'Statistical analysis package for clinical trials' },
    ],
    documents: [
      { id: 'd1', name: 'Academic_CV.pdf', category: 'Resume', updated: '2 days ago' },
      { id: 'd2', name: 'Research_Statement.pdf', category: 'Statement', updated: 'Last week' },
    ],
    knowledgeBase: KB_TEMPLATE,
    resume: { name: 'Academic_CV.pdf', updated: '2 days ago' },
    experience: '4 Years',
    lastUpdated: '2 days ago',
    health: 55,
    missingFields: ['Portfolio', 'GitHub', 'LinkedIn', 'Cover Letter', 'Achievements'],
  },
];

const initialActivity: ActivityItem[] = [
  { id: 'a1', title: 'Filled Google Internship form', time: '12:42 PM', date: 'Today' },
  { id: 'a2', title: 'Generated Cover Letter', time: '11:17 AM', date: 'Today' },
  { id: 'a3', title: 'Updated AI Resume', time: '', date: 'Yesterday' },
  { id: 'a4', title: 'Uploaded TensorFlow Certificate', time: '', date: 'Yesterday' },
  { id: 'a5', title: 'Analyzed LinkedIn job page', time: '', date: '2 days ago' },
];

const vaultEntries = [
  { label: 'Phone', value: '+91 98765 43210' },
  { label: 'Address', value: 'Bengaluru, Karnataka' },
  { label: 'Aadhaar', value: '1234 5678 9012' },
  { label: 'PAN', value: 'ABCDE1234F' },
  { label: 'Passport', value: 'M1234567' },
  { label: 'SSN', value: '***-**-6789' },
];

const FORMFORGE_URL = 'https://formforge.app/';

const emptyDraft: ProfileDraft = {
  name: '',
  emoji: '👤',
  subtitle: '',
  skills: '',
  focusAreas: '',
  experience: '',
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [profiles, setProfiles] = useState<ProfileModel[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState(initialProfiles[0].id);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['resume', 'stats', 'focus', 'kb', 'ai']),
  );

  // Derived
  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? profiles[0],
    [activeProfileId, profiles],
  );

  const formsFilled = 128;
  const aiResponses = 416;
  const timeSaved = '24h';

  // Actions
  const addActivity = (title: string) => {
    setActivity((prev) => [
      { id: `${Date.now()}`, title, time: 'Just now', date: 'Today' },
      ...prev.slice(0, 6),
    ]);
  };

  const selectProfile = (id: string) => {
    setActiveProfileId(id);
    setActiveTab('profileWorkspace');
    setWorkspaceTab('overview');
    addActivity(`Switched to ${profiles.find((p) => p.id === id)?.name ?? 'profile'}`);
  };

  const openWebsite = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: FORMFORGE_URL });
      return;
    }
    window.open(FORMFORGE_URL, '_blank', 'noopener,noreferrer');
  };

  const openCreateModal = () => {
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const openEditModal = (profile: ProfileModel) => {
    setDraft({
      id: profile.id,
      name: profile.name,
      emoji: profile.emoji,
      subtitle: profile.subtitle,
      skills: profile.skills.join(', '),
      focusAreas: profile.focusAreas.join(', '),
      experience: profile.experience,
    });
    setModalOpen(true);
  };

  const saveProfile = () => {
    const skills = draft.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const focusAreas = draft.focusAreas.split(',').map((s) => s.trim()).filter(Boolean);

    if (draft.id) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === draft.id
            ? { ...p, name: draft.name || p.name, emoji: draft.emoji || p.emoji, subtitle: draft.subtitle || p.subtitle, skills: skills.length ? skills : p.skills, focusAreas: focusAreas.length ? focusAreas : p.focusAreas, experience: draft.experience || p.experience }
            : p,
        ),
      );
      addActivity(`Updated ${draft.name}`);
    } else {
      const newProfile: ProfileModel = {
        id: `profile-${Date.now()}`,
        name: draft.name || 'New Profile',
        emoji: draft.emoji || '👤',
        subtitle: draft.subtitle || 'Custom profile',
        skills: skills.length ? skills : ['Custom'],
        focusAreas: focusAreas.length ? focusAreas : ['General'],
        projects: [],
        documents: [],
        knowledgeBase: KB_TEMPLATE,
        experience: draft.experience || '0 Years',
        lastUpdated: 'Just now',
        health: 20,
        missingFields: ['Resume', 'Portfolio', 'LinkedIn', 'GitHub', 'Cover Letter'],
      };
      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
      setActiveTab('profileWorkspace');
      addActivity(`Created ${newProfile.name}`);
    }
    setModalOpen(false);
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      addActivity('Cannot delete last profile');
      return;
    }
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activeProfileId === id) {
        setActiveProfileId(next[0].id);
        setActiveTab('home');
      }
      return next;
    });
    addActivity('Deleted profile');
  };

  const uploadDocument = () => {
    const doc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: `Uploaded_${Date.now()}.pdf`,
      category: 'Resume',
      updated: 'Just now',
    };
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, documents: [doc, ...p.documents] } : p)),
    );
    addActivity('Uploaded document');
  };

  const deleteDocument = (docId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId ? { ...p, documents: p.documents.filter((d) => d.id !== docId) } : p,
      ),
    );
    addActivity('Deleted document');
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleAiCommand = (cmd: string) => {
    addActivity(cmd);
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="ff-popup" data-theme={theme}>
      {/* HEADER */}
      <header className="ff-header">
        <div className="ff-brand">
          <div className="ff-logo" aria-hidden="true">F</div>
          <span className="ff-brand-name">FormForge</span>
        </div>
        <div className="ff-header-right">
          <span className="ff-sync-label">Synced just now</span>
          <button className="ff-header-btn" onClick={openWebsite} type="button">
            Dashboard <Icon name="external" />
          </button>
          <button
            className="ff-header-btn"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            type="button"
            title="Toggle theme"
          >
            <Icon name="theme" />
          </button>
          <div style={{ position: 'relative' }}>
            <button className="ff-avatar-btn" onClick={() => setUserMenuOpen((v) => !v)} type="button" title="User menu">
              <Icon name="persona" />
            </button>
            {userMenuOpen && (
              <div className="ff-user-menu">
                <button className="ff-menu-item" onClick={() => { openWebsite(); setUserMenuOpen(false); }} type="button">
                  <Icon name="external" /> Dashboard
                </button>
                <button className="ff-menu-item" onClick={() => { openWebsite(); setUserMenuOpen(false); }} type="button">
                  <Icon name="persona" /> Manage Account
                </button>
                <button className="ff-menu-item" onClick={() => { addActivity('Synced workspace'); setUserMenuOpen(false); }} type="button">
                  <Icon name="import" /> Sync Now
                </button>
                <div className="ff-menu-divider" />
                <button className="ff-menu-item" onClick={() => { openWebsite(); setUserMenuOpen(false); }} type="button">
                  <Icon name="globe" /> Website
                </button>
                <button className="ff-menu-item" onClick={() => setUserMenuOpen(false)} type="button">
                  <Icon name="back" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="ff-body">
        {/* SIDEBAR */}
        <aside className="ff-sidebar">
          <div className="ff-sidebar-section">
            <button
              className={`ff-nav-item ${activeTab === 'home' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('home')}
              type="button"
            >
              <Icon name="dashboard" /> Home
            </button>
          </div>

          <div className="ff-sidebar-divider" />

          <div className="ff-sidebar-section">
            <div className="ff-section-label">Profiles</div>
            {profiles.map((p) => (
              <button
                className={`ff-profile-row ${activeTab === 'profileWorkspace' && activeProfileId === p.id ? 'is-active' : ''}`}
                key={p.id}
                onClick={() => selectProfile(p.id)}
                type="button"
              >
                <span className="ff-profile-emoji">{p.emoji}</span>
                <span>{p.name}</span>
                <span className={`ff-profile-dot ${activeProfileId === p.id ? '' : 'is-inactive'}`} />
              </button>
            ))}
            <button className="ff-new-profile-btn" onClick={openCreateModal} type="button">
              <Icon name="plus" /> New Profile
            </button>
          </div>

          <div className="ff-sidebar-divider" />

          <div className="ff-sidebar-section">
            <button
              className={`ff-nav-item ${activeTab === 'vault' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('vault')}
              type="button"
            >
              <Icon name="shield" /> Vault
            </button>
            <button
              className={`ff-nav-item ${activeTab === 'analytics' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
              type="button"
            >
              <Icon name="analytics" /> Analytics
            </button>
            <button
              className={`ff-nav-item ${activeTab === 'settings' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('settings')}
              type="button"
            >
              <Icon name="settings" /> Settings
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ff-main" onClick={() => userMenuOpen && setUserMenuOpen(false)}>
          {profiles.length === 0 ? (
            <OnboardingScreen onCreate={openCreateModal} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeTab
                  activeProfile={activeProfile}
                  activity={activity}
                  formsFilled={formsFilled}
                  aiResponses={aiResponses}
                  timeSaved={timeSaved}
                  onSelectProfile={() => selectProfile(activeProfile.id)}
                  onFill={() => addActivity('Filled current form')}
                  onAnalyze={() => addActivity('Analyzed page')}
                  onGenerate={() => addActivity('Generated answers')}
                />
              )}
              {activeTab === 'profileWorkspace' && (
                <ProfileWorkspace
                  profile={activeProfile}
                  workspaceTab={workspaceTab}
                  onTabChange={setWorkspaceTab}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  onEdit={() => openEditModal(activeProfile)}
                  onDelete={() => deleteProfile(activeProfile.id)}
                  onUploadDoc={uploadDocument}
                  onDeleteDoc={deleteDocument}
                  onAiCommand={handleAiCommand}
                />
              )}
              {activeTab === 'vault' && (
                <VaultTab
                  unlocked={vaultUnlocked}
                  onToggle={() => {
                    setVaultUnlocked((v) => !v);
                    addActivity(vaultUnlocked ? 'Locked vault' : 'Unlocked vault');
                  }}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsTab
                  formsFilled={formsFilled}
                  responsesGenerated={aiResponses}
                  profileCount={profiles.length}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  theme={theme}
                  onThemeChange={(t) => { setTheme(t); addActivity(`Theme: ${t}`); }}
                  onOpenWebsite={openWebsite}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="ff-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="ff-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ff-modal-header">
              <span className="ff-modal-title">{draft.id ? 'Edit Profile' : 'Create Profile'}</span>
              <button className="ff-btn ff-btn-ghost ff-btn-sm" onClick={() => setModalOpen(false)} type="button">Close</button>
            </div>
            <div className="ff-modal-body">
              <div className="ff-field">
                <span className="ff-field-label">Emoji</span>
                <input value={draft.emoji} onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))} placeholder="👤" />
              </div>
              <div className="ff-field">
                <span className="ff-field-label">Name</span>
                <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="AI Engineer" />
              </div>
              <div className="ff-field">
                <span className="ff-field-label">Subtitle</span>
                <input value={draft.subtitle} onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))} placeholder="Applied AI · LLM Engineering" />
              </div>
              <div className="ff-field">
                <span className="ff-field-label">Skills (comma-separated)</span>
                <input value={draft.skills} onChange={(e) => setDraft((d) => ({ ...d, skills: e.target.value }))} placeholder="Python, React, Docker" />
              </div>
              <div className="ff-field">
                <span className="ff-field-label">Focus Areas (comma-separated)</span>
                <input value={draft.focusAreas} onChange={(e) => setDraft((d) => ({ ...d, focusAreas: e.target.value }))} placeholder="Generative AI, Backend" />
              </div>
              <div className="ff-field">
                <span className="ff-field-label">Experience</span>
                <input value={draft.experience} onChange={(e) => setDraft((d) => ({ ...d, experience: e.target.value }))} placeholder="2 Years" />
              </div>
              <div className="ff-form-actions">
                <button className="ff-btn" onClick={() => setModalOpen(false)} type="button">Cancel</button>
                <button className="ff-btn ff-btn-primary" onClick={saveProfile} type="button">
                  <Icon name="check" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   ONBOARDING
   ================================================================ */

const OnboardingScreen: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="ff-onboarding">
    <div className="ff-onboarding-icon"><Icon name="persona" /></div>
    <h2>Welcome to FormForge</h2>
    <p>No profiles found. Create your first profile to start autofilling applications with AI.</p>
    <div className="ff-onboarding-actions">
      <button className="ff-btn ff-btn-primary" onClick={onCreate} type="button">
        <Icon name="plus" /> Create Profile
      </button>
      <button className="ff-btn" type="button">
        <Icon name="upload" /> Import Resume
      </button>
    </div>
  </div>
);

/* ================================================================
   HOME TAB — THE LAUNCHPAD
   ================================================================ */

interface HomeTabProps {
  activeProfile: ProfileModel;
  activity: ActivityItem[];
  formsFilled: number;
  aiResponses: number;
  timeSaved: string;
  onSelectProfile: () => void;
  onFill: () => void;
  onAnalyze: () => void;
  onGenerate: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
  activeProfile, activity, formsFilled, aiResponses, timeSaved,
  onSelectProfile, onFill, onAnalyze, onGenerate,
}) => {
  const groupedActivity = useMemo(() => {
    const groups: { date: string; items: ActivityItem[] }[] = [];
    activity.forEach((item) => {
      const existing = groups.find((g) => g.date === item.date);
      if (existing) existing.items.push(item);
      else groups.push({ date: item.date, items: [item] });
    });
    return groups;
  }, [activity]);

  return (
    <div>
      <div className="ff-page-title">Home</div>

      {/* Ready to Fill Banner */}
      <div className="ff-fill-banner is-ready">
        <div className="ff-banner-status">
          <span className="ff-banner-dot" />
          Ready to Autofill
        </div>
        <div className="ff-banner-meta">
          <div className="ff-banner-row">
            <span>Website</span>
            <span>linkedin.com/jobs</span>
          </div>
          <div className="ff-banner-row">
            <span>Using</span>
            <span>{activeProfile.emoji} {activeProfile.name}</span>
          </div>
          <div className="ff-banner-row">
            <span>Fields detected</span>
            <span>12 fields</span>
          </div>
        </div>
        <div className="ff-banner-actions">
          <button className="ff-btn ff-btn-primary" onClick={onFill} type="button">
            <Icon name="check" /> Fill Form
          </button>
          <button className="ff-btn" onClick={onAnalyze} type="button">
            <Icon name="analyze" /> Analyze
          </button>
          <button className="ff-btn" onClick={onSelectProfile} type="button">
            Open Profile
          </button>
        </div>
      </div>

      {/* Current Profile */}
      <div className="ff-home-section">
        <div className="ff-home-section-title">Current Profile</div>
        <button className="ff-current-profile" onClick={onSelectProfile} type="button">
          <span className="ff-current-profile-emoji">{activeProfile.emoji}</span>
          <div className="ff-current-profile-info">
            <strong>{activeProfile.name}</strong>
            <span>{activeProfile.subtitle}</span>
          </div>
          <Badge tone="success">Active</Badge>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="ff-home-section">
        <div className="ff-home-section-title">Quick Actions</div>
        <div className="ff-quick-actions">
          <button className="ff-quick-action" onClick={onFill} type="button">
            <Icon name="check" /> Fill Form
          </button>
          <button className="ff-quick-action" onClick={onAnalyze} type="button">
            <Icon name="analyze" /> Analyze Page
          </button>
          <button className="ff-quick-action" onClick={onGenerate} type="button">
            <Icon name="zap" /> Generate
          </button>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="ff-home-section">
        <div className="ff-home-section-title">Today&apos;s Progress</div>
        <div className="ff-progress-grid">
          <div className="ff-progress-stat">
            <strong>{formsFilled}</strong>
            <span>Forms Filled</span>
          </div>
          <div className="ff-progress-stat">
            <strong>{aiResponses}</strong>
            <span>AI Responses</span>
          </div>
          <div className="ff-progress-stat">
            <strong>{timeSaved}</strong>
            <span>Time Saved</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="ff-home-section">
        <div className="ff-home-section-title">Recent Activity</div>
        {groupedActivity.map((group) => (
          <div key={group.date}>
            <div className="ff-activity-date">{group.date}</div>
            {group.items.map((item) => (
              <div className="ff-activity-item" key={item.id}>
                <span>{item.title}</span>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   PROFILE WORKSPACE
   ================================================================ */

interface ProfileWorkspaceProps {
  profile: ProfileModel;
  workspaceTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  expandedSections: Set<string>;
  onToggleSection: (key: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUploadDoc: () => void;
  onDeleteDoc: (id: string) => void;
  onAiCommand: (cmd: string) => void;
}

const ProfileWorkspace: React.FC<ProfileWorkspaceProps> = ({
  profile, workspaceTab, onTabChange, expandedSections, onToggleSection,
  onEdit, onDelete, onUploadDoc, onDeleteDoc, onAiCommand,
}) => {
  const tabs: { id: WorkspaceTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'documents', label: 'Documents' },
  ];

  const healthLabel = profile.health >= 80 ? 'Excellent' : profile.health >= 60 ? 'Good' : 'Needs Attention';
  const healthClass = profile.health >= 80 ? 'is-excellent' : profile.health >= 60 ? 'is-good' : 'is-needs-work';

  return (
    <div className="ff-workspace">
      {/* HERO */}
      <div className="ff-hero">
        <div className="ff-hero-top">
          <div>
            <div className="ff-hero-identity">
              <span className="ff-hero-emoji">{profile.emoji}</span>
              <span className="ff-hero-name">{profile.name}</span>
            </div>
            <div className="ff-hero-subtitle">{profile.subtitle}</div>
          </div>
          <div className="ff-hero-actions">
            <button className="ff-btn ff-btn-sm" onClick={onEdit} type="button">
              <Icon name="edit" /> Edit
            </button>
            <button className="ff-btn ff-btn-danger ff-btn-sm" onClick={onDelete} type="button">
              <Icon name="trash" />
            </button>
          </div>
        </div>
        <div className="ff-hero-meta">
          <span className={`ff-meta-badge is-active`}>
            <span className="ff-meta-dot" /> Active Profile
          </span>
          <span className="ff-meta-text">
            <Icon name="clock" /> Updated {profile.lastUpdated}
          </span>
          {profile.resume && (
            <span className="ff-meta-text">
              <Icon name="file" /> Resume Attached
            </span>
          )}
        </div>
      </div>

      {/* HEALTH */}
      <div className="ff-health">
        <div className="ff-health-header">
          <span className="ff-health-label">Profile Health</span>
          <span className={`ff-health-status ${healthClass}`}>
            {healthLabel} · {profile.health}%
          </span>
        </div>
        <div className="ff-health-bar-track">
          <div
            className={`ff-health-bar-fill ${healthClass}`}
            style={{ width: `${profile.health}%` }}
          />
        </div>
        {profile.missingFields.length > 0 && (
          <div className="ff-health-missing">
            <span style={{ background: 'transparent', color: 'var(--text-tertiary)', padding: 0 }}>Missing:</span>
            {profile.missingFields.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="ff-ws-tabs">
        {tabs.map((tab) => (
          <button
            className={`ff-ws-tab ${workspaceTab === tab.id ? 'is-active' : ''}`}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="ff-ws-content">
        {workspaceTab === 'overview' && (
          <OverviewPanel
            profile={profile}
            expanded={expandedSections}
            onToggle={onToggleSection}
            onAiCommand={onAiCommand}
          />
        )}
        {workspaceTab === 'skills' && <SkillsPanel skills={profile.skills} />}
        {workspaceTab === 'projects' && <ProjectsPanel projects={profile.projects} />}
        {workspaceTab === 'documents' && (
          <DocumentsPanel
            documents={profile.documents}
            onUpload={onUploadDoc}
            onDelete={onDeleteDoc}
          />
        )}
      </div>
    </div>
  );
};

/* ================================================================
   OVERVIEW PANEL
   ================================================================ */

interface OverviewPanelProps {
  profile: ProfileModel;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  onAiCommand: (cmd: string) => void;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ profile, expanded, onToggle, onAiCommand }) => {
  const aiCommands = [
    'Generate Cover Letter',
    'Generate Summary',
    'Explain Project',
    'Interview Response',
    'Optimize Resume',
  ];

  return (
    <>
      {/* Resume */}
      <CollapsibleSection title="Resume" sectionKey="resume" expanded={expanded} onToggle={onToggle}>
        {profile.resume ? (
          <div className="ff-resume-row">
            <div className="ff-resume-icon"><Icon name="file" /></div>
            <div className="ff-resume-info">
              <strong>{profile.resume.name}</strong>
              <span>Updated {profile.resume.updated}</span>
            </div>
          </div>
        ) : (
          <div className="ff-empty"><strong>No resume attached</strong><span>Upload a resume to get started</span></div>
        )}
      </CollapsibleSection>

      {/* Stats */}
      <CollapsibleSection title="Stats" sectionKey="stats" expanded={expanded} onToggle={onToggle}>
        <div className="ff-stats-grid">
          <div className="ff-stat-box"><strong>{profile.documents.length}</strong><span>Documents</span></div>
          <div className="ff-stat-box"><strong>{profile.projects.length}</strong><span>Projects</span></div>
          <div className="ff-stat-box"><strong>{profile.skills.length}</strong><span>Skills</span></div>
          <div className="ff-stat-box"><strong>{profile.experience}</strong><span>Experience</span></div>
        </div>
      </CollapsibleSection>

      {/* Focus Areas */}
      <CollapsibleSection title="Focus Areas" sectionKey="focus" expanded={expanded} onToggle={onToggle}>
        <div className="ff-tags">
          {profile.focusAreas.map((area) => (
            <span className="ff-tag" key={area}>{area}</span>
          ))}
        </div>
      </CollapsibleSection>

      {/* Recent Projects */}
      <CollapsibleSection title="Recent Projects" sectionKey="projects" expanded={expanded} onToggle={onToggle}>
        {profile.projects.slice(0, 3).map((project) => (
          <div className="ff-project-item" key={project.id}>
            <div>
              <div className="ff-project-name">{project.name}</div>
              <div className="ff-project-desc">{project.description}</div>
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* Knowledge Base */}
      <CollapsibleSection title="Knowledge Base" sectionKey="kb" expanded={expanded} onToggle={onToggle}>
        {profile.knowledgeBase.map((group) => (
          <div className="ff-kb-group" key={group.label}>
            <div className="ff-kb-group-label">{group.label}</div>
            {group.entries.map((entry) => (
              <div className="ff-kb-entry" key={entry.key}>
                <span>{entry.key}</span>
                {entry.value ? (
                  <span className="ff-kb-value">{entry.value}</span>
                ) : (
                  <Icon name="chevron-right" />
                )}
              </div>
            ))}
          </div>
        ))}
      </CollapsibleSection>

      {/* AI Commands */}
      <CollapsibleSection title="⚡ AI Commands" sectionKey="ai" expanded={expanded} onToggle={onToggle}>
        {aiCommands.map((cmd) => (
          <button className="ff-command-row" key={cmd} onClick={() => onAiCommand(cmd)} type="button">
            <span>{cmd}</span>
            <Icon name="chevron-right" />
          </button>
        ))}
      </CollapsibleSection>
    </>
  );
};

/* ================================================================
   COLLAPSIBLE SECTION
   ================================================================ */

interface CollapsibleSectionProps {
  title: string;
  sectionKey: string;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title, sectionKey, expanded, onToggle, children,
}) => {
  const isOpen = expanded.has(sectionKey);

  return (
    <div className="ff-section">
      <button className="ff-section-header" onClick={() => onToggle(sectionKey)} type="button">
        <span className="ff-section-title">{title}</span>
        <span className={`ff-section-toggle ${isOpen ? 'is-open' : 'is-closed'}`}>
          <Icon name="chevron-down" />
        </span>
      </button>
      {isOpen && <div className="ff-section-body">{children}</div>}
    </div>
  );
};

/* ================================================================
   SKILLS PANEL
   ================================================================ */

const SkillsPanel: React.FC<{ skills: string[] }> = ({ skills }) => (
  <div className="ff-skill-grid">
    {skills.map((skill) => (
      <span className="ff-tag" key={skill}>{skill}</span>
    ))}
    <button className="ff-add-inline" type="button">
      <Icon name="plus" /> Add Skill
    </button>
  </div>
);

/* ================================================================
   PROJECTS PANEL
   ================================================================ */

const ProjectsPanel: React.FC<{ projects: ProjectItem[] }> = ({ projects }) => (
  <div>
    {projects.length === 0 ? (
      <div className="ff-empty"><strong>No projects yet</strong><span>Add your first project</span></div>
    ) : (
      projects.map((project) => (
        <div className="ff-project-item" key={project.id}>
          <div>
            <div className="ff-project-name">{project.name}</div>
            <div className="ff-project-desc">{project.description}</div>
          </div>
          <button className="ff-icon-btn is-danger" type="button" title="Remove">
            <Icon name="trash" />
          </button>
        </div>
      ))
    )}
    <button className="ff-add-inline" type="button" style={{ marginTop: 10 }}>
      <Icon name="plus" /> Add Project
    </button>
  </div>
);

/* ================================================================
   DOCUMENTS PANEL
   ================================================================ */

interface DocumentsPanelProps {
  documents: DocumentItem[];
  onUpload: () => void;
  onDelete: (id: string) => void;
}

const DocumentsPanel: React.FC<DocumentsPanelProps> = ({ documents, onUpload, onDelete }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
      <button className="ff-btn ff-btn-primary ff-btn-sm" onClick={onUpload} type="button">
        <Icon name="upload" /> Upload
      </button>
    </div>
    {documents.length === 0 ? (
      <div className="ff-empty"><strong>No documents</strong><span>Upload your first document</span></div>
    ) : (
      documents.map((doc) => (
        <div className="ff-doc-item" key={doc.id}>
          <div className="ff-doc-info">
            <strong>{doc.name}</strong>
            <span>{doc.category} · {doc.updated}</span>
          </div>
          <div className="ff-doc-actions">
            <button className="ff-icon-btn" type="button" title="View"><Icon name="eye" /></button>
            <button className="ff-icon-btn is-danger" onClick={() => onDelete(doc.id)} type="button" title="Delete"><Icon name="trash" /></button>
          </div>
        </div>
      ))
    )}
  </div>
);

/* ================================================================
   VAULT TAB
   ================================================================ */

const VaultTab: React.FC<{ unlocked: boolean; onToggle: () => void }> = ({ unlocked, onToggle }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div className="ff-page-title" style={{ marginBottom: 0 }}>Vault</div>
      <button className="ff-btn ff-btn-primary ff-btn-sm" onClick={onToggle} type="button">
        <Icon name={unlocked ? 'shield' : 'unlock'} />
        {unlocked ? 'Lock' : 'Unlock'}
      </button>
    </div>
    <div className="ff-vault-grid">
      {vaultEntries.map((entry) => (
        <div className="ff-vault-item" key={entry.label}>
          <span className="ff-vault-item-label">{entry.label}</span>
          <span className={`ff-vault-item-value ${unlocked ? '' : 'is-locked'}`}>
            {unlocked ? entry.value : '••••••••'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ================================================================
   ANALYTICS TAB
   ================================================================ */

interface AnalyticsTabProps {
  formsFilled: number;
  responsesGenerated: number;
  profileCount: number;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ formsFilled, responsesGenerated, profileCount }) => {
  const metrics = [
    { label: 'Applications Filled', value: String(formsFilled), delta: '+12 this week' },
    { label: 'Time Saved', value: `${Math.round(formsFilled * 0.19)}h`, delta: 'Estimated from autofill' },
    { label: 'Profiles', value: String(profileCount), delta: 'Active profiles' },
    { label: 'AI Responses', value: String(responsesGenerated), delta: '+34 this week' },
  ];

  return (
    <div>
      <div className="ff-page-title">Analytics</div>
      <div className="ff-metric-grid">
        {metrics.map((m) => (
          <div className="ff-metric-card" key={m.label}>
            <div className="ff-metric-value">{m.value}</div>
            <div className="ff-metric-label">{m.label}</div>
            <div className="ff-metric-delta">{m.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   SETTINGS TAB
   ================================================================ */

interface SettingsTabProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  onOpenWebsite: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ theme, onThemeChange, onOpenWebsite }) => (
  <div>
    <div className="ff-page-title">Settings</div>

    <div className="ff-settings-group">
      <div className="ff-settings-group-title">Appearance</div>
      <div className="ff-setting-row">
        <div>
          <div className="ff-setting-label">Theme</div>
          <div className="ff-setting-desc">Toggle between light and dark mode</div>
        </div>
        <div className="ff-segmented">
          <button className={theme === 'light' ? 'is-active' : ''} onClick={() => onThemeChange('light')} type="button">Light</button>
          <button className={theme === 'dark' ? 'is-active' : ''} onClick={() => onThemeChange('dark')} type="button">Dark</button>
        </div>
      </div>
    </div>

    <div className="ff-settings-group">
      <div className="ff-settings-group-title">Account</div>
      <div className="ff-setting-row">
        <div>
          <div className="ff-setting-label">Dashboard</div>
          <div className="ff-setting-desc">Manage your account on formforge.app</div>
        </div>
        <button className="ff-btn ff-btn-sm" onClick={onOpenWebsite} type="button">
          Open <Icon name="external" />
        </button>
      </div>
      <div className="ff-setting-row">
        <div>
          <div className="ff-setting-label">Sync</div>
          <div className="ff-setting-desc">Profiles and documents sync automatically</div>
        </div>
        <span className="ff-badge ff-badge-success">Active</span>
      </div>
    </div>

    <div className="ff-settings-group">
      <div className="ff-settings-group-title">About</div>
      <div className="ff-setting-row">
        <div>
          <div className="ff-setting-label">FormForge</div>
          <div className="ff-setting-desc">Version 1.0.0</div>
        </div>
      </div>
    </div>
  </div>
);

export default Popup;
