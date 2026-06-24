import React from 'react';
import { MetricCardData } from '../types';

interface AnalyticsSectionProps {
  metrics: MetricCardData[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ metrics }) => {
  return (
    <div className="analytics-grid">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card">
          <span className="metric-card__label">{metric.label}</span>
          <strong>{metric.value}</strong>
          <p>{metric.hint}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSection;
