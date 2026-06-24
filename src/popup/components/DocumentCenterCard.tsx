import React from 'react';
import Icon from './Icon';
import { DocumentItem } from '../types';

interface DocumentCenterCardProps {
  documents: DocumentItem[];
  onUpload: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentCenterCard: React.FC<DocumentCenterCardProps> = ({
  documents,
  onUpload,
  onView,
  onDelete,
}) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">
          <Icon name="file" />
          Document Center
        </h2>
        <button className="btn btn-ghost btn-icon-only" onClick={onUpload} title="Upload Document">
          <Icon name="upload" style={{ width: 14, height: 14 }} />
        </button>
      </div>

      <div className="section-content">
        <div className="list-group">
          {documents.map((item) => (
            <div key={item.id} className="list-item" style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}>
              <div className="persona-info">
                <span className="persona-name" style={{ fontSize: '0.75rem' }}>{item.name}</span>
                <span className="persona-meta" style={{ fontSize: '0.65rem' }}>
                  {item.category} • {item.size}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-icon-only" onClick={() => onView(item.id)} title="View">
                  <Icon name="eye" style={{ width: 14, height: 14 }} />
                </button>
                <button className="btn btn-ghost btn-icon-only text-danger" onClick={() => onDelete(item.id)} title="Delete">
                  <Icon name="trash" style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentCenterCard;
