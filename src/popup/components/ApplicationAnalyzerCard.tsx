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
    <div className="feature-panel">
      <div className="feature-panel__header">
        <div>
          <p className="eyebrow">Application Analyzer</p>
          <h3>{pageState}</h3>
        </div>
        <Icon name="analyze" className="feature-panel__icon" />
      </div>

      <div className="button-stack">
        <button className="btn btn-secondary btn-wide" onClick={onAnalyzeForm}>
          Analyze Form
        </button>
        <button className="btn btn-secondary btn-wide" onClick={onRecommendPersona}>
          Recommend Persona
        </button>
        <button className="btn btn-secondary btn-wide" onClick={onCheckAtsMatch}>
          Check ATS Match
        </button>
      </div>
    </div>
  );
};

export default ApplicationAnalyzerCard;
