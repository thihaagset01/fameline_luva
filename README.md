# Luva 🏗️

AI-powered louver selection and specification system for architects, consultants, and engineers.

**From months to hours** - streamline your louver specification process with intelligent recommendations from Fameline APSG's comprehensive product database and location-specific weather data.

## ✨ Features

- **🤖 AI-Powered Recommendations** - Smart matching algorithm analyzes your project requirements
- **🌦️ Weather Data Integration** - Location-specific climate analysis for optimal louver selection
- **📱 Modern Interface** - Beautiful, responsive design matching Figma specifications
- **⚡ 6-Step Wizard** - Guided workflow from user info to final specifications
- **🎨 Real-time Visualization** - Dynamic louver previews with aesthetic customization
- **📊 Performance Analysis** - Detailed airflow, rain defense, and acoustic ratings
- **📄 PDF Export** - Professional specification documents (coming soon)
- **🏢 12 Louver Models** - Complete Fameline product database integration

## 🚀 Quick Start

```bash
# Install frontend dependencies
npm install

# Start frontend development server
npm run dev

# Build frontend for production
npm run build

# Preview frontend production build
npm run preview

# Install backend dependencies
pip install -r requirements.txt

# Start weather API server
python weather_api.py
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Flask API for weather data processing
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Data Processing**: PapaParse for CSV handling
- **AI Engine**: Custom recommendation algorithm
- **Weather Data**: Google Earth Engine integration

## 📁 Project Structure

```
├── src/                # Frontend React application
│   ├── components/     # Reusable UI components
│   │   ├── Header.tsx  # Navigation and progress
│   │   ├── NavigationButton.tsx
│   │   └── inputs/     # Form input components
│   ├── pages/          # Wizard step components
│   │   ├── UserInfoStep.tsx
│   │   ├── LocationStep.tsx
│   │   ├── ProjectContextStep.tsx
│   │   ├── AestheticsStep.tsx
│   │   ├── RecommendationStep.tsx
│   │   └── SummaryStep.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useFormData.ts  # Form state management
│   ├── data/           # Data layer
│   │   ├── louverdata.csv  # Product database
│   │   └── louverDatabase.ts # Data processing
│   ├── engine/         # AI recommendation engine
│   │   ├── recommendationEngine.ts
│   │   └── calculator.ts
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Constants and utilities
│   └── App.tsx         # Main application
├── weather_api.py      # Flask API for weather data
├── requirements.txt    # Python dependencies
└── .env               # Environment variables
```

## 🧠 How It Works

### 1. Data Collection (Steps 1-4)
- **User Information**: Name and email for contact
- **Location**: Project location and environment type
- **Project Context**: Building type, height, and primary purpose
- **Aesthetics**: Visual preferences and customization options

### 2. AI Analysis (Step 5)
The recommendation engine analyzes:
- Environmental factors (coastal, urban, industrial, suburban)
- Building requirements (type, height, exposure)
- Performance needs (ventilation, weather protection, acoustics)
- Aesthetic preferences (mullion visibility, blade orientation)
- Location-specific weather data (temperature, rainfall, wind speed/direction)

### 3. Smart Matching
Weighted scoring algorithm considers:
- **Environment compatibility** (15% weight)
- **Purpose alignment** (20% weight) 
- **Building type suitability** (15% weight)
- **Height requirements** (10% weight)
- **Rain defense performance** (20% weight)
- **Airflow efficiency** (15% weight)
- **Weather data analysis** (5% weight)

### 4. Results & Follow-up (Step 6)
- AI confidence score and reasoning
- Detailed product specifications
- Alternative recommendations
- Technical team follow-up within 2-5 business days

## 📊 Louver Database

Currently includes 12 Fameline louver models:

**Performance Series:**
- PL-1050, PL-1075 (Single Bank)
- PL-2050, PL-2075, PL-2170, PL-2150V, PL-2250, PL-2250V (Double Bank)
- PL-3050, PL-3075 (Triple Bank)

**Acoustic Series:**
- AC-150 (Single Bank Acoustic)
- AC-300 (Double Bank Acoustic)

Each model includes:
- Performance ratings at 8 different velocities (0.0-3.5 m/s)
- Airflow coefficients and classifications
- Rain defense and airflow ratings
- Physical specifications (pitch, depth, blade configuration)

## 🎨 Design System

### Colors
- **Primary**: Emerald green (#10B981, #34D399)
- **Background**: Dark gradient (Gray-900 → Emerald-900 → Black)
- **Accent**: Orange (#F97316) for Fameline branding

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)

### Components
- **Glass Effect**: Backdrop blur with subtle transparency
- **Progress Dots**: Circular indicators with checkmarks
- **Toggle Buttons**: Visual state management for preferences
- **Gradient Orbs**: 3D-style visualizations

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Or connect your GitHub repo to Vercel dashboard
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
```

### GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

## 🔧 Configuration

### Environment Variables
```env
# Frontend (Optional)
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn

# Backend (Weather API)
FLASK_PORT=5000
FLASK_HOST=0.0.0.0
FLASK_DEBUG=1
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
EE_PROJECT_ID=your_earth_engine_project_id
```

### Vite Configuration
Path aliases are configured for clean imports:
```typescript
import { Component } from '@/components/Component'
import { useHook } from '@/hooks/useHook'
import { type } from '@/types'
```

## 📈 Performance

- **Bundle Size**: ~500KB gzipped
- **First Contentful Paint**: <1.5s
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Mobile Responsive**: Fully optimized for mobile devices
