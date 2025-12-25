# Epsilon Project

A comprehensive ad analysis and enhancement platform with persona management capabilities.

## Project Overview

This application provides tools for analyzing and enhancing advertisements while considering target personas. It features a React/TypeScript frontend and a Node.js backend, offering functionalities like ad analysis, persona management, and ad enhancement.

## Architecture

### Frontend (src/)
- Built with React + TypeScript + Vite
- Uses Tailwind CSS for styling
- Implements authentication and protected routes
- Features modular components and custom hooks

### Backend (backend/)
- Node.js server with Express
- Middleware for authentication and validation
- Specialized services for ad analysis and enhancement
- Supabase integration for data persistence

## Key Features

1. **Authentication System**
   - User signup and login
   - Protected routes
   - Role-based access control

2. **Ad Analysis**
   - Text ad analysis
   - Video ad analysis
   - Performance metrics and reports

3. **Persona Management**
   - Create and manage target personas
   - Persona-based ad evaluation
   - Persona insights

4. **Ad Enhancement**
   - AI-powered ad improvement suggestions
   - Content optimization
   - Target audience alignment

## API Routes

### Authentication
- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - User login
- `GET /auth/status` - Check authentication status

### Personas
- `GET /personas` - Get all personas
- `POST /personas` - Create new persona
- `PUT /personas/:id` - Update persona
- `DELETE /personas/:id` - Delete persona

### Ad Analysis
- `POST /analysis/text` - Analyze text advertisements
- `POST /analysis/video` - Analyze video advertisements
- `GET /analysis/history` - Get analysis history
- `GET /analysis/:id` - Get specific analysis details

### Ad Enhancement
- `POST /enhance/text` - Get enhancement suggestions for text ads
- `POST /enhance/video` - Get enhancement suggestions for video ads

## Core Components

### Frontend Components
- `AdTypeSelector` - Toggle between text and video ad analysis
- `PersonaDisplay` - Shows persona information and insights
- `ResultsDisplay` - Displays analysis results
- `TextAdInput`/`VideoUpload` - Input components for different ad types
- `PersonaInput` - Persona creation and management interface

### Backend Services
- `enhancer.js` - Provides ad enhancement suggestions
- `evaluator.js` - Core ad evaluation logic
- `persona.js` - Manages persona-related operations
- `textEvaluator.js` - Specialized text ad analysis
- `videoEvaluator.js` - Specialized video ad analysis

## Working Flow

1. **User Authentication**
   - Users must sign up/login to access the system
   - Authentication state is managed via `authStore`
   - Protected routes ensure secure access

2. **Persona Creation**
   - Users can create and manage target personas
   - Personas include demographic and psychographic data
   - Stored in Supabase database

3. **Ad Analysis Process**
   - User selects ad type (text/video)
   - Uploads or inputs ad content
   - Selects target persona(s)
   - System analyzes ad against persona criteria
   - Results displayed with enhancement suggestions

4. **Analysis Reports**
   - Detailed analysis stored in history
   - Exportable reports
   - Historical performance tracking

## Technical Stack

- Frontend:
  - React 18+
  - TypeScript
  - Vite
  - Tailwind CSS
  - Zustand (State Management)

- Backend:
  - Node.js
  - Express
  - Supabase
  - Various AI/ML services for analysis

## Getting Started

1. **Install Dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

2. **Environment Setup**
   - Create `.env` files in both root and backend directories
   - Configure necessary environment variables

3. **Run Development Servers**
   ```bash
   # Frontend
   npm run dev

   # Backend
   cd backend
   npm run dev
   ```
