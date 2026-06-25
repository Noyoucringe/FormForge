import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Badge from './components/Badge';
import Icon, { IconName } from './components/Icon';
import './popup.css';

/* ================================================================
   TYPES
   ================================================================ */

type TabId = 'home' | 'profileWorkspace' | 'vault' | 'analytics' | 'settings';
type WorkspaceTab = 'overview' | 'skills' | 'projects' | 'documents';
type ThemeMode = 'light' | 'dark';

interface KnowledgeBaseEntry { key: string; value: string; }
interface KnowledgeBaseGroup { label: string; entries: KnowledgeBaseEntry[]; }
interface ProjectItem { id: string; name: string; description: string; }
interface DocumentItem { id: string; name: string; category: string; updated: string; }
interface ActivityItem { id: string; title: string; time: string; date: string; }

interface ProfileModel {
  id: string;
  name: string;
  icon: IconName;
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
  icon: IconName;
  subtitle: string;
  skills: string;
  focusAreas: string;
  experience: string;
}

/* ================================================================
   CONSTANTS & DEFAULT TEMPLATES
   ================================================================ */

const ICON_OPTIONS: IconName[] = ['spark', 'code', 'flask', 'brain', 'briefcase', 'award', 'globe', 'bulb'];

const KB_TEMPLATE: KnowledgeBaseGroup[] = [
  {
    label: 'Personal',
    entries: [
      { key: 'Full Name', value: '' },
      { key: 'Email', value: '' },
      { key: 'Phone', value: '' },
      { key: 'GitHub', value: '' },
      { key: 'LinkedIn', value: '' },
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
    icon: 'spark',
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
          { key: 'Full Name', value: 'Alex Mercer' },
          { key: 'Email', value: 'alex.mercer@formforge.ai' },
          { key: 'Phone', value: '+1 (555) 019-2834' },
          { key: 'GitHub', value: 'github.com/alexmercer-ai' },
          { key: 'LinkedIn', value: 'linkedin.com/in/alexmercer-ai' },
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
    icon: 'code',
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
    knowledgeBase: [
      {
        label: 'Personal',
        entries: [
          { key: 'Full Name', value: 'Jordan Vance' },
          { key: 'Email', value: 'jordan.vance@formforge.ai' },
          { key: 'Phone', value: '+1 (555) 014-9876' },
          { key: 'GitHub', value: 'github.com/jordanvance' },
          { key: 'LinkedIn', value: 'linkedin.com/in/jordanvance' },
          { key: 'About Me', value: 'Full stack engineer focused on scalable cloud systems' },
          { key: 'Career Objective', value: 'Build user-first developer tooling and platforms' },
        ],
      },
      {
        label: 'Professional',
        entries: [
          { key: 'Leadership', value: 'Mentored 2 junior engineers, architecture lead' },
          { key: 'Achievements', value: 'Optimized DB queries to save 40% compute costs' },
          { key: 'Open Source', value: 'Contributor to Prisma and Next.js ecosystem' },
        ],
      },
      {
        label: 'Interview',
        entries: [
          { key: 'Strengths', value: 'System design, web performance, database optimization' },
          { key: 'Weaknesses', value: 'Occasionally over-engineering simple solutions' },
          { key: 'Preferred Stack', value: 'TypeScript, React, Next.js, Node.js, AWS, Postgres' },
        ],
      },
    ],
    resume: { name: 'SWE_Resume.pdf', updated: 'Today' },
    experience: '3 Years',
    lastUpdated: '1 day ago',
    health: 64,
    missingFields: ['Portfolio', 'GitHub', 'Cover Letter', 'About Me'],
  },
  {
    id: 'research',
    name: 'Research',
    icon: 'flask',
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
    knowledgeBase: [
      {
        label: 'Personal',
        entries: [
          { key: 'Full Name', value: 'Dr. Taylor Thorne' },
          { key: 'Email', value: 'taylor.thorne@formforge.ai' },
          { key: 'Phone', value: '+1 (555) 012-3456' },
          { key: 'GitHub', value: 'github.com/tthorne-research' },
          { key: 'LinkedIn', value: 'linkedin.com/in/taylor-thorne-phd' },
          { key: 'About Me', value: 'Researcher specializing in attention models and statistical learning theory' },
          { key: 'Career Objective', value: 'Advance state-of-the-art architectures in foundation models' },
        ],
      },
      {
        label: 'Professional',
        entries: [
          { key: 'Leadership', value: 'Principal investigator on a $100K research grant' },
          { key: 'Achievements', value: 'Published 4 papers at NeurIPS/ICML' },
          { key: 'Open Source', value: 'Maintainer of PyTorch attention evaluation scripts' },
        ],
      },
      {
        label: 'Interview',
        entries: [
          { key: 'Strengths', value: 'Mathematical modeling, experimental design, paper writing' },
          { key: 'Weaknesses', value: 'Less experience with production front-end code' },
          { key: 'Preferred Stack', value: 'Python, PyTorch, LaTeX, R, Jupyter' },
        ],
      },
    ],
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
const emptyDraft: ProfileDraft = { name: '', icon: 'brain', subtitle: '', skills: '', focusAreas: '', experience: '' };

/* ================================================================
   DATA STRUCTURE MAPPER
   ================================================================ */

const mapProfileModelToProfile = (pm: ProfileModel): any => {
  const findKbValue = (groupLabel: string, key: string): string => {
    const group = pm.knowledgeBase.find((g) => g.label === groupLabel);
    const entry = group?.entries.find((e) => e.key === key);
    return entry?.value || '';
  };

  const workExperience = pm.projects.map((p, idx) => ({
    company: p.name,
    position: 'Developer',
    years: idx === 0 ? 2 : 1,
  }));

  const education = [
    { institution: 'Stanford University', degree: 'MS', field: 'Computer Science', year: 2022 },
  ];

  return {
    id: pm.id,
    name: pm.name,
    type: pm.id === 'ai-engineer' ? 'AI' : pm.id === 'software-engineer' ? 'SWE' : pm.id === 'research' ? 'Research' : 'Custom',
    data: {
      fullName: findKbValue('Personal', 'Full Name'),
      email: findKbValue('Personal', 'Email'),
      phone: findKbValue('Personal', 'Phone'),
      linkedin: findKbValue('Personal', 'LinkedIn'),
      github: findKbValue('Personal', 'GitHub'),
      skills: pm.skills,
      education,
      experience: workExperience,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

const Popup: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['resume', 'stats', 'focus', 'kb', 'ai']));
  const [toast, setToast] = useState<string | null>(null);
  
  // Real detection states
  const [formDetected, setFormDetected] = useState(false);
  const [detectedFields, setDetectedFields] = useState<any[]>([]);

  const [formsFilled, setFormsFilled] = useState(128);
  const [aiResponses, setAiResponses] = useState(7);

  // Sync helpers
  const saveProfilesToStorage = (updatedProfiles: ProfileModel[]) => {
    setProfiles(updatedProfiles);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ 'formforge_profiles_v2': updatedProfiles });
    }
  };

  const saveActiveProfileIdToStorage = (id: string) => {
    setActiveProfileId(id);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ 'formforge_active_profile_id_v2': id });
    }
  };

  const saveActivityToStorage = (updatedActivity: ActivityItem[]) => {
    setActivity(updatedActivity);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ 'formforge_activity_v2': updatedActivity });
    }
  };

  const saveThemeToStorage = (updatedTheme: ThemeMode) => {
    setTheme(updatedTheme);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ 'formforge_theme_v2': updatedTheme });
    }
  };

  // Toast helper
  const showToast = useCallback((msg: string) => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addActivity = useCallback((title: string) => {
    const updated = [
      { id: `${Date.now()}`, title, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: 'Today' },
      ...activity.slice(0, 8),
    ];
    saveActivityToStorage(updated);
  }, [activity]);

  // Load from Storage + Auto-Migration
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(
        ['formforge_profiles_v2', 'formforge_active_profile_id_v2', 'formforge_activity_v2', 'formforge_theme_v2'],
        (result) => {
          let loadedProfiles = result.formforge_profiles_v2;
          let loadedActiveId = result.formforge_active_profile_id_v2;
          let loadedActivity = result.formforge_activity_v2;
          let loadedTheme = result.formforge_theme_v2;

          if (!loadedProfiles) {
            // Check legacy key for migration
            chrome.storage.local.get(['formforge_profiles'], (legacy) => {
              if (legacy.formforge_profiles && legacy.formforge_profiles.length > 0) {
                const migrated: ProfileModel[] = legacy.formforge_profiles.map((p: any) => {
                  const legacySkills = p.data?.skills || [];
                  const legacyExp = p.data?.experience || [];
                  return {
                    id: p.id || `profile-${Date.now()}`,
                    name: p.name || 'Migrated Profile',
                    icon: p.type === 'AI' ? 'spark' : p.type === 'SWE' ? 'code' : p.type === 'Research' ? 'flask' : 'brain',
                    subtitle: p.type || 'Custom Profile',
                    skills: legacySkills,
                    focusAreas: p.type === 'AI' ? ['Machine Learning', 'AI'] : p.type === 'SWE' ? ['Software Engineering'] : ['Research'],
                    projects: legacyExp.map((e: any, idx: number) => ({
                      id: `p-${idx}-${Date.now()}`,
                      name: e.company || 'Company',
                      description: `${e.position || 'Developer'} (${e.years || 1} years)`,
                    })),
                    documents: [],
                    knowledgeBase: [
                      {
                        label: 'Personal',
                        entries: [
                          { key: 'Full Name', value: p.data?.fullName || '' },
                          { key: 'Email', value: p.data?.email || '' },
                          { key: 'Phone', value: p.data?.phone || '' },
                          { key: 'GitHub', value: p.data?.github || '' },
                          { key: 'LinkedIn', value: p.data?.linkedin || '' },
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
                    ],
                    experience: legacyExp.length > 0 ? `${legacyExp[0].years} Years` : '1 Year',
                    lastUpdated: 'Migrated just now',
                    health: 60,
                    missingFields: ['Resume', 'Portfolio'],
                  };
                });
                saveProfilesToStorage(migrated);
                if (migrated.length > 0) {
                  saveActiveProfileIdToStorage(migrated[0].id);
                }
                chrome.storage.local.remove(['formforge_profiles']);
              } else {
                // Initialize default profiles
                saveProfilesToStorage(initialProfiles);
                saveActiveProfileIdToStorage(initialProfiles[0].id);
              }
            });
          } else {
            setProfiles(loadedProfiles);
            if (loadedActiveId) {
              setActiveProfileId(loadedActiveId);
            } else if (loadedProfiles.length > 0) {
              setActiveProfileId(loadedProfiles[0].id);
            }
          }

          if (loadedActivity) setActivity(loadedActivity);
          if (loadedTheme) setTheme(loadedTheme);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Real field detection on load
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const tabId = activeTab?.id;
        if (tabId !== undefined) {
          chrome.tabs.sendMessage(tabId, { type: 'DETECT_FIELDS' }, (response) => {
            if (chrome.runtime.lastError) {
              setFormDetected(false);
              return;
            }
            if (response && response.fields && response.fields.length > 0) {
              setDetectedFields(response.fields);
              setFormDetected(true);
            } else {
              setFormDetected(false);
            }
          });
        }
      });
    }
  }, []);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || profiles[0] || initialProfiles[0],
    [activeProfileId, profiles],
  );

  const selectProfile = (id: string) => {
    saveActiveProfileIdToStorage(id);
    setActiveTab('profileWorkspace');
    setWorkspaceTab('overview');
  };

  const openWebsite = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: FORMFORGE_URL });
      return;
    }
    window.open(FORMFORGE_URL, '_blank', 'noopener,noreferrer');
  };

  const openCreateModal = () => { setDraft(emptyDraft); setModalOpen(true); };

  const openEditModal = (p: ProfileModel) => {
    setDraft({
      id: p.id,
      name: p.name,
      icon: p.icon,
      subtitle: p.subtitle,
      skills: p.skills.join(', '),
      focusAreas: p.focusAreas.join(', '),
      experience: p.experience,
    });
    setModalOpen(true);
  };

  const saveProfile = () => {
    const skills = draft.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const focusAreas = draft.focusAreas.split(',').map((s) => s.trim()).filter(Boolean);
    if (draft.id) {
      const updated = profiles.map((p) =>
        p.id === draft.id
          ? {
              ...p,
              name: draft.name || p.name,
              icon: draft.icon,
              subtitle: draft.subtitle || p.subtitle,
              skills: skills.length ? skills : p.skills,
              focusAreas: focusAreas.length ? focusAreas : p.focusAreas,
              experience: draft.experience || p.experience,
              lastUpdated: 'Just now',
            }
          : p
      );
      saveProfilesToStorage(updated);
      showToast(`Updated ${draft.name}`);
      addActivity(`Updated ${draft.name}`);
    } else {
      const np: ProfileModel = {
        id: `profile-${Date.now()}`,
        name: draft.name || 'New Profile',
        icon: draft.icon || 'brain',
        subtitle: draft.subtitle || 'Custom profile',
        skills: skills.length ? skills : ['Custom'],
        focusAreas: focusAreas.length ? focusAreas : ['General'],
        projects: [],
        documents: [],
        knowledgeBase: KB_TEMPLATE.map((g) => ({ ...g, entries: g.entries.map((e) => ({ ...e })) })),
        experience: draft.experience || '0 Years',
        lastUpdated: 'Just now',
        health: 20,
        missingFields: ['Resume', 'Portfolio', 'LinkedIn', 'GitHub', 'Cover Letter'],
      };
      const updated = [...profiles, np];
      saveProfilesToStorage(updated);
      saveActiveProfileIdToStorage(np.id);
      setActiveTab('profileWorkspace');
      showToast(`Created ${np.name}`);
      addActivity(`Created ${np.name}`);
    }
    setModalOpen(false);
  };

  const deleteProfile = (id: string) => {
    const name = profiles.find((p) => p.id === id)?.name;
    const nextProfiles = profiles.filter((p) => p.id !== id);
    saveProfilesToStorage(nextProfiles);

    if (nextProfiles.length > 0) {
      if (activeProfileId === id) {
        saveActiveProfileIdToStorage(nextProfiles[0].id);
        setActiveTab('home');
      }
    } else {
      saveActiveProfileIdToStorage('');
      setActiveTab('home');
    }
    showToast(`Deleted ${name}`);
    addActivity(`Deleted ${name}`);
  };

  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    const updated = profiles.map((p) =>
      p.id === activeProfileId ? { ...p, skills: [...p.skills, skill.trim()] } : p
    );
    saveProfilesToStorage(updated);
    showToast(`Added "${skill.trim()}"`);
    addActivity(`Added skill: ${skill.trim()}`);
  };

  const removeSkill = (skill: string) => {
    const updated = profiles.map((p) =>
      p.id === activeProfileId ? { ...p, skills: p.skills.filter((s) => s !== skill) } : p
    );
    saveProfilesToStorage(updated);
    addActivity(`Removed skill: ${skill}`);
  };

  const addProject = (name: string, desc: string) => {
    if (!name.trim()) return;
    const updated = profiles.map((p) =>
      p.id === activeProfileId
        ? {
            ...p,
            projects: [...p.projects, { id: `p-${Date.now()}`, name: name.trim(), description: desc.trim() }],
          }
        : p
    );
    saveProfilesToStorage(updated);
    showToast(`Added "${name.trim()}"`);
    addActivity(`Added project: ${name.trim()}`);
  };

  const removeProject = (pid: string) => {
    const updated = profiles.map((p) =>
      p.id === activeProfileId ? { ...p, projects: p.projects.filter((pr) => pr.id !== pid) } : p
    );
    saveProfilesToStorage(updated);
    addActivity('Removed project');
  };

  const uploadDocument = () => {
    const docName = `Document_${activeProfile.documents.length + 1}.pdf`;
    const doc: DocumentItem = { id: `doc-${Date.now()}`, name: docName, category: 'Resume', updated: 'Just now' };
    const updated = profiles.map((p) =>
      p.id === activeProfileId
        ? {
            ...p,
            documents: [doc, ...p.documents],
            resume: doc.category === 'Resume' ? { name: doc.name, updated: 'Just now' } : p.resume,
          }
        : p
    );
    saveProfilesToStorage(updated);
    showToast('Document uploaded');
    addActivity(`Uploaded ${doc.name}`);
  };

  const deleteDocument = (docId: string) => {
    const updated = profiles.map((p) => {
      if (p.id !== activeProfileId) return p;
      const nextDocs = p.documents.filter((d) => d.id !== docId);
      const hasResume = nextDocs.some((d) => d.category === 'Resume');
      return {
        ...p,
        documents: nextDocs,
        resume: hasResume ? p.resume : undefined,
      };
    });
    saveProfilesToStorage(updated);
    addActivity('Deleted document');
  };

  const updateKbEntry = (groupLabel: string, key: string, value: string) => {
    const updated = profiles.map((p) =>
      p.id === activeProfileId
        ? {
            ...p,
            knowledgeBase: p.knowledgeBase.map((g) =>
              g.label === groupLabel
                ? { ...g, entries: g.entries.map((e) => (e.key === key ? { ...e, value } : e)) }
                : g
            ),
          }
        : p
    );
    saveProfilesToStorage(updated);
    showToast(`Saved "${key}"`);
    addActivity(`Updated ${key}`);
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  const handleAiCommand = (cmd: string) => {
    setAiResponses((n) => n + 1);
    showToast(`${cmd} — generated`);
    addActivity(`⚡ AI Command: ${cmd}`);
  };

  // Real autofill message dispatcher
  const handleFill = () => {
    const profilePayload = mapProfileModelToProfile(activeProfile);
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const tabId = activeTab?.id;
        if (tabId !== undefined) {
          // Re-detect fields to ensure up-to-date inputs
          chrome.tabs.sendMessage(tabId, { type: 'DETECT_FIELDS' }, (detectResponse) => {
            if (chrome.runtime.lastError) {
              showToast('Error: Content script not loaded');
              return;
            }
            const fields = detectResponse?.fields || [];
            if (fields.length === 0) {
              showToast('No form fields detected');
              return;
            }
            setDetectedFields(fields);
            setFormDetected(true);

            // Trigger actual form filling
            chrome.tabs.sendMessage(
              tabId,
              {
                type: 'AUTOFILL_FORM',
                payload: {
                  fields,
                  profile: profilePayload,
                },
              },
              (fillResponse) => {
                if (fillResponse && fillResponse.success) {
                  setFormsFilled((n) => n + 1);
                  showToast('Form filled successfully');
                  addActivity(`Filled form on page using ${activeProfile.name}`);
                } else {
                  showToast('Autofill failed: ' + (fillResponse?.error || 'Unknown error'));
                }
              }
            );
          });
        }
      });
    } else {
      // Mock for local dev
      setFormsFilled((n) => n + 1);
      showToast('Form filled successfully (mock)');
      addActivity(`Filled form with ${activeProfile.name}`);
    }
  };

  // Real page analysis dispatcher
  const handleAnalyze = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const tabId = activeTab?.id;
        if (tabId !== undefined) {
          chrome.tabs.sendMessage(tabId, { type: 'DETECT_FIELDS' }, (response) => {
            if (chrome.runtime.lastError) {
              showToast('Error: Content script not loaded');
              return;
            }
            if (response && response.fields && response.fields.length > 0) {
              setDetectedFields(response.fields);
              setFormDetected(true);
              showToast(`Detected ${response.fields.length} form fields`);
              addActivity(`Detected ${response.fields.length} fields on page`);
            } else {
              setFormDetected(false);
              showToast('No form fields detected');
              addActivity('No form fields detected on page');
            }
          });
        }
      });
    } else {
      // Mock for local dev
      showToast('No form fields detected (mock)');
      addActivity('Analyzed current page');
    }
  };

  const handleGenerate = () => {
    setAiResponses((n) => n + 1);
    showToast('AI Answers generated');
    addActivity('Generated AI answers for form');
  };

  if (loading) {
    return (
      <div className="ff-popup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="ff-logo" style={{ width: 44, height: 44, fontSize: 20 }}>F</div>
          <div style={{ color: '#fafafa', fontSize: 13, fontWeight: 600 }}>Loading FormForge...</div>
        </div>
      </div>
    );
  }

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
          <button className="ff-header-btn" onClick={openWebsite} type="button">Open Dashboard <Icon name="external" /></button>
          <button className="ff-header-btn" onClick={() => saveThemeToStorage(theme === 'dark' ? 'light' : 'dark')} type="button" title="Toggle theme"><Icon name="theme" /></button>
          <div style={{ position: 'relative' }}>
            <button className="ff-avatar-btn" onClick={() => setUserMenuOpen((v) => !v)} type="button" title="Menu"><Icon name="persona" /></button>
            {userMenuOpen && (
              <div className="ff-user-menu">
                <button className="ff-menu-item" onClick={() => { openWebsite(); setUserMenuOpen(false); }} type="button"><Icon name="external" /> Dashboard</button>
                <button className="ff-menu-item" onClick={() => { openWebsite(); setUserMenuOpen(false); }} type="button"><Icon name="persona" /> Manage Account</button>
                <button className="ff-menu-item" onClick={() => { addActivity('Synced workspace'); showToast('Synced'); setUserMenuOpen(false); }} type="button"><Icon name="import" /> Sync Now</button>
                <div className="ff-menu-divider" />
                <button className="ff-menu-item" onClick={() => { openWebsite(); setUserMenuOpen(false); }} type="button"><Icon name="globe" /> Website</button>
                <button className="ff-menu-item" onClick={() => setUserMenuOpen(false)} type="button"><Icon name="back" /> Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="ff-body">
        {/* SIDEBAR */}
        <aside className="ff-sidebar">
          <div className="ff-sidebar-section">
            <button className={`ff-nav-item ${activeTab === 'home' ? 'is-active' : ''}`} onClick={() => setActiveTab('home')} type="button"><Icon name="dashboard" /> Home</button>
          </div>
          <div className="ff-sidebar-divider" />
          <div className="ff-sidebar-section">
            <div className="ff-section-label">Profiles</div>
            {profiles.map((p) => (
              <button className={`ff-profile-row ${activeTab === 'profileWorkspace' && activeProfileId === p.id ? 'is-active' : ''}`} key={p.id} onClick={() => selectProfile(p.id)} type="button">
                <div className="ff-profile-icon"><Icon name={p.icon} /></div>
                <span>{p.name}</span>
                <span className={`ff-profile-dot ${activeProfileId === p.id ? '' : 'is-inactive'}`} />
              </button>
            ))}
            <button className="ff-new-profile-btn" onClick={openCreateModal} type="button"><Icon name="plus" /> New Profile</button>
          </div>
          <div className="ff-sidebar-divider" />
          <div className="ff-sidebar-section">
            <button className={`ff-nav-item ${activeTab === 'vault' ? 'is-active' : ''}`} onClick={() => setActiveTab('vault')} type="button"><Icon name="shield" /> Vault</button>
            <button className={`ff-nav-item ${activeTab === 'analytics' ? 'is-active' : ''}`} onClick={() => setActiveTab('analytics')} type="button"><Icon name="analytics" /> Analytics</button>
            <button className={`ff-nav-item ${activeTab === 'settings' ? 'is-active' : ''}`} onClick={() => setActiveTab('settings')} type="button"><Icon name="settings" /> Settings</button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="ff-main" onClick={() => userMenuOpen && setUserMenuOpen(false)}>
          {profiles.length === 0 ? <OnboardingScreen onCreate={openCreateModal} /> : <>
            {activeTab === 'home' && <HomeTab profile={activeProfile} activity={activity} formsFilled={formsFilled} aiResponses={aiResponses} formDetected={formDetected} onSelect={() => selectProfile(activeProfile.id)} onFill={handleFill} onAnalyze={handleAnalyze} onGenerate={handleGenerate} />}
            {activeTab === 'profileWorkspace' && <ProfileWorkspace profile={activeProfile} wsTab={workspaceTab} onWsTab={setWorkspaceTab} expanded={expandedSections} onToggle={toggleSection} onEdit={() => openEditModal(activeProfile)} onDelete={() => deleteProfile(activeProfile.id)} onAddSkill={addSkill} onRemoveSkill={removeSkill} onAddProject={addProject} onRemoveProject={removeProject} onUploadDoc={uploadDocument} onDeleteDoc={deleteDocument} onUpdateKb={updateKbEntry} onAiCommand={handleAiCommand} />}
            {activeTab === 'vault' && <VaultTab unlocked={vaultUnlocked} onToggle={() => { setVaultUnlocked((v) => !v); showToast(vaultUnlocked ? 'Vault locked' : 'Vault unlocked'); addActivity(vaultUnlocked ? 'Locked vault' : 'Unlocked vault'); }} />}
            {activeTab === 'analytics' && <AnalyticsTab formsFilled={formsFilled} aiResponses={aiResponses} profileCount={profiles.length} />}
            {activeTab === 'settings' && <SettingsTab theme={theme} onThemeChange={(t) => { saveThemeToStorage(t); addActivity(`Theme: ${t}`); }} onOpenWebsite={openWebsite} />}
          </>}
        </main>
      </div>

      {/* FLOATING ACTION FILL BUTTON */}
      {formDetected && activeTab === 'home' && (
        <div className="ff-float-fill"><button onClick={handleFill} type="button"><Icon name="zap" /> Fill Form</button></div>
      )}

      {/* TOAST SYSTEM */}
      {toast && <div className="ff-toast" key={toast}>{toast}</div>}

      {/* MODAL - CREATE/EDIT PROFILE */}
      {modalOpen && (
        <div className="ff-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="ff-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ff-modal-header">
              <span className="ff-modal-title">{draft.id ? 'Edit Profile' : 'Create Profile'}</span>
              <button className="ff-btn ff-btn-ghost ff-btn-sm" onClick={() => setModalOpen(false)} type="button">Close</button>
            </div>
            <div className="ff-modal-body">
              <div className="ff-field">
                <span className="ff-field-label">Icon</span>
                <div className="ff-icon-picker">
                  {ICON_OPTIONS.map((ic) => (
                    <button key={ic} className={`ff-icon-option ${draft.icon === ic ? 'is-selected' : ''}`} onClick={() => setDraft((d) => ({ ...d, icon: ic }))} type="button"><Icon name={ic} /></button>
                  ))}
                </div>
              </div>
              <div className="ff-field"><span className="ff-field-label">Name</span><input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="AI Engineer" /></div>
              <div className="ff-field"><span className="ff-field-label">Subtitle</span><input value={draft.subtitle} onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))} placeholder="Applied AI · LLM Engineering" /></div>
              <div className="ff-field"><span className="ff-field-label">Skills (comma-separated)</span><input value={draft.skills} onChange={(e) => setDraft((d) => ({ ...d, skills: e.target.value }))} placeholder="Python, React, Docker" /></div>
              <div className="ff-field"><span className="ff-field-label">Focus Areas (comma-separated)</span><input value={draft.focusAreas} onChange={(e) => setDraft((d) => ({ ...d, focusAreas: e.target.value }))} placeholder="Generative AI, Backend" /></div>
              <div className="ff-field"><span className="ff-field-label">Experience</span><input value={draft.experience} onChange={(e) => setDraft((d) => ({ ...d, experience: e.target.value }))} placeholder="2 Years" /></div>
              <div className="ff-form-actions">
                <button className="ff-btn" onClick={() => setModalOpen(false)} type="button">Cancel</button>
                <button className="ff-btn ff-btn-primary" onClick={saveProfile} type="button"><Icon name="check" /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   ONBOARDING SCREEN
   ================================================================ */

const OnboardingScreen: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="ff-onboarding">
    <div className="ff-onboarding-icon"><Icon name="persona" /></div>
    <h2>Welcome to FormForge</h2>
    <p>Create your first profile to start autofilling applications with AI.</p>
    <div className="ff-onboarding-actions">
      <button className="ff-btn ff-btn-primary" onClick={onCreate} type="button"><Icon name="plus" /> Create Profile</button>
      <button className="ff-btn" type="button"><Icon name="upload" /> Import Resume</button>
    </div>
  </div>
);

/* ================================================================
   HOME TAB (LAUNCHPAD)
   ================================================================ */

interface HomeTabProps {
  profile: ProfileModel; activity: ActivityItem[];
  formsFilled: number; aiResponses: number; formDetected: boolean;
  onSelect: () => void; onFill: () => void; onAnalyze: () => void; onGenerate: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ profile, activity, formsFilled, aiResponses, formDetected, onSelect, onFill, onAnalyze, onGenerate }) => {
  const grouped = useMemo(() => {
    const g: { date: string; items: ActivityItem[] }[] = [];
    activity.forEach((i) => {
      const e = g.find((x) => x.date === i.date);
      if (e) e.items.push(i);
      else g.push({ date: i.date, items: [i] });
    });
    return g;
  }, [activity]);

  return (
    <div>
      <div className="ff-page-title">Home</div>

      {formDetected ? (
        <div className="ff-fill-banner is-ready">
          <div className="ff-banner-label">✦ Application Ready</div>
          <div className="ff-banner-title">Job Application Form Detected</div>
          <div className="ff-banner-meta">
            <div className="ff-banner-row"><span>Using active profile</span><span>{profile.name}</span></div>
            <div className="ff-banner-row"><span>Status</span><span style={{ color: 'var(--success)' }}>Ready to fill fields</span></div>
          </div>
          <div className="ff-banner-actions">
            <button className="ff-btn ff-btn-primary" onClick={onFill} type="button"><Icon name="zap" /> Fill Form</button>
            <button className="ff-btn" onClick={onAnalyze} type="button"><Icon name="analyze" /> Re-Analyze</button>
            <button className="ff-btn" onClick={onSelect} type="button">Open Profile</button>
          </div>
        </div>
      ) : (
        <div className="ff-no-form">
          <strong>No active application form detected</strong>
          <span>Navigate to an application page or click Analyze to inspect current page.</span>
        </div>
      )}

      <div className="ff-home-section">
        <div className="ff-home-section-title">Current Profile</div>
        <button className="ff-current-profile" onClick={onSelect} type="button">
          <div className="ff-profile-icon"><Icon name={profile.icon} /></div>
          <div className="ff-current-profile-info"><strong>{profile.name}</strong><span>{profile.subtitle}</span></div>
          <Badge tone="success">Active</Badge>
        </button>
      </div>

      <div className="ff-home-section">
        <div className="ff-home-section-title">Quick Actions</div>
        <div className="ff-qa-list">
          <button className="ff-qa-item" onClick={onFill} type="button">
            <div className="ff-qa-icon"><Icon name="zap" /></div>
            <div className="ff-qa-content"><strong>⚡ Fill Form</strong><span>Automatically populate detected fields</span></div>
          </button>
          <button className="ff-qa-item" onClick={onAnalyze} type="button">
            <div className="ff-qa-icon"><Icon name="brain" /></div>
            <div className="ff-qa-content"><strong>🧠 Analyze Page</strong><span>Inspect application fields and structure</span></div>
          </button>
          <button className="ff-qa-item" onClick={onGenerate} type="button">
            <div className="ff-qa-icon"><Icon name="spark" /></div>
            <div className="ff-qa-content"><strong>✍ Generate Answers</strong><span>AI-powered responses from your profile</span></div>
          </button>
        </div>
      </div>

      <div className="ff-home-section">
        <div className="ff-home-section-title">Today's Progress</div>
        <div className="ff-progress-grid">
          <div className="ff-progress-stat"><strong>{formsFilled}</strong><div className="ff-stat-label">Forms Filled</div><div className="ff-stat-delta">+7 today</div></div>
          <div className="ff-progress-stat"><strong>{aiResponses}</strong><div className="ff-stat-label">AI Responses</div><div className="ff-stat-delta">+{aiResponses} today</div></div>
          <div className="ff-progress-stat"><strong>41m</strong><div className="ff-stat-label">Time Saved</div><div className="ff-stat-delta">This session</div></div>
        </div>
      </div>

      <div className="ff-home-section">
        <div className="ff-home-section-title">Recent Activity</div>
        {grouped.map((g) => (
          <div key={g.date}>
            <div className="ff-activity-date">{g.date}</div>
            {g.items.map((i) => (<div className="ff-activity-item" key={i.id}><span>{i.title}</span><span>{i.time}</span></div>))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   PROFILE WORKSPACE
   ================================================================ */

interface WorkspaceProps {
  profile: ProfileModel; wsTab: WorkspaceTab; onWsTab: (t: WorkspaceTab) => void;
  expanded: Set<string>; onToggle: (k: string) => void;
  onEdit: () => void; onDelete: () => void;
  onAddSkill: (s: string) => void; onRemoveSkill: (s: string) => void;
  onAddProject: (n: string, d: string) => void; onRemoveProject: (id: string) => void;
  onUploadDoc: () => void; onDeleteDoc: (id: string) => void;
  onUpdateKb: (group: string, key: string, val: string) => void;
  onAiCommand: (cmd: string) => void;
}

const ProfileWorkspace: React.FC<WorkspaceProps> = (props) => {
  const { profile, wsTab, onWsTab, onEdit, onDelete } = props;
  const tabs: { id: WorkspaceTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'documents', label: 'Documents' },
  ];
  const hl = profile.health >= 80 ? 'is-excellent' : profile.health >= 60 ? 'is-good' : 'is-needs-work';
  const hlLabel = profile.health >= 80 ? 'Excellent' : profile.health >= 60 ? 'Good' : 'Needs Attention';

  return (
    <div className="ff-workspace">
      {/* HERO */}
      <div className="ff-hero">
        <div className="ff-hero-top">
          <div>
            <div className="ff-hero-identity">
              <div className="ff-hero-icon"><Icon name={profile.icon} /></div>
              <span className="ff-hero-name">{profile.name}</span>
            </div>
            <div className="ff-hero-subtitle">{profile.subtitle}</div>
          </div>
          <div className="ff-hero-actions">
            <button className="ff-btn ff-btn-sm" onClick={onEdit} type="button"><Icon name="edit" /> Edit</button>
            <button className="ff-btn ff-btn-danger ff-btn-sm" onClick={onDelete} type="button"><Icon name="trash" /></button>
          </div>
        </div>
        <div className="ff-hero-meta">
          <span className="ff-meta-badge is-active"><span className="ff-meta-dot" /> Active Profile</span>
          <span className="ff-meta-text"><Icon name="clock" /> Updated {profile.lastUpdated}</span>
          {profile.resume && <span className="ff-meta-text"><Icon name="file" /> Resume Attached</span>}
        </div>
      </div>

      {/* HEALTH */}
      <div className="ff-health">
        <div className="ff-health-header">
          <span className="ff-health-label">Profile Health</span>
          <span className={`ff-health-status ${hl}`}>{hlLabel} · {profile.health}%</span>
        </div>
        <div className="ff-health-bar-track"><div className={`ff-health-bar-fill ${hl}`} style={{ width: `${profile.health}%` }} /></div>
        {profile.missingFields.length > 0 && (
          <div className="ff-health-missing">
            <span className="ff-health-missing-label" style={{ background: 'transparent', color: 'var(--text-tertiary)' }}>Missing:</span>
            {profile.missingFields.map((f) => <span key={f}>{f}</span>)}
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="ff-ws-tabs">
        {tabs.map((t) => <button className={`ff-ws-tab ${wsTab === t.id ? 'is-active' : ''}`} key={t.id} onClick={() => onWsTab(t.id)} type="button">{t.label}</button>)}
      </div>

      <div className="ff-ws-content">
        {wsTab === 'overview' && <OverviewPanel {...props} />}
        {wsTab === 'skills' && <SkillsPanel skills={profile.skills} onAdd={props.onAddSkill} onRemove={props.onRemoveSkill} />}
        {wsTab === 'projects' && <ProjectsPanel projects={profile.projects} onAdd={props.onAddProject} onRemove={props.onRemoveProject} />}
        {wsTab === 'documents' && <DocumentsPanel documents={profile.documents} onUpload={props.onUploadDoc} onDelete={props.onDeleteDoc} />}
      </div>
    </div>
  );
};

/* ================================================================
   OVERVIEW SUB-TAB
   ================================================================ */

const OverviewPanel: React.FC<WorkspaceProps> = ({ profile, expanded, onToggle, onAiCommand, onUpdateKb }) => {
  const [editingKb, setEditingKb] = useState<string | null>(null);
  const [kbVal, setKbVal] = useState('');

  const startEdit = (group: string, key: string, val: string) => { setEditingKb(`${group}::${key}`); setKbVal(val); };
  const saveEdit = (group: string, key: string) => { onUpdateKb(group, key, kbVal); setEditingKb(null); };

  const aiCmds = ['Generate Cover Letter', 'Generate Summary', 'Explain Project', 'Interview Response', 'Optimize Resume'];

  return (
    <>
      <Collapsible title="Resume" k="resume" expanded={expanded} onToggle={onToggle}>
        {profile.resume ? (
          <div className="ff-resume-row">
            <div className="ff-resume-icon"><Icon name="file" /></div>
            <div className="ff-resume-info"><strong>{profile.resume.name}</strong><span>Updated {profile.resume.updated}</span></div>
          </div>
        ) : <div className="ff-empty"><strong>No resume uploaded</strong><span>Go to Documents to attach your resume</span></div>}
      </Collapsible>

      <Collapsible title="Stats" k="stats" expanded={expanded} onToggle={onToggle}>
        <div className="ff-stats-grid">
          <div className="ff-stat-box"><strong>{profile.documents.length}</strong><span>Docs</span></div>
          <div className="ff-stat-box"><strong>{profile.projects.length}</strong><span>Projects</span></div>
          <div className="ff-stat-box"><strong>{profile.skills.length}</strong><span>Skills</span></div>
          <div className="ff-stat-box"><strong>{profile.experience}</strong><span>Exp</span></div>
        </div>
      </Collapsible>

      <Collapsible title="Focus Areas" k="focus" expanded={expanded} onToggle={onToggle}>
        <div className="ff-tags">{profile.focusAreas.map((a) => <span className="ff-tag" key={a}>{a}</span>)}</div>
      </Collapsible>

      <Collapsible title="Recent Projects" k="projects" expanded={expanded} onToggle={onToggle}>
        {profile.projects.slice(0, 3).map((pr) => (
          <div className="ff-project-item" key={pr.id}><div><div className="ff-project-name">{pr.name}</div><div className="ff-project-desc">{pr.description}</div></div></div>
        ))}
      </Collapsible>

      <Collapsible title="Knowledge Base" k="kb" expanded={expanded} onToggle={onToggle}>
        {profile.knowledgeBase.map((g) => (
          <div className="ff-kb-group" key={g.label}>
            <div className="ff-kb-group-label">{g.label}</div>
            {g.entries.map((e) => {
              const ek = `${g.label}::${e.key}`;
              if (editingKb === ek) {
                return (
                  <div className="ff-kb-edit" key={e.key}>
                    <strong style={{ fontSize: 11, marginBottom: 4, display: 'block', color: 'var(--text-secondary)' }}>{e.key}</strong>
                    <textarea value={kbVal} onChange={(ev) => setKbVal(ev.target.value)} autoFocus />
                    <div className="ff-kb-edit-actions">
                      <button className="ff-btn ff-btn-sm ff-btn-ghost" onClick={() => setEditingKb(null)} type="button">Cancel</button>
                      <button className="ff-btn ff-btn-sm ff-btn-primary" onClick={() => saveEdit(g.label, e.key)} type="button">Save</button>
                    </div>
                  </div>
                );
              }
              return (
                <div className="ff-kb-entry" key={e.key} onClick={() => startEdit(g.label, e.key, e.value)}>
                  <span>{e.key}</span>
                  {e.value ? <span className="ff-kb-value">{e.value}</span> : <Icon name="chevron-right" />}
                </div>
              );
            })}
          </div>
        ))}
      </Collapsible>

      <Collapsible title="⚡ AI Commands" k="ai" expanded={expanded} onToggle={onToggle}>
        {aiCmds.map((c) => <button className="ff-command-row" key={c} onClick={() => onAiCommand(c)} type="button"><span>{c}</span><Icon name="chevron-right" /></button>)}
      </Collapsible>
    </>
  );
};

/* ================================================================
   COLLAPSIBLE COMPONENT
   ================================================================ */

const Collapsible: React.FC<{ title: string; k: string; expanded: Set<string>; onToggle: (k: string) => void; children: React.ReactNode }> = ({ title, k, expanded, onToggle, children }) => {
  const open = expanded.has(k);
  return (
    <div className="ff-section">
      <button className="ff-section-header" onClick={() => onToggle(k)} type="button">
        <span className="ff-section-title">{title}</span>
        <span className={`ff-section-toggle ${open ? 'is-open' : 'is-closed'}`}><Icon name="chevron-down" /></span>
      </button>
      {open && <div className="ff-section-body">{children}</div>}
    </div>
  );
};

/* ================================================================
   SKILLS SUB-TAB
   ================================================================ */

const SkillsPanel: React.FC<{ skills: string[]; onAdd: (s: string) => void; onRemove: (s: string) => void }> = ({ skills, onAdd, onRemove }) => {
  const [adding, setAdding] = useState(false);
  const [val, setVal] = useState('');
  const submit = () => { if (val.trim()) { onAdd(val); setVal(''); } };

  return (
    <div>
      <div className="ff-skill-grid">
        {skills.map((s) => (
          <span className="ff-tag" key={s}>{s}<button className="ff-tag-remove" onClick={() => onRemove(s)} type="button" title="Remove">×</button></span>
        ))}
        {!adding && <button className="ff-add-inline" onClick={() => setAdding(true)} type="button"><Icon name="plus" /> Add Skill</button>}
      </div>
      {adding && (
        <div className="ff-inline-input">
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') { setAdding(false); setVal(''); } }} placeholder="Type skill name…" autoFocus />
          <button className="ff-btn ff-btn-primary ff-btn-sm" onClick={submit} type="button">Add</button>
          <button className="ff-btn ff-btn-ghost ff-btn-sm" onClick={() => { setAdding(false); setVal(''); }} type="button">Cancel</button>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   PROJECTS SUB-TAB
   ================================================================ */

const ProjectsPanel: React.FC<{ projects: ProjectItem[]; onAdd: (n: string, d: string) => void; onRemove: (id: string) => void }> = ({ projects, onAdd, onRemove }) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const submit = () => { if (name.trim()) { onAdd(name, desc); setName(''); setDesc(''); setAdding(false); } };

  return (
    <div>
      {projects.length === 0 && !adding && <div className="ff-empty"><strong>No projects added yet</strong><span>Add your first project to complete your profile</span></div>}
      {projects.map((p) => (
        <div className="ff-project-item" key={p.id}>
          <div><div className="ff-project-name">{p.name}</div><div className="ff-project-desc">{p.description}</div></div>
          <button className="ff-icon-btn is-danger" onClick={() => onRemove(p.id)} type="button" title="Remove"><Icon name="trash" /></button>
        </div>
      ))}
      {adding ? (
        <div className="ff-add-project-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" autoFocus />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description" />
          <div className="ff-form-actions">
            <button className="ff-btn ff-btn-sm" onClick={() => { setAdding(false); setName(''); setDesc(''); }} type="button">Cancel</button>
            <button className="ff-btn ff-btn-sm ff-btn-primary" onClick={submit} type="button"><Icon name="check" /> Save</button>
          </div>
        </div>
      ) : (
        <button className="ff-add-inline" onClick={() => setAdding(true)} type="button" style={{ marginTop: 8 }}><Icon name="plus" /> Add Project</button>
      )}
    </div>
  );
};

/* ================================================================
   DOCUMENTS SUB-TAB
   ================================================================ */

const DocumentsPanel: React.FC<{ documents: DocumentItem[]; onUpload: () => void; onDelete: (id: string) => void }> = ({ documents, onUpload, onDelete }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
      <button className="ff-btn ff-btn-primary ff-btn-sm" onClick={onUpload} type="button"><Icon name="upload" /> Upload Doc</button>
    </div>
    {documents.length === 0 ? <div className="ff-empty"><strong>No documents uploaded</strong><span>Upload PDFs, certificates, and statement letters</span></div> : documents.map((d) => (
      <div className="ff-doc-item" key={d.id}>
        <div className="ff-doc-info"><strong>{d.name}</strong><span>{d.category} · {d.updated}</span></div>
        <div className="ff-doc-actions">
          <button className="ff-icon-btn" type="button" title="View"><Icon name="eye" /></button>
          <button className="ff-icon-btn is-danger" onClick={() => onDelete(d.id)} type="button" title="Delete"><Icon name="trash" /></button>
        </div>
      </div>
    ))}
  </div>
);

/* ================================================================
   VAULT TAB
   ================================================================ */

const VaultTab: React.FC<{ unlocked: boolean; onToggle: () => void }> = ({ unlocked, onToggle }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <div className="ff-page-title" style={{ marginBottom: 0 }}>Vault</div>
      <button className="ff-btn ff-btn-primary ff-btn-sm" onClick={onToggle} type="button"><Icon name={unlocked ? 'shield' : 'unlock'} /> {unlocked ? 'Lock Vault' : 'Unlock Vault'}</button>
    </div>
    <div className="ff-vault-grid">
      {vaultEntries.map((e) => <div className="ff-vault-item" key={e.label}><span className="ff-vault-item-label">{e.label}</span><span className={`ff-vault-item-value ${unlocked ? '' : 'is-locked'}`}>{unlocked ? e.value : '••••••••'}</span></div>)}
    </div>
  </div>
);

/* ================================================================
   ANALYTICS TAB
   ================================================================ */

const AnalyticsTab: React.FC<{ formsFilled: number; aiResponses: number; profileCount: number }> = ({ formsFilled, aiResponses, profileCount }) => (
  <div>
    <div className="ff-page-title">Analytics</div>
    <div className="ff-metric-grid">
      <div className="ff-metric-card"><div className="ff-metric-value">{formsFilled}</div><div className="ff-metric-label">Applications Filled</div><div className="ff-metric-delta">+12 this week</div></div>
      <div className="ff-metric-card"><div className="ff-metric-value">{Math.round(formsFilled * 0.19)}h</div><div className="ff-metric-label">Time Saved</div><div className="ff-metric-delta">Estimated from autofill</div></div>
      <div className="ff-metric-card"><div className="ff-metric-value">{profileCount}</div><div className="ff-metric-label">Profiles</div><div className="ff-metric-delta">Active profiles</div></div>
      <div className="ff-metric-card"><div className="ff-metric-value">{aiResponses}</div><div className="ff-metric-label">AI Responses</div><div className="ff-metric-delta">+{aiResponses} this session</div></div>
    </div>
  </div>
);

/* ================================================================
   SETTINGS TAB
   ================================================================ */

const SettingsTab: React.FC<{ theme: ThemeMode; onThemeChange: (t: ThemeMode) => void; onOpenWebsite: () => void }> = ({ theme, onThemeChange, onOpenWebsite }) => (
  <div>
    <div className="ff-page-title">Settings</div>
    <div className="ff-settings-group">
      <div className="ff-settings-group-title">Appearance</div>
      <div className="ff-setting-row">
        <div><div className="ff-setting-label">Theme</div><div className="ff-setting-desc">Toggle between light and dark mode</div></div>
        <div className="ff-segmented">
          <button className={theme === 'light' ? 'is-active' : ''} onClick={() => onThemeChange('light')} type="button">Light</button>
          <button className={theme === 'dark' ? 'is-active' : ''} onClick={() => onThemeChange('dark')} type="button">Dark</button>
        </div>
      </div>
    </div>
    <div className="ff-settings-group">
      <div className="ff-settings-group-title">Account</div>
      <div className="ff-setting-row">
        <div><div className="ff-setting-label">Dashboard</div><div className="ff-setting-desc">Manage your account on formforge.app</div></div>
        <button className="ff-btn ff-btn-sm" onClick={onOpenWebsite} type="button">Open <Icon name="external" /></button>
      </div>
      <div className="ff-setting-row">
        <div><div className="ff-setting-label">Sync</div><div className="ff-setting-desc">Profiles and documents sync automatically</div></div>
        <Badge tone="success">Active</Badge>
      </div>
    </div>
    <div className="ff-settings-group">
      <div className="ff-settings-group-title">About</div>
      <div className="ff-setting-row"><div><div className="ff-setting-label">FormForge</div><div className="ff-setting-desc">Version 1.0.0</div></div></div>
    </div>
  </div>
);

export default Popup;
