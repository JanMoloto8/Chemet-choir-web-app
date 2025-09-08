import React from 'react';
import '../css/ConductorLoading.css'; // Import the CSS file

const ConductorLoading = () => {
  return (
    <div className="conductor-container">
      <div className="text-center">
        <div className="conductor-wrapper">
          <svg
            width="120"
            height="140"
            viewBox="0 0 120 140"
            className="mx-auto"
          >
            {/* Body */}
            <ellipse cx="60" cy="90" rx="20" ry="30" className="body" />

            {/* Head */}
            <circle cx="60" cy="40" r="18" className="head" />

            {/* Left Arm */}
            <g className="conductor-left-arm">
              <line x1="40" y1="70" x2="25" y2="55" className="arm" />
              <circle cx="22" cy="52" r="3" className="hand" />
              <line x1="22" y1="52" x2="15" y2="45" className="baton" />
            </g>

            {/* Right Arm */}
            <g className="conductor-right-arm">
              <line x1="80" y1="70" x2="95" y2="55" className="arm" />
              <circle cx="98" cy="52" r="3" className="hand" />
              <line x1="98" y1="52" x2="105" y2="45" className="baton" />
            </g>

            {/* Legs */}
            <line x1="50" y1="115" x2="45" y2="135" className="leg" />
            <line x1="70" y1="115" x2="75" y2="135" className="leg" />

            {/* Musical Notes */}
            <g className="musical-notes">
              <text x="10" y="25" className="note note-1">♪</text>
              <text x="100" y="30" className="note note-2">♫</text>
              <text x="15" y="100" className="note note-3">♪</text>
              <text x="95" y="105" className="note note-4">♬</text>
            </g>
          </svg>
        </div>

        <div className="loading-info">
        <h2 className="loading-text">Preparing Your Choir Experience...</h2>

        <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
        </div>

        <div className="progress-wrapper">
            <div className="progress-bar">
            <div className="loading-bar"></div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ConductorLoading;
