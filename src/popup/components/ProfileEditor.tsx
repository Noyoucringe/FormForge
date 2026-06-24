import React, { useState } from 'react';
import { Profile } from '../../types/index';
import { ProfileService } from '../../services/profileService';

interface ProfileEditorProps {
  profile: Profile | null;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    profile || {
      id: '',
      name: '',
      type: 'Custom' as const,
      data: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      },
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value as any,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Profile name is required');
      return;
    }

    const profileToSave: Profile = {
      ...formData,
      id: formData.id || ProfileService.generateId(),
      updatedAt: Date.now(),
    };

    onSave(profileToSave);
  };

  return (
    <div className="profile-editor">
      <h2>{profile ? 'Edit Profile' : 'Create Profile'}</h2>

      <form className="editor-form">
        <div className="form-group">
          <label>Profile Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g., My SWE Profile"
          />
        </div>

        <div className="form-group">
          <label>Profile Type</label>
          <select value={formData.type} onChange={handleTypeChange}>
            <option value="AI">AI Engineer</option>
            <option value="SWE">Software Engineer</option>
            <option value="Research">Research</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.data.fullName || ''}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.data.email || ''}
            onChange={handleInputChange}
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.data.phone || ''}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            name="linkedin"
            value={formData.data.linkedin || ''}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div className="form-group">
          <label>GitHub URL</label>
          <input
            type="url"
            name="github"
            value={formData.data.github || ''}
            onChange={handleInputChange}
            placeholder="https://github.com/johndoe"
          />
        </div>

        <div className="form-group">
          <label>Skills (comma separated)</label>
          <textarea
            name="skills"
            value={formData.data.skills?.join(', ') || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                },
              }))
            }
            placeholder="JavaScript, React, TypeScript"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Profile
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
