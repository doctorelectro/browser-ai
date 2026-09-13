#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run backend/src/index.js in the backend directory context
const backendDir = path.join(__dirname, 'backend');
const nodeArgs = [path.join(backendDir, 'src', 'index.js')];

const child = spawn('node', nodeArgs, {
  cwd: backendDir,
  stdio: 'inherit',
  env: { ...process.env },
});

child.on('exit', (code) => {
  process.exit(code);
});
