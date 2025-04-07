# Deployment Guide for Authentication API

This guide provides instructions for deploying the Authentication API on various platforms.

## Table of Contents

1. [Preparing for Deployment](#preparing-for-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Deploying on Render](#deploying-on-render)
4. [Deploying on DigitalOcean](#deploying-on-digitalocean)
5. [Deploying on Vercel](#deploying-on-vercel)
6. [Environment Variables](#environment-variables)
7. [Security Considerations](#security-considerations)

## Preparing for Deployment

Before deploying to any platform, follow these steps:

1. Copy the `.env.example` file to `.env` and update the variables with your actual values:

   ```
   cp .env.example .env
   ```

2. Generate secure random strings for secrets:

   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Update MongoDB connection string according to your database provider.

4. Set up email provider credentials (SMTP).

5. Set up Twilio credentials for SMS.

6. Configure OAuth providers (Google, GitHub, LinkedIn).

## Docker Deployment

### Local Docker Deployment

1. Make sure you have Docker and Docker Compose installed.

2. Build and run the containers:

   ```bash
   docker-compose up -d
   ```

3. Access the API at http://localhost:5000

### Production Docker Deployment

1. Update the environment variables for production in your `.env` file.

2. Deploy using Docker Compose:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## Deploying on Render

[Render](https://render.com) provides an easy way to deploy Node.js applications.

1. Create a new Web Service on Render.

2. Connect to your repository.

3. Configure the service:

   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

4. Add the environment variables from the `.env` file.

5. For the database, create a MongoDB database using Render's MongoDB service or connect to an external MongoDB service like MongoDB Atlas.

6. Deploy the service.

## Deploying on DigitalOcean

### Using App Platform

1. Create a new App on DigitalOcean App Platform.

2. Connect to your repository.

3. Configure the app:

   - Select the Node.js source type
   - Set the HTTP port to 5000

4. Add all environment variables from your `.env` file.

5. For the database, add a MongoDB database using DigitalOcean Managed MongoDB or connect to an external MongoDB service.

6. Deploy the app.

### Using Droplets with Docker

1. Create a new Droplet on DigitalOcean.

2. SSH into your Droplet.

3. Install Docker and Docker Compose:

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. Clone your repository:

   ```bash
   git clone [your-repository-url]
   cd [your-repository-name]
   ```

5. Create a `.env` file with your production environment variables.

6. Run the application:

   ```bash
   docker-compose up -d
   ```

7. Set up Nginx as a reverse proxy (recommended for production):

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

8. Configure Nginx to proxy to your Node application (Port 5000).

9. Set up SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Deploying on Vercel

Vercel works best for serverless applications, but you can deploy this API with some adjustments:

1. Create a `vercel.json` file in the root directory:

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

2. For MongoDB, use MongoDB Atlas or another cloud MongoDB provider.

3. Connect your repository to Vercel.

4. Add all environment variables from your `.env` file to Vercel's environment variables settings.

5. Deploy the application.

**Note**: For production applications with high traffic or complex requirements, Vercel might not be the best choice due to its serverless nature. Consider DigitalOcean or Render for more flexibility.

## Environment Variables

Make sure to set these environment variables on your deployment platform:

| Variable                             | Description                          | Example                                          |
| ------------------------------------ | ------------------------------------ | ------------------------------------------------ |
| `PORT`                               | Port on which the server runs        | 5000                                             |
| `NODE_ENV`                           | Environment (development/production) | production                                       |
| `MONGODB_URI`                        | MongoDB connection string            | mongodb+srv://user:pass@cluster.mongodb.net/auth |
| `JWT_SECRET`                         | Secret key for signing JWT tokens    | (long random string)                             |
| `JWT_REFRESH_SECRET`                 | Secret for refresh tokens            | (long random string)                             |
| `JWT_EXPIRY`                         | Access token expiry time             | 1h                                               |
| `JWT_REFRESH_EXPIRY`                 | Refresh token expiry time            | 7d                                               |
| `BACKEND_URL`                        | Backend URL for callbacks            | https://api.yourdomain.com                       |
| `FRONTEND_URL`                       | Frontend URL for CORS and redirects  | https://yourdomain.com                           |
| `CORS_ORIGIN`                        | Allowed origins for CORS             | https://yourdomain.com                           |
| `EMAIL_*`                            | Email configuration for OTP emails   |                                                  |
| `TWILIO_*`                           | Twilio configuration for SMS         |                                                  |
| `GOOGLE_*`, `GITHUB_*`, `LINKEDIN_*` | OAuth provider credentials           |                                                  |

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to your repository. Use the platform's secrets management.

2. **JWT Secrets**: Use long, random strings for JWT secrets. Rotate these periodically.

3. **CORS**: In production, restrict CORS to only your frontend domain.

4. **Rate Limiting**: The application includes rate limiting, but consider additional protection at the infrastructure level.

5. **Database Security**: Ensure your MongoDB instance is secured with strong credentials and not publicly accessible.

6. **TLS/SSL**: Always use HTTPS in production. Configure SSL certificates through your hosting provider.

7. **Monitoring and Logging**: Implement logging and monitoring to detect security incidents.

8. **Regular Updates**: Keep dependencies updated to address security vulnerabilities.
