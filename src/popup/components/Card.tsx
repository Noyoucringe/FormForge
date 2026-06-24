import React from 'react';
import Icon, { IconName } from './Icon';

interface CardProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  icon?: IconName;
  title?: string;
}

const Card: React.FC<CardProps> = ({ actions, children, className = '', icon, title }) => (
  <section className={`ff-card ${className}`}>
    {(title || actions) && (
      <div className="ff-card-header">
        <div>
          {icon && <Icon name={icon} />}
          {title && <h3>{title}</h3>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </section>
);

export default Card;
