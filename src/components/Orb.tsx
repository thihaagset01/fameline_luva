import React from 'react';
import './Orb.css';

export const Orb: React.FC<{ size?: string }> = ({ size = '6rem' }) => {
  return (
    <div className="orb" style={{ width: size, height: size }}>
      <div className="orb-pulse"></div>
      <div className="orb-ping"></div>
      <div className="orb-highlight"></div>
      <div className="orb-glow"></div>
      <div className="lava"></div>
    </div>
  );
};