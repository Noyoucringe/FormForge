import React from 'react';
import Icon, { IconName } from './Icon';

type ActionKey = 'fill' | 'analyze' | 'generate' | 'upload' | 'dashboard';

interface QuickAction {
  key: ActionKey;
  label: string;
  icon: IconName;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="quick-actions-grid">
      {actions.map((action) => (
        <button key={action.key} className="quick-action-card" onClick={action.onClick}>
          <span className="quick-action-card__icon">
            <Icon name={action.icon} />
          </span>
          <span className="quick-action-card__label">{action.label}</span>
          <span className="quick-action-card__arrow">
            <Icon name="arrow-right" />
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
