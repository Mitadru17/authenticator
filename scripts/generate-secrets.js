#!/usr/bin/env node

/**
 * Script to generate secure random secrets for the application
 * 
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a secure random string
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Configuration for different secrets
const secrets = [
  { key: 'JWT_SECRET', length: 64 },
  { key: 'JWT_REFRESH_SECRET', length: 64 },
  { key: 'SESSION_SECRET', length: 32 },
  { key: 'COOKIE_SECRET', length: 32 },
  { key: 'ENCRYPTION_KEY', length: 32 }
];

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');
let envContent = '';

if (fs.existsSync(envPath)) {
  console.log('\x1b[33m%s\x1b[0m', 'Using existing .env file');
  envContent = fs.readFileSync(envPath, 'utf8');
} else if (fs.existsSync(envExamplePath)) {
  console.log('\x1b[33m%s\x1b[0m', 'Creating .env file from .env.example');
  envContent = fs.readFileSync(envExamplePath, 'utf8');
} else {
  console.log('\x1b[31m%s\x1b[0m', 'No .env or .env.example file found');
  process.exit(1);
}

// Generate and update secrets
console.log('\x1b[36m%s\x1b[0m', 'Generating secure secrets...');

secrets.forEach(({ key, length }) => {
  const newSecret = generateSecret(length);
  
  // Check if the key already exists in the .env content
  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envContent)) {
    // Replace existing key
    envContent = envContent.replace(regex, `${key}=${newSecret}`);
    console.log(`\x1b[32m✓\x1b[0m Updated ${key}`);
  } else {
    // Add new key
    envContent += `\n${key}=${newSecret}`;
    console.log(`\x1b[32m✓\x1b[0m Added ${key}`);
  }
});

// Write updated content back to .env file
fs.writeFileSync(envPath, envContent);

console.log('\x1b[36m%s\x1b[0m', 'Secret generation complete!');
console.log('\x1b[36m%s\x1b[0m', 'These secrets have been saved to your .env file.');
console.log('\x1b[33m%s\x1b[0m', 'IMPORTANT: Keep your .env file secure and never commit it to version control!'); 