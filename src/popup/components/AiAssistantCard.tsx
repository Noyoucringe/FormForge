import React from 'react';
import Icon from './Icon';

interface AiAssistantCardProps {
  onGenerateResponse: () => void;
}

const AiAssistantCard: React.FC<AiAssistantCardProps> = ({ onGenerateResponse }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">
          <Icon name="spark" />
          AI Assistant
        </h2>
      </div>
      <div className="section-content" style={{ padding: 'var(--spacing-md)' }}>
        <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          <li>Answer App Questions</li>
          <li>Generate Descriptions</li>
          <li>Create Summaries</li>
          <li>Customize Responses</li>
        </ul>
        <button className="btn btn-primary btn-block" onClick={onGenerateResponse}>
          Generate Response
        </button>
      </div>
    </div>
  );
};

export default AiAssistantCard;
