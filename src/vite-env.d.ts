/// <reference types="vite/client" />

// Declare module for CSV files
declare module '*.csv?raw' {
    const content: string;
    export default content;
  }
  
  // Declare module for regular CSV imports
  declare module '*.csv' {
    const content: string;
    export default content;
  }