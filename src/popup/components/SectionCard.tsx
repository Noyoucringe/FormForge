import React, { ReactNode } from 'react';
import Icon, { IconName } from './Icon';

interface SectionCardProps {
  title: string;
  subtitle?: string; // Subtitle is removed in new design for a cleaner look, keeping prop for compatibility but not rendering it
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`section-container ${className}`.trim()}>
      <div className="section-header">
        <h2 className="section-title">
          {icon && <Icon name={icon} />}
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
