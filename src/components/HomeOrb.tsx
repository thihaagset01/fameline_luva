import React from 'react';
import './Orb.css';

export const Orb: React.FC<{ size?: string }> = ({ size = '6rem' }) => {
  return (
    <div className="home-orb-container" style={{ width: size, height: size }}>
      <div className="home-orb">
        <div className="home-orb-pulse"></div>
        <div className="home-orb-ping"></div>
        <div className="home-orb-highlight"></div>
        <div className="home-orb-glow"></div>
        <div className="home-lava"></div>
      </div>
    </div>
  );
};