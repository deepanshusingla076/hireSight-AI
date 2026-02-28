# 🎨 Frontend Documentation

## Overview

The HireSight AI frontend is a modern, responsive web application built with Next.js 16, TypeScript, and Tailwind CSS. It features a premium glassmorphism design with smooth animations and intuitive user experience.

## 🏗️ Architecture

```
Next.js App Router (TypeScript)
├── Pages (App Router)
├── Components (Reusable UI)
├── API Clients (Axios)
├── Styling (Tailwind CSS)
└── Animations (Framer Motion)
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── upload/
│   │   └── page.tsx          # Resume upload page
│   ├── results/
│   │   └── page.tsx          # Analysis results page
│   ├── test/
│   │   └── page.tsx          # Testing dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx        # Custom button component
│   │   ├── Card.tsx          # Card component
│   │   └── Input.tsx         # Input component
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Footer component
│   ├── ScoreCard.tsx         # Score display card
│   ├── SkillBadge.tsx        # Skill badge component
│   └── InsightsPanel.tsx     # AI insights display
│
├── lib/
│   ├── api.ts                # Main API client
│   ├── dataset.ts            # Dataset API client
│   └── utils.ts              # Utility functions
│
├── public/
│   ├── icons/                # Icon assets
│   └── images/               # Image assets
│
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Visit: `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## 📄 Pages

### Landing Page (`/`)

**Features:**
- Hero section with gradient background
- Feature highlights
- Call-to-action buttons
- Smooth scroll animations

**Components Used:**
- Header
- Footer
- Button
- Card

### Upload Page (`/upload`)

**Features:**
- Drag-and-drop resume upload
- PDF file validation
- Job description input (textarea)
- Random job generator button
- Real-time validation
- Loading states
- Error handling

**Key Functions:**
```typescript
const handleUpload = async (file: File, jobDesc: string) => {
  setLoading(true);
  try {
    const result = await analyzeResume(file, jobDesc);
    router.push(`/results?data=${encodeURIComponent(JSON.stringify(result))}`);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Results Page (`/results`)

**Features:**
- Match score visualization (animated circular progress)
- Fit score and overall score
- Skills breakdown with badges
- Matched vs. missing skills
- AI insights and recommendations
- Interview questions
- Action buttons (New Analysis, Download Report)

**Components:**
- ScoreCard (animated score display)
- SkillBadge (color-coded skill tags)
- InsightsPanel (AI recommendations)

### Testing Dashboard (`/test`)

**Features:**
- System status checker
- Dataset statistics
- Random job generator
- Job search interface
- Category browser
- Quick action buttons

## 🎨 Design System

### Colors

```javascript
// Tailwind color palette
colors: {
  primary: {
    light: '#667eea',
    DEFAULT: '#5a67d8',
    dark: '#4c51bf',
  },
  accent: {
    light: '#f687b3',
    DEFAULT: '#ed64a6',
    dark: '#d53f8c',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.05)',
    dark: 'rgba(0, 0, 0, 0.1)',
  }
}
```

### Typography

```css
/* Headings */
.heading-1 { @apply text-5xl font-bold; }
.heading-2 { @apply text-4xl font-semibold; }
.heading-3 { @apply text-3xl font-semibold; }

/* Body */
.body-large { @apply text-lg; }
.body-normal { @apply text-base; }
.body-small { @apply text-sm; }
```

### Glassmorphism

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 🎭 Components

### Button Component

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  ...props 
}) => {
  // Component implementation
};
```

### ScoreCard Component

```typescript
interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  color?: string;
  icon?: React.ReactNode;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore = 100,
  color = 'blue',
  icon
}) => {
  // Animated circular progress with score
};
```

### SkillBadge Component

```typescript
interface SkillBadgeProps {
  skill: string;
  matched?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  matched = false,
  size = 'md'
}) => {
  // Color-coded badge with icon
};
```

## 🔌 API Integration

### Main API Client (`lib/api.ts`)

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeResume = async (file: File, jobDescription: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const parseResume = async (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/api/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};
```

### Dataset API Client (`lib/dataset.ts`)

```typescript
const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL;

export const getRandomJob = async () => {
  const response = await axios.get(`${ML_SERVICE_URL}/dataset/random-job`);
  return response.data;
};

export const searchJobs = async (keywords: string[], limit?: number) => {
  const response = await axios.post(`${ML_SERVICE_URL}/dataset/search-jobs`, {
    keywords,
    limit,
  });
  return response.data;
};

export const getDatasetStats = async () => {
  const response = await axios.get(`${ML_SERVICE_URL}/dataset/stats`);
  return response.data;
};
```

## ✨ Animations

### Framer Motion Examples

**Fade In:**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Slide In:**
```typescript
<motion.div
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Stagger Children:**
```typescript
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div variants={childVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📱 Responsive Design

### Breakpoints

```javascript
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Mobile-First Approach

```tsx
<div className="
  w-full           /* Mobile: full width */
  md:w-1/2         /* Tablet: half width */
  lg:w-1/3         /* Desktop: third width */
  px-4             /* Mobile: padding */
  md:px-8          /* Tablet: more padding */
">
  Content
</div>
```

## 🔍 State Management

### Using React Hooks

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<AnalysisResult | null>(null);

useEffect(() => {
  // Fetch data on mount
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await fetchData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## 🧪 Testing

### Component Testing

```bash
npm run test
```

### E2E Testing

```bash
npm run test:e2e
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "^16.1.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.7.3",
  "axios": "^1.7.9",
  "framer-motion": "^11.14.7",
  "lucide-react": "^0.469.0"
}
```

### Dev Dependencies
```json
{
  "tailwindcss": "^3.4.17",
  "postcss": "^8.4.49",
  "autoprefixer": "^10.4.20",
  "@types/node": "^22.10.2",
  "@types/react": "^19.0.6",
  "@types/react-dom": "^19.0.2"
}
```

## 🎯 Best Practices

### Code Organization
- One component per file
- Use TypeScript interfaces
- Keep components small and focused
- Extract reusable logic to hooks
- Use meaningful variable names

### Performance
- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Lazy load off-screen content
- Minimize bundle size

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Provide alt text for images

## 🐛 Common Issues

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### TypeScript Errors
```bash
# Regenerate types
npm run type-check
```

### Styling Issues
```bash
# Rebuild Tailwind
npm run dev
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Build
```bash
npm run build
npm start
```

### Environment Variables
Set in deployment platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ML_SERVICE_URL`

## 📈 Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
  priority
/>
```

### Code Splitting
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

## 📞 Support

For frontend-specific issues:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check environment variables
4. Clear cache and rebuild

---

**Frontend by HireSight AI Team**
*Last Updated: March 2026*
