# React Auth SDK Example Application

This is a complete example application demonstrating how to use the React Auth SDK for user authentication.

## Features Demonstrated

- Login with email and password
- Registration with OTP verification
- Social login (Google, GitHub, LinkedIn)
- Protected routes
- User profile management
- Logout functionality

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Make sure you've installed the React Auth SDK package first:

```bash
# From the root of the react-auth-sdk directory
npm install
npm link
```

2. Install the dependencies for the example app:

```bash
# From the example directory
npm install
npm link react-auth-sdk
```

### Running the application

```bash
npm start
```

This will start the development server at http://localhost:3000.

## Structure

- `index.jsx` - Entry point that sets up the React app with the AuthProvider
- `App.jsx` - Main component that handles authentication state and routing
- `styles.css` - Styling for the application

## Backend Configuration

This example is designed to work with the Node.js + Express backend provided in the main repository. Make sure you have the backend running before testing authentication features.

### Backend Setup

1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Start the server: `npm start`

By default, the example is configured to connect to a backend running at `http://localhost:5000`.

## Customizing

You can modify the `index.jsx` file to adjust the configuration options for the AuthProvider, such as:

- API base URL
- Token storage method
- Redirect URLs
- Custom event handlers

Refer to the main README.md in the parent directory for complete documentation on all available options.
