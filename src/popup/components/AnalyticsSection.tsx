import React from 'react';
import { MetricCardData } from '../types';

interface AnalyticsSectionProps {
  metrics: MetricCardData[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ metrics }) => {
  return (
    <div className="grid-2">
      {metrics.map((metric) => (
        <div key={metric.label} className="section-content" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{metric.label}</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{metric.value}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{metric.hint}</div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSection;
