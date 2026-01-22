# Epsilon - Persona-Based Ad A/B Testing Platform

## Product Design Language (PDL)

### System Overview
Epsilon is an AI-powered platform that enables marketers and advertisers to conduct sophisticated A/B testing of advertisements using dynamically generated user personas. The system leverages Google Gemini AI to create detailed personas and evaluate ad performance across multiple criteria, providing data-driven insights for ad optimization.

### Core Components

#### 1. Authentication & Authorization System
- **Technology**: Supabase Auth with JWT tokens
- **Roles**: Admin (full access), Analyst (analysis + read access)
- **Permissions**: Create, Read, Update, Delete, Analyze, Export
- **Implementation**: Middleware-based authentication with role checking

#### 2. Persona Management System
- **Generation**: AI-powered persona creation using Google Gemini 2.5-flash
- **Attributes**: Demographics, psychographics, behavioral patterns, pain points, goals, communication style
- **Storage**: Supabase PostgreSQL with JSON structure
- **Validation**: Strict schema validation for persona data integrity

#### 3. Ad Evaluation Engine
- **Supported Formats**: Image (JPEG/PNG/WebP), Video (MP4/MOV/AVI/MKV/WebM), Text
- **Evaluation Criteria**:
  - Visual Attention Grab (1-10)
  - Message Clarity (1-10)
  - Emotional Engagement (1-10)
  - Brand Recall (1-10)
  - Health Appeal (1-10)
  - Uniqueness (1-10)
- **AI Model**: Google Gemini 2.5-flash for multimodal analysis

#### 4. Ad Enhancement System
- **Input**: Winning ad performance data + persona insights
- **Output**: Enhanced ad concepts with improvement suggestions
- **Methodology**: Comparative analysis of winning vs. losing elements

#### 5. Analysis Report Management
- **Storage**: Persistent JSON-based reports in Supabase
- **Tracking**: User attribution, timestamps, ad type classification
- **Retrieval**: CRUD operations with filtering and sorting

### Technical Architecture

#### Backend Architecture (Node.js/Express)
```
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Middleware Layer                        │ │
│  │  ┌─────────────┬─────────────┬─────────────────────┐   │ │
│  │  │  CORS       │  JSON       │  Authentication     │   │ │
│  │  │  Handling   │  Parsing    │  & Authorization    │   │ │
│  │  └─────────────┴─────────────┴─────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Service Layer                           │ │
│  │  ┌─────────────┬─────────────┬─────────────────────┐   │ │
│  │  │  Persona    │  Evaluator  │  Supabase Service   │   │ │
│  │  │  Service    │  Services   │                     │   │ │
│  │  └─────────────┴─────────────┴─────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 External Integrations                   │ │
│  │  ┌─────────────┬─────────────┬─────────────────────┐   │ │
│  │  │  Google     │  Supabase   │  File System        │   │ │
│  │  │  Gemini AI  │  Database   │  (Multer)           │   │ │
│  │  └─────────────┴─────────────┴─────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Data Flow Architecture
```
User Request → Authentication → Validation → Service Processing → AI Analysis → Database Storage → Response
```

### API Design Philosophy

#### RESTful Endpoints with Resource-Based URLs
- `/api/personas` - Persona CRUD operations
- `/api/analysis-reports` - Report management
- `/evaluate-*` - Ad evaluation endpoints
- `/api/enhance-ad` - Ad improvement suggestions

#### Request/Response Patterns
- **Authentication**: Bearer token in Authorization header
- **File Uploads**: Multipart/form-data with Multer processing
- **Responses**: JSON with consistent error handling
- **Validation**: Middleware-based input validation

### Security Design

#### Authentication Flow
```
Client → JWT Token → Supabase Verification → User Profile Fetch → Permission Check → Resource Access
```

#### File Upload Security
- **Size Limits**: 5MB (images), 100MB (videos)
- **Type Validation**: Strict MIME type checking
- **Storage**: Local filesystem with organized directory structure
- **Access Control**: Authenticated users only

### AI Integration Patterns

#### Persona Generation
```javascript
// Input: Natural language description
// Output: Structured JSON persona
// Model: gemini-2.5-flash
// Validation: Schema enforcement
```

#### Ad Evaluation
```javascript
// Input: Persona + Ad files/content
// Output: Criteria-based scoring with explanations
// Model: gemini-2.5-flash
// Processing: Multimodal (text, image, video)
```

#### Ad Enhancement
```javascript
// Input: Performance data + persona insights
// Output: Improved ad concepts
// Methodology: Comparative analysis + creative synthesis
```

## Use Case Diagram Analysis

### Primary Actors
1. **Admin User**
   - Full system access
   - User management capabilities
   - System configuration

2. **Analyst User**
   - Ad analysis and testing
   - Persona management
   - Report generation

3. **System (AI Components)**
   - Google Gemini AI
   - Supabase services

### Core Use Cases

#### Persona Management Use Case
**Actor**: Analyst/Admin
**Preconditions**: User authenticated
**Main Flow**:
1. User provides persona description
2. System validates input (length, format)
3. AI generates detailed persona structure
4. System stores persona in database
5. User receives confirmation

**Alternative Flows**:
- Invalid input → Validation error returned
- AI generation failure → Error handling with retry

#### Ad Evaluation Use Case
**Actor**: Analyst/Admin
**Preconditions**: User authenticated, persona exists
**Main Flow**:
1. User selects persona
2. User uploads two ad variants (A/B)
3. System validates file types and sizes
4. AI analyzes both ads against persona
5. System generates comparative report
6. User receives detailed scoring and recommendations

**Alternative Flows**:
- File validation failure → Error with specific requirements
- AI analysis timeout → Graceful error handling

#### Ad Enhancement Use Case
**Actor**: Analyst/Admin
**Preconditions**: Analysis report exists
**Main Flow**:
1. User selects analysis report
2. User chooses ad to enhance
3. System retrieves persona and performance data
4. AI generates enhancement suggestions
5. User receives improved ad concepts

### Use Case Relationships

#### Include Relationships
- **Authentication** included in all user-facing use cases
- **File Validation** included in upload use cases
- **AI Processing** included in analysis and enhancement use cases

#### Extend Relationships
- **Error Handling** extends all use cases
- **Permission Checking** extends role-restricted operations

### System Boundary
The use case diagram shows clear boundaries between:
- User interactions (frontend)
- API layer (backend endpoints)
- Service layer (business logic)
- External services (AI, database)

## Class Diagram Analysis

### Core Classes

#### Authentication Classes
```javascript
class AuthMiddleware {
  - supabase: SupabaseClient
  + authenticateUser(req, res, next)
  + requirePermission(permission): Middleware
  + requireRole(role): Middleware
}
```

#### Validation Classes
```javascript
class ValidationMiddleware {
  + validatePersonaRequest(req, res, next)
  + validateAdUpload(req, res, next)
  + validateVideoUpload(req, res, next)
  + validateTextAds(req, res, next)
}
```

#### Service Classes
```javascript
class PersonaService {
  - genAI: GoogleGenerativeAI
  + generatePersona(prompt): Promise<Persona>
}

class EvaluatorService {
  - genAI: GoogleGenerativeAI
  + evaluateAds(persona, adAPath, adBPath): Promise<Evaluation>
}

class VideoEvaluatorService {
  - genAI: GoogleGenerativeAI
  + evaluateVideoAds(persona, adAVideoPath, adBVideoPath): Promise<Evaluation>
}

class TextEvaluatorService {
  - genAI: GoogleGenerativeAI
  + evaluateTextAds(persona, adAText, adBText): Promise<Evaluation>
}

class EnhancerService {
  - genAI: GoogleGenerativeAI
  + enhanceAd(persona, report, adToEnhance): Promise<Enhancement>
}

class SupabaseService {
  - supabase: SupabaseClient
  + personaService: PersonaService
  + analysisService: AnalysisService
}
```

#### Data Model Classes
```javascript
class Persona {
  + id: UUID
  + name: string
  + age: number
  + gender: string
  + interests: string[]
  + preferred_colors: string[]
  + tone_preference: string
  + personality_traits: string[]
  + food_preferences: string[]
  + description: string
  + created_by: UUID
  + created_at: Date
  + updated_at: Date
}

class AnalysisReport {
  + id: UUID
  + persona_id: UUID
  + ad_type: string
  + ad_a_scores: JSON
  + ad_b_scores: JSON
  + overall_comparison: JSON
  + created_by: UUID
  + created_at: Date
}

class UserProfile {
  + id: UUID
  + role: string
  + created_at: Date
  + updated_at: Date
}
```

### Class Relationships

#### Inheritance
- All evaluator services inherit from a common base evaluation pattern
- Middleware classes follow Express.js middleware interface

#### Composition
- `SupabaseService` composes `PersonaService` and `AnalysisService`
- `Server` composes all middleware and services

#### Dependencies
- All AI services depend on `GoogleGenerativeAI`
- All database operations depend on `SupabaseClient`
- Authentication middleware depends on user profile data

### Interface Design

#### Service Interfaces
```typescript
interface IEvaluator {
  evaluate(persona: Persona, adA: any, adB: any): Promise<Evaluation>;
}

interface IPersonaService {
  create(personaData: Partial<Persona>): Promise<Persona>;
  getAll(): Promise<Persona[]>;
  getById(id: string): Promise<Persona>;
  update(id: string, updates: Partial<Persona>): Promise<Persona>;
  delete(id: string): Promise<void>;
}
```

#### Design Patterns Implemented

##### Middleware Pattern
- Authentication and validation middleware
- Request/response processing pipeline

##### Service Layer Pattern
- Separation of business logic from controllers
- Dependency injection for external services

##### Repository Pattern
- Supabase services abstract database operations
- Consistent CRUD interface across entities

##### Strategy Pattern
- Different evaluation strategies for different ad types
- AI model abstraction for future extensibility

## Implementation Details

### Error Handling Strategy
- **Validation Errors**: 400 status with descriptive messages
- **Authentication Errors**: 401 status for invalid/missing tokens
- **Authorization Errors**: 403 status for insufficient permissions
- **Server Errors**: 500 status with generic messages (detailed logging)

### File Management
- **Upload Directory**: `backend/uploads/`
- **Naming Convention**: `{fieldname}_{timestamp}{extension}`
- **Cleanup**: Manual cleanup required (no automatic deletion implemented)

### AI Integration Details
- **Model**: Google Gemini 2.5-flash for all AI operations
- **Rate Limiting**: Not implemented (rely on API quotas)
- **Error Handling**: Retry logic not implemented
- **Cost Optimization**: Single API calls per operation

### Database Design
- **Primary Keys**: UUID for all entities
- **Relationships**: Foreign keys with cascade operations
- **Indexing**: Created automatically by Supabase
- **JSON Storage**: Flexible schema for complex evaluation data

### Security Measures
- **CORS**: Configured for specific origins
- **Input Validation**: Comprehensive validation middleware
- **File Type Checking**: Strict MIME type validation
- **Authentication**: JWT-based with Supabase
- **Authorization**: Role-based permissions system

## Performance Considerations

### Current Limitations
- **Sequential Processing**: AI calls are synchronous
- **Memory Usage**: Large video files loaded entirely into memory
- **Database Queries**: No advanced indexing or caching
- **File Storage**: Local filesystem (not scalable)

### Scalability Improvements Needed
- **Async Processing**: Queue system for AI operations
- **File Storage**: Cloud storage (AWS S3, Supabase Storage)
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Multiple server instances

## Testing Strategy

### Unit Testing
- Service layer functions
- Middleware validation logic
- Utility functions

### Integration Testing
- API endpoints
- Database operations
- AI service integrations

### End-to-End Testing
- Complete user workflows
- File upload and processing
- Authentication flows

## Deployment Architecture

### Current Setup
- **Single Server**: Node.js application
- **Database**: Supabase (managed PostgreSQL)
- **File Storage**: Local filesystem
- **Environment**: Single environment configuration

### Production Requirements
- **Containerization**: Docker for consistent deployment
- **Orchestration**: Kubernetes for scaling
- **CDN**: For static file serving
- **Monitoring**: Application performance monitoring
- **Backup**: Database and file backups

## Future Roadmap

### Phase 1: Performance Optimization
- Implement async processing queue
- Add Redis caching layer
- Migrate to cloud file storage

### Phase 2: Advanced Features
- Batch processing for multiple ad variants
- Real-time collaboration features
- Advanced analytics dashboard

### Phase 3: Enterprise Features
- Multi-tenant architecture
- Custom evaluation criteria
- Integration with ad platforms

### Phase 4: AI Enhancements
- Fine-tuned models for specific industries
- Real user data integration
- Predictive performance analytics

---

## Features
- **Persona Generation**: AI-powered creation of detailed user personas based on descriptions
- **Multi-format Ad Testing**: Support for image, video, and text advertisements
- **Comprehensive Analysis**: Detailed scoring across multiple criteria including visual attention, message clarity, emotional engagement, brand recall, health appeal, and uniqueness
- **Ad Enhancement**: AI-generated suggestions for improving underperforming ads
- **User Management**: Role-based access control with admin and analyst permissions
- **Analysis History**: Persistent storage and retrieval of all analysis reports

## Technology Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: Google Gemini AI for persona generation and ad analysis
- **Authentication**: Supabase Auth
- **File Storage**: Local file system with Multer for uploads

## Architecture
The application follows a client-server architecture with the following components:

### Backend Components
- **Server (server.js)**: Main Express.js server handling API routes and middleware
- **Authentication Middleware (middleware/auth.js)**: JWT token verification and role-based permissions
- **Validation Middleware (middleware/validation.js)**: Request validation for different endpoints
- **Persona Service (services/persona.js)**: AI-powered persona generation using Google Gemini
- **Evaluator Services**:
  - Image ads (services/evaluator.js)
  - Video ads (services/videoEvaluator.js)
  - Text ads (services/textEvaluator.js)
- **Enhancer Service (services/enhancer.js)**: AI-powered ad improvement suggestions
- **Supabase Service (services/supabase.js)**: Database operations for personas and analysis reports

### Frontend Components
- **Authentication**: Login/signup pages with Supabase Auth integration
- **Dashboard**: Overview of analysis history and quick actions
- **Persona Management**: CRUD operations for user personas
- **Ad Analysis**: Multi-step workflow for uploading ads and viewing results
- **Results Display**: Detailed comparison of ad performance with scores and explanations

## API Endpoints

### Authentication Required Endpoints
All endpoints except `/health` require authentication via Bearer token.

### Persona Management
- `GET /api/personas` - Get all personas (read permission required)
- `GET /api/personas/:id` - Get specific persona (read permission required)
- `POST /api/personas` - Create new persona (create permission required)
- `PUT /api/personas/:id` - Update persona (update permission required)
- `DELETE /api/personas/:id` - Delete persona (delete permission required)

### Analysis Reports
- `GET /api/analysis-reports` - Get all reports (read permission required)
- `GET /api/analysis-reports/:id` - Get specific report (read permission required)
- `POST /api/analysis-reports` - Create new report (create permission required)
- `DELETE /api/analysis-reports/:id` - Delete report (delete permission required)

### Ad Evaluation
- `POST /evaluate-ads` - Evaluate image ads (analyze permission required)
- `POST /evaluate-video-ads` - Evaluate video ads (analyze permission required)
- `POST /evaluate-text-ads` - Evaluate text ads (analyze permission required)
- `POST /api/enhance-ad` - Generate enhanced ad suggestions (analyze permission required)

### Utility
- `GET /health` - Health check endpoint
- `GET /` - Basic API information

## Database Schema

### Personas Table
```sql
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  interests TEXT[],
  preferred_colors TEXT[],
  tone_preference TEXT,
  personality_traits TEXT[],
  food_preferences TEXT[],
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Analysis Reports Table
```sql
CREATE TABLE analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID REFERENCES personas(id),
  ad_type TEXT NOT NULL, -- 'image', 'video', or 'text'
  ad_a_scores JSONB,
  ad_b_scores JSONB,
  overall_comparison JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Profiles Table (Supabase Auth)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Roles and Permissions

### Admin Role
- Full access to all features
- Can manage personas and analysis reports
- Can perform ad analysis and enhancement

### Analyst Role
- Can create and read personas
- Can perform ad analysis and view results
- Cannot delete or modify existing data
- Cannot access admin-only features

## Environment Variables

### Required
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key for client-side operations
- `SUPABASE_SERVICE_KEY`: Supabase service key for server-side operations
- `GOOGLE_API_KEY`: Google Gemini AI API key
- `PORT`: Server port (optional, defaults to 8000)

## Installation and Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in required variables
4. Start the server: `npm run dev` for development or `npm start` for production

## Usage Workflow

1. **Authentication**: User logs in via Supabase Auth
2. **Persona Creation**: User creates or selects a target persona
3. **Ad Upload**: User uploads two ad variants (A/B)
4. **Analysis**: AI analyzes both ads against the persona
5. **Results**: User receives detailed comparison with scores
6. **Enhancement**: User can request AI suggestions to improve the winning ad

## Future Enhancements

- Real-time collaboration features
- Advanced analytics and reporting
- Integration with ad platforms (Google Ads, Facebook Ads)
- Batch processing for multiple ad variants
- Custom evaluation criteria
- A/B testing with real user data
