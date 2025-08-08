"# PersonaFlux - AI-Powered NPC Character Creator

> 🎮 A Next.js application for creating dynamic NPCs with AI-generated dialogue and interactive storytelling capabilities.

## 🎯 Project Overview

PersonaFlux is a modern web application that allows users to create, customize, and interact with AI-powered NPCs (Non-Player Characters) for gaming and storytelling purposes. The application leverages Google's Gemini AI to generate dynamic dialogue and story progressions based on character traits and backstories.

### **🌟 Key Highlights**

- **200+ Character Traits** - Extensive personality customization options
- **145+ Languages** - Global accessibility and multilingual support
- **AI-Powered Storytelling** - Dynamic narrative generation using Google Gemini
- **Interactive Gameplay** - Real-time dialogue and branching story paths

## 🏗️ Architecture & Tech Stack

### **Frontend Framework**

- **Next.js 15.4.6** with App Router
- **React 19.1.0** with TypeScript
- **Tailwind CSS 4** for styling
- **Shadcn/UI** component library
- **Framer Motion** for animations

### **Backend & Database**

- **Supabase** for authentication and database
- **PostgreSQL** via Supabase
- **Google Generative AI (Gemini)** for NPC dialogue generation

### **State Management**

- **Zustand** for global state
- **React Hook Form** for form management
- **Zod** for form validation

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   │   └── login/                # Login page with GitHub/Google OAuth
│   ├── api/                      # API routes
│   │   ├── generate/             # Story generation endpoint
│   │   └── generate-npc/         # NPC dialogue generation endpoint
│   ├── auth/                     # Auth callback routes
│   │   ├── callback/             # OAuth callback handler
│   │   └── confirm/              # Email confirmation handler
│   ├── create-character/         # Character creation workflow
│   │   └── _Components/          # Character creation components
│   │       ├── FormOne.tsx       # Basic character details
│   │       └── FormTwo.tsx       # Story context & avatar selection
│   ├── dashboard/                # User dashboard (character management)
│   ├── home/                     # Interactive story game interface
│   │   └── [id]/                 # Character-specific story instances
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn/UI components
│   ├── LoginGithub.tsx           # GitHub OAuth button
│   ├── LoginGoogle.tsx           # Google OAuth button
│   ├── NpcBubble.tsx             # Chat bubble component
│   └── Signout.tsx               # Logout component
├── lib/                          # Utility libraries
│   ├── store.ts                  # Zustand store configuration
│   ├── traitsOptions.ts          # Character trait definitions
│   └── utils.ts                  # General utilities
├── service/                      # API service functions
│   └── service.ts                # Supabase CRUD operations
├── store/                        # State management
│   └── useChar.ts                # Character state store
└── utils/                        # Utility functions
    └── supabase/                 # Supabase configuration
        ├── client.ts             # Client-side Supabase
        ├── middleware.ts         # Middleware configuration
        └── server.ts             # Server-side Supabase
```

## 🎮 Core Features

### **1. Character Creation System**

- **Multi-step form** with validation
- **Default avatar selection** (male1, male2, male3)
- **Custom image upload** with Base64 storage
- **200+ character traits** with predefined options for rich personality development
- **145+ language support** for global accessibility
- **AI-powered story generation** for backstory and context

### **2. Interactive Story Engine**

- **Real-time NPC dialogue** generation via Gemini AI
- **Branching story paths** with user choice options
- **Scene progression** tracking
- **Character personality** reflected in responses
- **Story history** preservation

### **3. Authentication & User Management**

- **OAuth integration** (GitHub, Google)
- **Supabase Auth** with session management
- **User-specific character** storage
- **Protected routes** via middleware

### **4. Database Schema**

```sql
-- Characters table structure
characters (
  id: number (primary key)
  character_name: string
  traits: string[]
  age: number (optional)
  gender: string
  voice_name: string
  no_of_scenes: number
  language: string
  avatar_url: string (nullable) -- Base64 or public URL
  backstory: string (optional)
  story_context: string (optional)
  starting_propt: string (optional) -- Note: intentional typo in schema
  start_options: string[]
  ending_scenes: string[]
  user_email: string
  created_at: timestamp
)

-- Users table structure
User (
  user_id: string (primary key)
  email: string
  username: string
  avatarUrl: string (nullable)
  created_at: timestamp
)
```

## 🔌 API Endpoints

### **POST /api/generate**

Generates character backstory, story context, and initial options using AI.

**Request Body:**

```typescript
{
  character_name: string
  traits: string[]
  age?: number
  gender: string
  language: string
}
```

**Response:**

```typescript
{
  backstory: string
  story_context: string
  starting_propt: string
  start_options: string[]
  ending_scenes: string[]
}
```

### **POST /api/generate-npc**

Generates NPC dialogue and player options for story continuation.

**Request Body:**

```typescript
{
  character_name: string
  age?: number
  gender: string
  traits: string[]
  backstory: string
  story_context: string
  voice_name: string
  language: string
  starting_prompt: string
}
```

**Response:**

```typescript
{
  success: boolean
  npc_dialogue: string[]
  player_options: string[]
  error?: string
}
```

## 🎯 TypeScript Interfaces

### **Character Interface**

```typescript
interface Character {
  id: number;
  character_name: string;
  avatar_url: string | null;
  traits: string[];
  backstory: string;
  story_context: string;
  starting_propt?: string; // Note: matches database schema typo
  start_options: string[];
  no_of_scenes: number;
  language?: string;
}
```

### **Character Form Data**

```typescript
interface CharacterFormData {
  character_name: string;
  traits: string[];
  age?: number | "";
  gender: string;
  voice_name: string;
  no_of_scenes: string;
  language: string;
  avatar?: FileList;
  avatar_url?: string; // For default avatar selection
  backstory?: string;
  story_context?: string;
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
}
```

## 🔄 Data Flow

### **Character Creation Flow**

1. User fills **Step 1** (basic details)
2. User proceeds to **Step 2** (story & avatar)
3. Optional: **AI generation** of story elements
4. **Avatar selection** (default or upload)
5. **Form submission** to Supabase
6. **Redirect** to dashboard

### **Story Interaction Flow**

1. User selects character from dashboard
2. **Game initialization** with character data
3. **AI generates** initial dialogue
4. User **selects response** option
5. **API call** to generate next scene
6. **Story history** updated
7. **Repeat** until scene limit reached

## 🛠️ Development Setup

### **Environment Variables**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### **Installation**

```bash
npm install
npm run dev
```

### **Key Dependencies**

- `@google/generative-ai` - Gemini AI integration
- `@supabase/supabase-js` - Database operations
- `react-hook-form` - Form management
- `zustand` - State management
- `framer-motion` - Animations
- `lucide-react` - Icons
- `jsonrepair` - JSON parsing utilities

### **Character Customization Features**

- **200+ Traits Available** - Comprehensive personality attributes including:
  - Personality traits (brave, shy, cunning, loyal, etc.)
  - Behavioral patterns (aggressive, diplomatic, mysterious, etc.)
  - Skills and abilities (magical, scholarly, athletic, etc.)
  - Social traits (charismatic, introverted, leadership, etc.)
- **145+ Language Support** - Including major world languages:
  - European languages (English, Spanish, French, German, Italian, etc.)
  - Asian languages (Chinese, Japanese, Korean, Hindi, Arabic, etc.)
  - Regional dialects and constructed languages
  - Real-time translation for global accessibility

## 🎨 UI Components

### **Reusable Components**

- **MultiSelect** - Trait selection dropdown
- **NPCBubble** - Animated chat bubble with typewriter effect
- **FormSidebar** - Step progress indicator
- **Avatar Selection Grid** - Default character avatar picker

### **Page Components**

- **LoginPage** - OAuth authentication
- **Dashboard** - Character management grid
- **CharacterForm** - Multi-step character creation
- **StoryGame** - Interactive dialogue interface

## 🔐 Authentication Flow

1. **OAuth redirect** to GitHub/Google
2. **Callback handling** in `/auth/callback`
3. **User record creation** in Supabase
4. **Session management** via middleware
5. **Protected route access** based on auth state

## 🎯 AI Integration

### **Story Generation**

- Uses **Gemini 1.5 Flash** model
- **Character-aware** prompt engineering
- **JSON response** formatting with repair
- **Error handling** for malformed responses

### **Dialogue Generation**

- **Context-aware** conversation continuation
- **Trait-based** personality reflection from 200+ available traits
- **Multilingual support** across 145+ languages
- **Branching options** for user choices
- **Story progression** tracking
- **Cultural adaptation** based on selected language and traits

## 🚀 Deployment Considerations

- **Supabase** handles database and auth
- **Vercel** recommended for Next.js deployment
- **Environment variables** must be configured
- **OAuth callbacks** need proper domain setup
- **Image optimization** for avatar uploads

## 🔧 Troubleshooting

### **Common Issues**

1. **Schema mismatch**: Database uses `starting_propt` (typo)
2. **Avatar paths**: Use `/male/male1/char.png` format
3. **Auth redirects**: Check OAuth callback URLs
4. **API limits**: Monitor Gemini API usage
5. **CORS issues**: Ensure proper Supabase configuration

### **Database Field Mapping**

- Form: `starting_prompt` → Database: `starting_propt`
- Form: `avatar_url` → Database: `avatar_url`
- Form: `user_email` → Database: `user_email`

This README provides comprehensive context for AI assistants to understand the project structure, data flow, and implementation details for effective code assistance."
