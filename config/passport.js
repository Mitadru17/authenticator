const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // If user exists but was registered with another provider
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create a new user
      user = await User.create({
        email: profile.emails[0].value,
        authProvider: 'google',
        isVerified: true // Auto-verify users registered through Google
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Get primary email
    const primaryEmail = profile.emails[0].value;
    
    // Check if user already exists
    let user = await User.findOne({ email: primaryEmail });
    
    if (user) {
      // If user exists but was registered with another provider
      if (user.authProvider !== 'github') {
        user.authProvider = 'github';
        await user.save();
      }
    } else {
      // Create a new user
      user = await User.create({
        email: primaryEmail,
        authProvider: 'github',
        isVerified: true // Auto-verify users registered through GitHub
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// LinkedIn OAuth Strategy
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/linkedin/callback`,
  scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Get email
    const email = profile.emails[0].value;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but was registered with another provider
      if (user.authProvider !== 'linkedin') {
        user.authProvider = 'linkedin';
        await user.save();
      }
    } else {
      // Create a new user
      user = await User.create({
        email,
        authProvider: 'linkedin',
        isVerified: true // Auto-verify users registered through LinkedIn
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 