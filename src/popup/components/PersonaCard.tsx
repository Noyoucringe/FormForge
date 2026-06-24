import React from 'react';
import Icon from './Icon';
import { PersonaCardData } from '../types';

interface PersonaCardProps {
  persona: PersonaCardData;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onSelect, onEdit, onDelete }) => {
  return (
    <div className={`list-item ${persona.active ? 'active' : ''}`} onClick={() => onSelect(persona.id)} style={{ cursor: 'pointer' }}>
      <div className="persona-info">
        <span className="persona-name">{persona.name}</span>
        <span className="persona-meta">{persona.role}</span>
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
          {persona.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          className="btn btn-ghost btn-icon-only" 
          onClick={(e) => { e.stopPropagation(); onEdit(persona.id); }} 
          title="Edit"
        >
          <Icon name="edit" style={{ width: 14, height: 14 }} />
        </button>
        <button 
          className="btn btn-ghost btn-icon-only text-danger" 
          onClick={(e) => { e.stopPropagation(); onDelete(persona.id); }} 
          title="Delete"
        >
          <Icon name="trash" style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
};

export default PersonaCard;
