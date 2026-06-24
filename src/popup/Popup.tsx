import React, { useState } from 'react';
import { Profile } from '../types/index';
import ProfileList from './components/ProfileList';
import ProfileEditor from './components/ProfileEditor';
import MasterPasswordCheck from './components/MasterPasswordCheck';
import AutofillButton from './components/AutofillButton';
import './popup.css';

const Popup: React.FC = () => {
  const [view, setView] = useState<'profiles' | 'editor' | 'password'>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  React.useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_PROFILES' });
    setProfiles(response);

    const active = await chrome.runtime.sendMessage({ type: 'GET_ACTIVE_PROFILE' });
    setActiveProfile(active);
  };

  const handleCreateProfile = () => {
    setSelectedProfile(null);
    setView('editor');
  };

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setView('editor');
  };

  const handleSaveProfile = async (profile: Profile) => {
    await chrome.runtime.sendMessage({
      type: 'SAVE_PROFILE',
      payload: profile,
    });

    if (profile.id) {
      await chrome.runtime.sendMessage({
        type: 'SET_ACTIVE_PROFILE',
        payload: profile.id,
      });
      setActiveProfile(profile.id);
    }

    await loadProfiles();
    setView('profiles');
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('Delete this profile?')) {
      await chrome.runtime.sendMessage({
        type: 'DELETE_PROFILE',
        payload: profileId,
      });
      await loadProfiles();
    }
  };

  const handleSelectProfile = async (profileId: string) => {
    await chrome.runtime.sendMessage({
      type: 'SET_ACTIVE_PROFILE',
      payload: profileId,
    });
    setActiveProfile(profileId);
  };

  const handlePasswordVerified = () => {
    setIsPasswordVerified(true);
    setView('profiles');
  };

  const currentProfile = profiles.find((p) => p.id === activeProfile);

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>FormForge</h1>
      </header>

      <main className="popup-content">
        {view === 'profiles' && (
          <>
            <ProfileList
              profiles={profiles}
              activeProfileId={activeProfile}
              onEdit={handleEditProfile}
              onDelete={handleDeleteProfile}
              onSelect={handleSelectProfile}
              onCreate={handleCreateProfile}
            />
            {currentProfile && isPasswordVerified && (
              <AutofillButton profile={currentProfile} />
            )}
            {currentProfile && !isPasswordVerified && (
              <button
                className="btn btn-verify"
                onClick={() => setView('password')}
              >
                Verify Password to Autofill
              </button>
            )}
          </>
        )}

        {view === 'editor' && (
          <ProfileEditor
            profile={selectedProfile}
            onSave={handleSaveProfile}
            onCancel={() => setView('profiles')}
          />
        )}

        {view === 'password' && (
          <MasterPasswordCheck
            onVerified={handlePasswordVerified}
            onCancel={() => setView('profiles')}
          />
        )}
      </main>
    </div>
  );
};

export default Popup;
