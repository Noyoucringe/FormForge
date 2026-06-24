import React from 'react';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';

export interface PersonaCardModel {
  focus: string;
  id: string;
  name: string;
  tags: string[];
}

interface PersonaCardProps {
  isActive: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onSelect: () => void;
  persona: PersonaCardModel;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ isActive, onDelete, onEdit, onSelect, persona }) => (
  <Card className={isActive ? 'is-selected' : ''}>
    <div className="ff-persona-card">
      <button className="ff-persona-select" onClick={onSelect} type="button">
        <div className="ff-card-heading">
          <strong>{persona.name}</strong>
          {isActive && <Badge tone="success">Current</Badge>}
        </div>
        <p>{persona.focus}</p>
        <div className="ff-tags">
          {persona.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </button>
      <div className="ff-row-actions">
        <Button icon="edit" onClick={onEdit} title={`Edit ${persona.name}`} variant="ghost">
          Edit
        </Button>
        <Button icon="trash" onClick={onDelete} title={`Delete ${persona.name}`} variant="danger">
          Delete
        </Button>
      </div>
    </div>
  </Card>
);

export default PersonaCard;
