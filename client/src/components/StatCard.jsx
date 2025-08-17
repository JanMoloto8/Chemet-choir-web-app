import React from 'react';
import '../css/StatCard.css';

function StatCard({icon = "fas fa-calendar-check", number, label, progress}) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon">
          <i className={icon}></i>
        </div>
        <div className="stat-content">
          <div className="stat-number">{number}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default StatCard;