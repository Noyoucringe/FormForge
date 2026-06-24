import React, { ReactNode } from 'react';
import Icon, { IconName } from './Icon';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
}) => {
  return (
    <section className={`section-card ${className}`.trim()}>
      <div className="section-card__header">
        <div className="section-card__title-group">
          {icon && (
            <div className="section-card__icon">
              <Icon name={icon} />
            </div>
          )}
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        {action && <div className="section-card__action">{action}</div>}
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  );
};

export default SectionCard;
