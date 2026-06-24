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
    <article className={`persona-card ${persona.active ? 'persona-card--active' : ''}`}>
      <div className="persona-card__body">
        <div className="persona-card__header">
          <div>
            <h3>{persona.name}</h3>
            <p>{persona.role}</p>
          </div>
          {persona.active && <span className="persona-card__badge">Active</span>}
        </div>

        <div className="persona-card__meta">
          <span>{persona.resumeCount} resumes</span>
          <span>Updated {persona.lastUpdated}</span>
        </div>

        <div className="chips-row">
          {persona.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="chip">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="persona-card__footer">
        <button className="btn btn-secondary btn-sm" onClick={() => onSelect(persona.id)}>
          Select Persona
        </button>
        <div className="persona-card__inline-actions">
          <button className="icon-button" onClick={() => onEdit(persona.id)} title="Edit Persona">
            <Icon name="edit" />
          </button>
          <button className="icon-button icon-button--danger" onClick={() => onDelete(persona.id)} title="Delete Persona">
            <Icon name="trash" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PersonaCard;
