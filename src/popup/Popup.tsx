import React, { useEffect, useMemo, useState } from 'react';
import { Profile } from '../types/index';
import ProfileList from './components/ProfileList';
import ProfileEditor from './components/ProfileEditor';
import MasterPasswordCheck from './components/MasterPasswordCheck';
import AutofillButton from './components/AutofillButton';
import TopBar from './components/TopBar';
import StatusCard from './components/StatusCard';
import PersonaCard from './components/PersonaCard';
import QuickActions from './components/QuickActions';
import AiAssistantCard from './components/AiAssistantCard';
import ApplicationAnalyzerCard from './components/ApplicationAnalyzerCard';
import SecurityVaultCard from './components/SecurityVaultCard';
import DocumentCenterCard from './components/DocumentCenterCard';
import AnalyticsSection from './components/AnalyticsSection';
import SettingsView from './components/SettingsView';
import Icon from './components/Icon';
import SectionCard from './components/SectionCard';
import { AppView, DocumentItem, MetricCardData, PersonaCardData } from './types';
import './popup.css';

const personaSeed: PersonaCardData[] = [
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    role: 'Machine Learning / Applied AI',
    skills: ['Python', 'LLMs', 'MLOps', 'TensorFlow'],
    resumeCount: 2,
    lastUpdated: 'Today',
    active: true,
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    role: 'Frontend / Full Stack',
    skills: ['TypeScript', 'React', 'Node.js', 'System Design'],
    resumeCount: 3,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'research',
    name: 'Research',
    role: 'Academic / Research Roles',
    skills: ['Papers', 'Statistics', 'Experiment Design', 'Analysis'],
    resumeCount: 1,
    lastUpdated: '3 days ago',
  },
];

const documentSeed: DocumentItem[] = [
  { id: 'doc-1', name: 'AI Engineer Resume v3.pdf', category: 'Resumes', updatedAt: 'Today', size: '1.8 MB' },
  { id: 'doc-2', name: 'SWE Resume.pdf', category: 'Resumes', updatedAt: 'Yesterday', size: '1.5 MB' },
  { id: 'doc-3', name: 'Masters Degree Certificate.pdf', category: 'Certificates', updatedAt: '5 days ago', size: '780 KB' },
  { id: 'doc-4', name: 'Offer Letter - Internship.pdf', category: 'Offer Letters', updatedAt: '1 month ago', size: '640 KB' },
];

const metrics: MetricCardData[] = [
  { label: 'Applications Filled', value: '128', hint: 'Across all personas' },
  { label: 'Time Saved', value: '24h', hint: 'Estimated manual entry time' },
  { label: 'Personas Created', value: '3', hint: 'Ready for use' },
  { label: 'Forms Completed', value: '92%', hint: 'Average completion rate' },
];

const Popup: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [mockSignedIn] = useState(true);
  const [mockSecurityStatus] = useState('Protected');
  const [mockPageState] = useState('Application Detected');

  useEffect(() => {
    void loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_PROFILES' });
    setProfiles(response || []);

    const active = await chrome.runtime.sendMessage({ type: 'GET_ACTIVE_PROFILE' });
    setActiveProfile(active);
  };

  const activePersonaName = useMemo(() => {
    const active = personaSeed.find((persona) => persona.active) || personaSeed[0];
    const saved = profiles.find((profile) => profile.id === activeProfile);
    return saved?.name || active.name;
  }, [activeProfile, profiles]);

  const openExternal = () => {
    chrome.tabs.create({ url: 'https://formforge.app/' });
  };

  const handleCreateProfile = () => {
    setSelectedProfile(null);
    setView('create-persona');
  };

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setView('create-persona');
  };

  const handleSaveProfile = async (profile: Profile) => {
    await chrome.runtime.sendMessage({ type: 'SAVE_PROFILE', payload: profile });
    if (profile.id) {
      await chrome.runtime.sendMessage({ type: 'SET_ACTIVE_PROFILE', payload: profile.id });
      setActiveProfile(profile.id);
    }
    await loadProfiles();
    setView('dashboard');
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('Delete this profile?')) {
      await chrome.runtime.sendMessage({ type: 'DELETE_PROFILE', payload: profileId });
      await loadProfiles();
    }
  };

  const handleSelectProfile = async (profileId: string) => {
    await chrome.runtime.sendMessage({ type: 'SET_ACTIVE_PROFILE', payload: profileId });
    setActiveProfile(profileId);
  };

  const handlePasswordVerified = () => {
    setIsPasswordVerified(true);
    setView('dashboard');
  };

  const handlePlaceholder = (label: string) => {
    window.alert(`${label} is coming soon.`);
  };

  const handleWebsiteIntegration = () => {
    openExternal();
  };

  const currentActiveProfile = profiles.find((profile) => profile.id === activeProfile) || null;

  const dashboard = (
    <div className="dashboard-shell">
      <TopBar
        onOpenSettings={() => setView('settings')}
        onOpenHelp={() => handlePlaceholder('Help')}
        onOpenWebsite={handleWebsiteIntegration}
      />

      <div className="popup-content">
        <SectionCard
          title="User Status"
          icon="status"
        >
          <StatusCard
            signedIn={mockSignedIn}
            activePersonaName={activePersonaName}
            securityStatus={mockSecurityStatus}
            onOpenDashboard={handleWebsiteIntegration}
          />
        </SectionCard>

        <SectionCard
          title="Persona Management"
          icon="persona"
          action={
            <button className="btn btn-primary btn-sm" onClick={handleCreateProfile}>
              <Icon name="plus" /> Create Persona
            </button>
          }
        >
          <div className="persona-grid">
            {personaSeed.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onSelect={() => handlePlaceholder(`Select ${persona.name}`)}
                onEdit={() => handlePlaceholder(`Edit ${persona.name}`)}
                onDelete={() => handlePlaceholder(`Delete ${persona.name}`)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" icon="dashboard">
          <QuickActions
            actions={[
              { key: 'fill', label: 'Fill Current Form', icon: 'check', onClick: () => handlePlaceholder('Fill Current Form') },
              { key: 'analyze', label: 'Analyze Form', icon: 'analyze', onClick: () => handlePlaceholder('Analyze Form') },
              { key: 'generate', label: 'Generate Answers', icon: 'spark', onClick: () => handlePlaceholder('Generate Answers') },
              { key: 'upload', label: 'Upload Resume', icon: 'upload', onClick: () => handlePlaceholder('Upload Resume') },
              { key: 'dashboard', label: 'Open Dashboard', icon: 'globe', onClick: handleWebsiteIntegration },
            ]}
          />
        </SectionCard>

        <div className="grid-2">
          <AiAssistantCard onGenerateResponse={() => handlePlaceholder('Generate Response')} />
          <ApplicationAnalyzerCard
            pageState={mockPageState}
            onAnalyzeForm={() => handlePlaceholder('Analyze Form')}
            onRecommendPersona={() => handlePlaceholder('Recommend Persona')}
            onCheckAtsMatch={() => handlePlaceholder('Check ATS Match')}
          />
        </div>

        <div className="grid-2">
          <SecurityVaultCard
            onVerifyIdentity={() => setView('password')}
            onUnlockSensitiveFields={() => setView('password')}
          />
          <DocumentCenterCard
            documents={documentSeed}
            onUpload={() => handlePlaceholder('Upload Document')}
            onView={(id) => handlePlaceholder(`View document ${id}`)}
            onDelete={(id) => handlePlaceholder(`Delete document ${id}`)}
          />
        </div>

        <SectionCard title="Analytics" icon="analytics">
          <AnalyticsSection metrics={metrics} />
        </SectionCard>

        <SectionCard
          title="Existing Profiles"
          icon="resume"
          action={
            <button className="btn btn-secondary btn-sm" onClick={handleCreateProfile}>
              <Icon name="plus" /> Add Profile
            </button>
          }
        >
          <ProfileList
            profiles={profiles}
            activeProfileId={activeProfile}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
            onSelect={handleSelectProfile}
            onCreate={handleCreateProfile}
          />
          {currentActiveProfile && isPasswordVerified && (
            <AutofillButton profile={currentActiveProfile} />
          )}
          {currentActiveProfile && !isPasswordVerified && (
            <button className="btn btn-verify btn-wide" onClick={() => setView('password')}>
              Unlock Sensitive Fields
            </button>
          )}
        </SectionCard>
      </div>
    </div>
  );

  return (
    <div className="popup-container">
      {view === 'dashboard' && dashboard}

      {view === 'create-persona' && (
        <div className="screen-shell">
          <TopBar
            onOpenSettings={() => setView('settings')}
            onOpenHelp={() => handlePlaceholder('Help')}
            onOpenWebsite={handleWebsiteIntegration}
          />
          <main className="screen-shell__content">
            <SectionCard title={selectedProfile ? 'Edit Persona' : 'Create Persona'} icon="persona">
              <ProfileEditor
                profile={selectedProfile}
                onSave={handleSaveProfile}
                onCancel={() => setView('dashboard')}
              />
            </SectionCard>
          </main>
        </div>
      )}

      {view === 'password' && (
        <div className="screen-shell">
          <TopBar
            onOpenSettings={() => setView('settings')}
            onOpenHelp={() => handlePlaceholder('Help')}
            onOpenWebsite={handleWebsiteIntegration}
          />
          <main className="screen-shell__content screen-shell__content--narrow">
            <SectionCard title="Security Verification" subtitle="Unlock sensitive fields with your master password" icon="shield">
              <MasterPasswordCheck
                onVerified={handlePasswordVerified}
                onCancel={() => setView('dashboard')}
              />
            </SectionCard>
          </main>
        </div>
      )}

      {view === 'settings' && (
        <SettingsView onBack={() => setView('dashboard')} onOpenWebsite={handleWebsiteIntegration} />
      )}
    </div>
  );
};

export default Popup;
