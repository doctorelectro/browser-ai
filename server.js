
#!/usr/bin/env node
/**
 * Server wrapper for Azure App Service
 * Runs backend Express server without ES6 module issues
 */

const path = require('path');
const { spawn } = require('child_process');

const backendIndex = path.join(__dirname, 'backend', 'src', 'index.js');

console.log(`[${new Date().toISOString()}] Starting backend from: ${backendIndex}`);
console.log(`[INFO] PORT: ${process.env.PORT || 8080}`);
console.log(`[INFO] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// For Azure: We need to support ES6 in the backend, so we'll use node --input-type=module
// Or better: ensure backend/package.json has "type": "module"
const args = [backendIndex];
const opts = {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: process.env
};

const child = spawn('node', args, opts);

child.on('exit', (code) => {
  console.error(`[ERROR] Backend exited with code ${code}`);
  process.exit(code);
});

child.on('error', (err) => {
  console.error(`[ERROR] Failed to start:`, err);
  process.exit(1);
});
const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://doctorai-app.azurewebsites.net',
  ],
  credentials: true,
}));

// Logging
app.use(pinoHttp({ logger }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ===== API ROUTES - Placeholder =====
app.get('/api/chat', (req, res) => {
  res.json({
    message: 'Chat endpoint - coming soon',
    status: 'placeholder',
  });
});

app.get('/api/mail/emails', (req, res) => {
  res.json({
    message: 'Gmail integration - configure API keys in settings',
    status: 'placeholder',
  });
});

app.get('/api/drive/files', (req, res) => {
  res.json({
    message: 'Google Drive integration - configure API keys in settings',
    status: 'placeholder',
  });
});

// ===== STATIC FILES - Frontend =====
app.use(express.static(join(__dirname, 'frontend', '.next', 'standalone', 'public'), {
  maxAge: '1h',
}));

// ===== DEFAULT ROUTE =====
app.get('/', (req, res) => {
  res.json({
    name: 'Browser AI Assistant',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      mail: '/api/mail/emails',
      drive: '/api/drive/files',
    },
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Browser AI Server started on port ${PORT}`);
  logger.info(`📍 Health check: http://localhost:${PORT}/health`);
  logger.info(`🌐 API docs: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
