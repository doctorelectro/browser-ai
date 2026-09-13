#!/bin/bash
set -e

# Install dependencies
npm install --workspaces

# Build frontend
cd frontend
npm run build
cd ..

# Set Node to production
export NODE_ENV=production

# Start backend
cd backend
npm start
