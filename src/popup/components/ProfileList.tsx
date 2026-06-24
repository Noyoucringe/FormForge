import React from 'react';
import { Profile } from '../../types/index';

interface ProfileListProps {
  profiles: Profile[];
  activeProfileId: string | null;
  onEdit: (profile: Profile) => void;
  onDelete: (profileId: string) => void;
  onSelect: (profileId: string) => void;
  onCreate: () => void;
}

const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  activeProfileId,
  onEdit,
  onDelete,
  onSelect,
  onCreate,
}) => {
  return (
    <div className="profile-list">
      <div className="profile-list-header">
        <h2>Profiles</h2>
        <button className="btn btn-primary btn-sm" onClick={onCreate}>
          + New
        </button>
      </div>

      <div className="profile-items">
        {profiles.length === 0 ? (
          <p className="empty-state">No profiles yet. Create one to get started.</p>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className={`profile-item ${activeProfileId === profile.id ? 'active' : ''}`}
              onClick={() => onSelect(profile.id)}
            >
              <div className="profile-info">
                <h3>{profile.name}</h3>
                <p className="profile-type">{profile.type}</p>
              </div>
              <div className="profile-actions">
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(profile);
                  }}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(profile.id);
                  }}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileList;
