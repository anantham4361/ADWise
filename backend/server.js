import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

import { generatePersona } from './services/persona.js';
import { evaluateAds } from './services/evaluator.js';
import { evaluateVideoAds } from './services/videoEvaluator.js';
import { evaluateTextAds } from './services/textEvaluator.js';
import * as enhancer from './services/enhancer.js';
import { personaService, analysisService } from './services/supabase.js';
import { validatePersonaRequest, validateAdUpload, validateVideoUpload, validateTextAds } from './middleware/validation.js';
import { authenticateUser, requirePermission, requireRole } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fieldName = file.fieldname;
    const extension = path.extname(file.originalname);
    cb(null, `${fieldName}_${timestamp}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP images and MP4, MOV, AVI, MKV, WebM videos are allowed'), false);
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Persona-Based Ad A/B Testing API is running!' });
});

// Health check endpoint for frontend status monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active', timestamp: new Date().toISOString() });
});

// Persona management endpoints
app.get('/api/personas', authenticateUser, requirePermission('read'), async (req, res) => {
  try {
    const personas = await personaService.getAll();
    res.json(personas);
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({ detail: `Failed to fetch personas: ${error.message}` });
  }
});

app.post('/api/personas', authenticateUser, requirePermission('create'), validatePersonaRequest, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Generate persona using AI
    const generatedPersona = await generatePersona(prompt);
    
    // Save to database
    const savedPersona = await personaService.create({
      ...generatedPersona,
      description: prompt, // Keep original prompt as description
      created_by: req.user?.id // Track who created it
    });
    
    res.json(savedPersona);
  } catch (error) {
    console.error('Error creating persona:', error);
    res.status(500).json({ detail: `Failed to create persona: ${error.message}` });
  }
});

app.put('/api/personas/:id', authenticateUser, requirePermission('update'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedPersona = await personaService.update(id, updates);
    res.json(updatedPersona);
  } catch (error) {
    console.error('Error updating persona:', error);
    res.status(500).json({ detail: `Failed to update persona: ${error.message}` });
  }
});

app.delete('/api/personas/:id', authenticateUser, requirePermission('delete'), async (req, res) => {
  try {
    const { id } = req.params;
    await personaService.delete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting persona:', error);
    res.status(500).json({ detail: `Failed to delete persona: ${error.message}` });
  }
});

// Analysis report endpoints
app.get('/api/analysis-reports', authenticateUser, requirePermission('read'), async (req, res) => {
  try {
    const reports = await analysisService.getAll();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching analysis reports:', error);
    res.status(500).json({ detail: `Failed to fetch analysis reports: ${error.message}` });
  }
});

// api to fetch a specific analysis report
app.get('/api/analysis-reports/:id', authenticateUser, requirePermission('read'), async (req, res) => {
  try {
    const { id } = req.params;
    const report = await analysisService.getById(id);
    if (!report) {
      return res.status(404).json({ detail: 'Analysis report not found' });
    }
    res.json(report);
    console.log(`Fetched analysis report with ID: ${id}`);
  } catch (error) {
    console.error('Error fetching analysis report:', error);
    res.status(500).json({ detail: `Failed to fetch analysis report: ${error.message}` });
  }
});

app.post('/api/analysis-reports', authenticateUser, requirePermission('create'), async (req, res) => {
  try {
    const reportData = req.body;
    const savedReport = await analysisService.create({
      ...reportData,
      created_by: req.user?.id // Track who created it
    });
    res.json(savedReport);
  } catch (error) {
    console.error('Error saving analysis report:', error);
    res.status(500).json({ detail: `Failed to save analysis report: ${error.message}` });
  }
});

app.delete('/api/analysis-reports/:id', authenticateUser, requirePermission('delete'), async (req, res) => {
  try {
    const { id } = req.params;
    await analysisService.delete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting analysis report:', error);
    res.status(500).json({ detail: `Failed to delete analysis report: ${error.message}` });
  }
});

app.post('/generate-persona', authenticateUser, requirePermission('analyze'), validatePersonaRequest, async (req, res) => {
  try {
    const { prompt } = req.body;
    const persona = await generatePersona(prompt);
    res.json({ persona });
  } catch (error) {
    console.error('Error generating persona:', error);
    res.status(500).json({ 
      detail: `Failed to generate persona: ${error.message}` 
    });
  }
});

// Image ads evaluation
app.post('/evaluate-ads', 
  authenticateUser,
  requirePermission('analyze'),
  upload.fields([
    { name: 'ad_a', maxCount: 1 },
    { name: 'ad_b', maxCount: 1 }
  ]),
  validateAdUpload,
  async (req, res) => {
    try {
      const { persona_prompt } = req.body;
      const adAFile = req.files['ad_a'][0];
      const adBFile = req.files['ad_b'][0];

      // Generate persona and evaluate ads
      const persona = await generatePersona(persona_prompt);
      const evaluation = await evaluateAds(persona, adAFile.path, adBFile.path);

      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating ads:', error);
      res.status(500).json({ 
        detail: `Failed to evaluate ads: ${error.message}` 
      });
    }
  }
);

// Video ads evaluation
app.post('/evaluate-video-ads',
  authenticateUser,
  requirePermission('analyze'),
  upload.fields([
    { name: 'ad_a', maxCount: 1 },
    { name: 'ad_b', maxCount: 1 }
  ]),
  validateVideoUpload,
  async (req, res) => {
    try {
      const { persona_prompt } = req.body;
      const adAFile = req.files['ad_a'][0];
      const adBFile = req.files['ad_b'][0];

      // Generate persona and evaluate video ads
      const persona = await generatePersona(persona_prompt);
      const evaluation = await evaluateVideoAds(persona, adAFile.path, adBFile.path);

      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating video ads:', error);
      res.status(500).json({ 
        detail: `Failed to evaluate video ads: ${error.message}` 
      });
    }
  }
);

// Text ads evaluation - Fixed to use upload.none() for processing multipart form data
app.post('/evaluate-text-ads',
  authenticateUser,
  requirePermission('analyze'),
  upload.none(), // This processes multipart form data without files
  validateTextAds,
  async (req, res) => {
    try {
      const { persona_prompt, ad_a_text, ad_b_text } = req.body;

      // Generate persona and evaluate text ads
      const persona = await generatePersona(persona_prompt);
      const evaluation = await evaluateTextAds(persona, ad_a_text, ad_b_text);

      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating text ads:', error);
      res.status(500).json({ 
        detail: `Failed to evaluate text ads: ${error.message}` 
      });
    }
  }
);

// Ad enhancement endpoint
app.post('/api/enhance-ad',
  authenticateUser,
  requirePermission('analyze'),
  upload.none(), // Process form data without files
  async (req, res) => {
    try {
      const { reportId, adToEnhance } = req.body;

      // Get the original analysis report
      const report = await analysisService.getById(reportId);
      if (!report) {
        return res.status(404).json({ detail: 'Analysis report not found' });
      }

      // Get related persona
      const persona = await personaService.getById(report.persona_id);
      if (!persona) {
        return res.status(404).json({ detail: 'Persona not found' });
      }

      // Generate enhanced ad content
      const result = await enhancer.enhanceAd(
        persona,
        report, 
        adToEnhance
      );

      res.json(result);
    } catch (error) {
      console.error('Error enhancing ad:', error);
      res.status(500).json({ 
        detail: `Failed to enhance ad: ${error.message}` 
      });
    }
  }
);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ detail: 'File size too large. Maximum size is 100MB.' });
    }
  }
  
  if (error.message.includes('Only JPEG, PNG, WebP')) {
    return res.status(400).json({ detail: error.message });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ detail: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ detail: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});


