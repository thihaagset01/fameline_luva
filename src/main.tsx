/**
 * 🚀 Main Application Entry Point
 * 
 * This is the entry point for the LouverBoy application. It sets up React and renders
 * the root App component into the DOM.
 * 
 * Key responsibilities:
 * - Import necessary dependencies (React, ReactDOM)
 * - Import the main App component
 * - Import global styles from index.css
 * - Create a React root and render the App within StrictMode
 * 
 * StrictMode enables additional development-only checks for potential problems
 * including identifying unsafe lifecycles, legacy API usage, and ensuring
 * reusable state behaviors.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a React root and render the application
// The '!' asserts that the 'root' element definitely exists in our HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)