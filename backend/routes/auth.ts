import express from 'express';
import AWS from 'aws-sdk';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Set AWS region
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Create Cognito service instance
const cognito = new AWS.CognitoIdentityServiceProvider();

// Cognito configuration object
const COGNITO_CONFIG = {
  clientId: process.env.COGNITO_CLIENT_ID!,
  userPoolId: process.env.COGNITO_USER_POOL_ID!
};

// Sign Up Route
// Sign Up Route
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if Cognito config is properly loaded
    if (!COGNITO_CONFIG.clientId) {
      console.error('Cognito clientId is missing. Environment variables:', {
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
        AWS_REGION: process.env.AWS_REGION
      });
      return res.status(500).json({ 
        message: 'Server configuration error: Cognito credentials not properly configured' 
      });
    }

    // Register user in Cognito
    const signUpParams = {
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'name',
          Value: name
        }
      ]
    };

    console.log('SignUp params:', { ...signUpParams, Password: '[REDACTED]' });

    const cognitoResponse = await cognito.signUp(signUpParams).promise();

    // Generate a student ID (customize this logic as needed)
    const generateStudentId = () => {
      // Example: STU + year + random number
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `STU${year}${randomNum}`;
    };

    // Save user to database with Cognito sub ID and generated studentId
    const newUser = await prisma.user.create({
      data: {
        cognitoId: cognitoResponse.UserSub!, 
        name: name.trim(),
        email: email.toLowerCase(),
        role: 'student',
        studentId: generateStudentId() // Auto-generate student ID
      }
    });

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email for verification code.',
      userId: newUser.id,
      studentId: newUser.studentId 
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle specific Cognito errors
    if (error.code === 'UsernameExistsException') {
      return res.status(400).json({ message: 'User already exists in Cognito' });
    }
    
    if (error.code === 'InvalidPasswordException') {
      return res.status(400).json({ 
        message: 'Password does not meet Cognito requirements. Must be at least 8 characters with uppercase, lowercase, numbers, and special characters.' 
      });
    }
    
    if (error.code === 'InvalidParameterException') {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    res.status(500).json({ message: error.message || 'Signup failed' });
  }
});

// Confirm Sign Up Route
router.put('/auth/confirm', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    // Check if Cognito config is properly loaded
    if (!COGNITO_CONFIG.clientId) {
      return res.status(500).json({ 
        message: 'Server configuration error: Cognito credentials not properly configured' 
      });
    }

    // Confirm user in Cognito
    const confirmParams = {
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      ConfirmationCode: code
    };

    await cognito.confirmSignUp(confirmParams).promise();

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Email verified successfully. You can now login.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error: any) {
    console.error('Confirmation error:', error);
    
    if (error.code === 'CodeMismatchException') {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    if (error.code === 'ExpiredCodeException') {
      return res.status(400).json({ message: 'Verification code has expired' });
    }
    if (error.code === 'NotAuthorizedException') {
      return res.status(400).json({ message: 'User is already confirmed' });
    }
    
    res.status(500).json({ message: error.message || 'Verification failed' });
  }
});

// Login Route
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if Cognito config is properly loaded
    if (!COGNITO_CONFIG.clientId) {
      return res.status(500).json({ 
        message: 'Server configuration error: Cognito credentials not properly configured' 
      });
    }

    // Authenticate with Cognito
    const authParams = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CONFIG.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };

    const authResponse = await cognito.initiateAuth(authParams).promise();

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate your own JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        cognitoId: user.cognitoId 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      accessToken: authResponse.AuthenticationResult?.AccessToken,
      expiresIn: authResponse.AuthenticationResult?.ExpiresIn
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.code === 'NotAuthorizedException') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (error.code === 'UserNotConfirmedException') {
      return res.status(401).json({ message: 'Please verify your email first' });
    }
    if (error.code === 'UserNotFoundException') {
      return res.status(401).json({ message: 'User does not exist' });
    }
    
    res.status(500).json({ message: error.message || 'Login failed' });
  }
});
 
// Resend verification code
router.post('/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if Cognito config is properly loaded
    if (!COGNITO_CONFIG.clientId) {
      return res.status(500).json({ 
        message: 'Server configuration error: Cognito credentials not properly configured' 
      });
    }

    const resendParams = {
      ClientId: COGNITO_CONFIG.clientId,
      Username: email
    };

    await cognito.resendConfirmationCode(resendParams).promise();

    res.json({ message: 'Verification code resent successfully' });

  } catch (error: any) {
    console.error('Resend code error:', error);
    
    if (error.code === 'UserNotFoundException') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.code === 'InvalidParameterException') {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    res.status(500).json({ message: error.message || 'Failed to resend code' });
  }
});

// Logout
router.post('/auth/logout', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    await cognito.globalSignOut({
      AccessToken: accessToken
    }).promise();

    res.json({ message: 'Logged out successfully' });

  } catch (error: any) {
    console.error('Logout error:', error);
    
    if (error.code === 'NotAuthorizedException') {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    
    res.status(500).json({ message: error.message || 'Logout failed' });
  }
});

// Forgot Password - Initiate
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if Cognito config is properly loaded
    if (!COGNITO_CONFIG.clientId) {
      return res.status(500).json({ 
        message: 'Server configuration error: Cognito credentials not properly configured' 
      });
    }

    const forgotPasswordParams = {
      ClientId: COGNITO_CONFIG.clientId,
      Username: email
    };

    await cognito.forgotPassword(forgotPasswordParams).promise();

    res.json({ message: 'Password reset code sent to your email' });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    if (error.code === 'UserNotFoundException') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.code === 'InvalidParameterException') {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    res.status(500).json({ message: error.message || 'Failed to initiate password reset' });
  }
});

// Reset Password - Confirm
router.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    // Check if Cognito config is properly loaded
    if (!COGNITO_CONFIG.clientId) {
      return res.status(500).json({ 
        message: 'Server configuration error: Cognito credentials not properly configured' 
      });
    }

    const confirmForgotPasswordParams = {
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    };

    await cognito.confirmForgotPassword(confirmForgotPasswordParams).promise();

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });

  } catch (error: any) {
    console.error('Reset password error:', error);
    
    if (error.code === 'CodeMismatchException') {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    if (error.code === 'ExpiredCodeException') {
      return res.status(400).json({ message: 'Verification code has expired' });
    }
    if (error.code === 'InvalidPasswordException') {
      return res.status(400).json({ 
        message: 'Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, numbers, and special characters.' 
      });
    }
    if (error.code === 'UserNotFoundException') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: error.message || 'Failed to reset password' });
  }
});

export default router;