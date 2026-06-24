import React from 'react';
import { Profile } from '../../types/index';
import Icon from './Icon';

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
}) => {
  return (
    <div className="list-group">
      {profiles.length === 0 ? (
        <div style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          No legacy profiles found.
        </div>
      ) : (
        profiles.map((profile) => (
          <div
            key={profile.id}
            className={`list-item ${activeProfileId === profile.id ? 'active' : ''}`}
            onClick={() => onSelect(profile.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="persona-info">
              <span className="persona-name">{profile.name}</span>
              <span className="persona-meta">{profile.type || 'Custom Profile'}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                className="btn btn-ghost btn-icon-only"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(profile);
                }}
                title="Edit"
              >
                <Icon name="edit" style={{ width: 14, height: 14 }} />
              </button>
              <button
                className="btn btn-ghost btn-icon-only text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(profile.id);
                }}
                title="Delete"
              >
                <Icon name="trash" style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfileList;
