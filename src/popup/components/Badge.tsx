import React from 'react';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
}

const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral' }) => (
  <span className={`ff-badge ff-badge-${tone}`}>{children}</span>
);

export default Badge;
