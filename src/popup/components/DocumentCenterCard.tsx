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
    <div className="feature-panel">
      <div className="feature-panel__header">
        <div>
          <p className="eyebrow">Document Center</p>
          <h3>Manage resumes and supporting files</h3>
        </div>
        <Icon name="file" className="feature-panel__icon" />
      </div>

      <div className="document-groups">
        {['Resumes', 'Certificates', 'Offer Letters'].map((group) => (
          <div key={group} className="document-group">
            <h4>{group}</h4>
            <div className="document-group__items">
              {documents
                .filter((item) => item.category === group)
                .map((item) => (
                  <div key={item.id} className="document-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.size} • Updated {item.updatedAt}</p>
                    </div>
                    <div className="document-item__actions">
                      <button className="icon-button" onClick={() => onView(item.id)} title="View">
                        <Icon name="eye" />
                      </button>
                      <button className="icon-button" onClick={() => onDelete(item.id)} title="Delete">
                        <Icon name="trash" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary btn-wide" onClick={onUpload}>
        Upload Document
      </button>
    </div>
  );
};

export default DocumentCenterCard;
