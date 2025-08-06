import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/data': resolve(__dirname, './src/data'),
      '@/engine': resolve(__dirname, './src/engine'),
      '@/types': resolve(__dirname, './src/types'),
      '@/utils': resolve(__dirname, './src/utils')
    }
  },
  base: './', // Ensure relative paths work on Railway
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          utils: ['papaparse']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0', // Important for Railway
    port: parseInt(process.env.PORT || '3000')
  },
  preview: {
    host: '0.0.0.0', // Important for Railway preview
    port: parseInt(process.env.PORT || '3001')
  }
})