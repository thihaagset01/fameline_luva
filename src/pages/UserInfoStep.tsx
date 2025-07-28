import React, { useState, useEffect } from 'react';
import { StepProps } from '@/types';
import { TextInput } from '@/components/inputs';

/**
 * 👤 UserInfoStep Component
 * 
 * This is the first step in our louver selection wizard! It collects basic user
 * information (name and email) to personalize the experience and enable follow-up
 * communication.
 * 
 * Features:
 * - Simple, welcoming interface with animated orb visual
 * - Collects user's name and email address
 * - Introduces "Luva", our virtual assistant character
 * 
 * This step establishes the friendly, conversational tone of the entire wizard
 * and begins building a relationship with the user.
 */

export const UserInfoStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  // const [floatingText, setFloatingText] = useState("Hello there!");
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const messages = [
  //     "Built to louver. Made to last.",
  //     "Serious about airflow? We’ve got you louvered.",
  //     "You had me at louver.",
  //     "Keep calm and louver on.",
  //     "Let your building breathe with style.",
  //     "Our louvers don’t just perform — they swooosh past the competition."
  //   ];

  //   const showMessage = (text: string, duration = 5000) => {
  //     setVisible(false);
  //     setTimeout(() => {
  //       setFloatingText(text);
  //       setVisible(true);
  //     }, 500);

  //     setTimeout(() => {
  //       setVisible(false);
  //     }, duration);
  //   };

  //   showMessage("Hello there! My name is Luva.", 5000);

  //   const interval = setTimeout(() => {
  //     setInterval(() => {
  //       const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  //       showMessage(randomMsg);
  //     }, 7800);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="app-container fixed-height-page">
      <div className="content-card">
        <div className="form-side">
          {/* Welcome Message */}
          <div className="welcome-message">
            <h1 className="welcome-name">
              I'm Luva,
            </h1>
          </div>
          
          {/* Form Fields */}
          <div className="form-fields space-y-4">
            {/* Name Input */}
            <TextInput
              label="What is your name?"
              placeholder="E.g. John Doe"
              value={formData.name}
              onChange={(value) => updateFormData('name', value)}
            />
      
            {/* Email Input */}
            <TextInput
              label="What is your email?"
              placeholder="E.g. johndoe@gmail.com"
              value={formData.email}
              onChange={(value) => updateFormData('email', value)}
              type="email"
            />
          </div>
        </div>
        
        
        {/* Orb side */}
        <div className="orb-side">
          <div className="orb startup">
            <div className="orb-pulse"></div>
            <div className="orb-ping"></div>
            <div className="orb-highlight"></div>
            <div className="orb-glow"></div>
            <div className="lava startup"></div>
          {/* <div className="text-container">
            <div className="floating-text" style={{ opacity: visible ? 1 : 0 }}>
              {floatingText} </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};