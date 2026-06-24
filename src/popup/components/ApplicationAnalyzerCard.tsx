import React from 'react';
import Icon from './Icon';

interface ApplicationAnalyzerCardProps {
  pageState: string;
  onAnalyzeForm: () => void;
  onRecommendPersona: () => void;
  onCheckAtsMatch: () => void;
}

const ApplicationAnalyzerCard: React.FC<ApplicationAnalyzerCardProps> = ({
  pageState,
  onAnalyzeForm,
  onRecommendPersona,
  onCheckAtsMatch,
}) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">
          <Icon name="analyze" />
          App Analyzer
        </h2>
        <span className="tag" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>{pageState}</span>
      </div>
      <div className="section-content" style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <button className="btn btn-secondary btn-block" onClick={onAnalyzeForm}>
          Analyze Form
        </button>
        <button className="btn btn-secondary btn-block" onClick={onRecommendPersona}>
          Recommend Persona
        </button>
        <button className="btn btn-secondary btn-block" onClick={onCheckAtsMatch}>
          Check ATS Match
        </button>
      </div>
    </div>
  );
};

export default ApplicationAnalyzerCard;
