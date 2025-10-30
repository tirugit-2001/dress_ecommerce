#!/bin/bash

# Exit on error
set -e

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a ~/deployments.log
}

# Navigate to the project directory
log "Starting deployment..."
cd ~/PrintEasyBackend/ || { log "Failed to change directory"; exit 1; }

# Pull the latest code
log "Pulling latest code..."
git pull origin main || { log "Failed to pull code"; exit 1; }

# Install dependencies
log "Installing dependencies..."
npm install || { log "Failed to install dependencies"; exit 1; }

# Build the application if needed
# npm run build

# Restart the application
log "Restarting application..."
npm restart || { log "Failed to restart application"; exit 1; }

# Log successful deployment
log "Deployment completed successfully" 