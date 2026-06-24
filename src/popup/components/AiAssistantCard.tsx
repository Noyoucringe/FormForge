import React from 'react';
import Icon from './Icon';

interface AiAssistantCardProps {
  onGenerateResponse: () => void;
}

const AiAssistantCard: React.FC<AiAssistantCardProps> = ({ onGenerateResponse }) => {
  return (
    <div className="feature-panel">
      <div className="feature-panel__header">
        <div>
          <p className="eyebrow">AI Assistant</p>
          <h3>Draft persona-aware responses</h3>
        </div>
        <Icon name="spark" className="feature-panel__icon" />
      </div>

      <ul className="feature-list">
        <li>Answer Application Questions</li>
        <li>Generate Project Descriptions</li>
        <li>Create Professional Summaries</li>
        <li>Customize Responses by Persona</li>
      </ul>

      <button className="btn btn-primary btn-wide" onClick={onGenerateResponse}>
        Generate Response
      </button>
    </div>
  );
};

export default AiAssistantCard;
