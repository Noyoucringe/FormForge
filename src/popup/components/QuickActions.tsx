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
    <div className="action-grid">
      {actions.map((action) => (
        <button key={action.key} className="action-card" onClick={action.onClick}>
          <Icon name={action.icon} />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
