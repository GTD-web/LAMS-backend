#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building NestJS application..."
npm run build

# Create api directory if it doesn't exist
mkdir -p api

# Copy the serverless function
echo "Setting up serverless function..."
cp api/index.js api/index.js

echo "Build completed successfully!" 