import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Health check endpoint for Cloud Run and external monitors
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ensure dist directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath) || !fs.existsSync(path.join(distPath, 'index.html'))) {
  console.log('[Noor Islam] dist directory missing or incomplete. Building client assets now...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error('[Noor Islam] Build step failed during server boot:', err);
  }
}

// Serve static assets from dist
app.use(express.static(distPath, {
  maxAge: '1h',
  etag: true,
  index: false,
}));

// Fallback to index.html for SPA client-side routing
app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<!DOCTYPE html><html><body><h1>Noor Islam</h1><p>Building assets, please refresh in a moment...</p></body></html>');
  }
});

const server = app.listen(PORT, HOST, () => {
  console.log(`[Noor Islam Server] Successfully started and listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown handlers for container orchestration
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: gracefully shutting down HTTP server');
  server.close(() => {
    console.log('HTTP server terminated cleanly');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: gracefully shutting down HTTP server');
  server.close(() => {
    console.log('HTTP server terminated cleanly');
    process.exit(0);
  });
});
