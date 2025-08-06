import React, { useState } from 'react';
import {
  Container,
  Box,
  Alert,
  Fade,
  Typography,
  Paper
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import PhoneNumberInput from './components/PhoneNumberInput';
import OTPVerification from './components/OTPVerification';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  const [currentStep, setCurrentStep] = useState('phone'); // 'phone', 'otp', 'dashboard', 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Simulate API call for sending OTP
  const handlePhoneSubmit = async (phone) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.1) { // 90% success rate
        setPhoneNumber(phone);
        setCurrentStep('otp');
      } else {
        throw new Error('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulate API call for verifying OTP
  const handleOTPVerify = async (otpCode) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept "123456" as valid OTP, or random success
      if (otpCode === '123456' || Math.random() > 0.3) { // 70% success rate
        setCurrentStep('dashboard');
      } else {
        throw new Error('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setError('');
  };







  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone':
        return (
          <PhoneNumberInput
            onSubmit={handlePhoneSubmit}
            loading={loading}
            error={error}
          />
        );
      
      case 'otp':
        return (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerify={handleOTPVerify}
            onBack={handleBackToPhone}
            loading={loading}
            error={error}
          />
        );
      
      case 'dashboard':
        return (
          <AdminDashboard />
        );
      
      case 'success':
        return (
          <Paper elevation={3} sx={{ 
            p: 5, 
            maxWidth: 500, 
            width: '100%', 
            textAlign: 'center'
          }}>
            <CheckCircleIcon sx={{ 
              fontSize: 64, 
              color: 'success.main', 
              mb: 2 
            }} />
            <Typography 
              variant="h6" 
              component="h1" 
              gutterBottom
            >
              Welcome!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your phone number has been verified successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Phone: {phoneNumber}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                You can now access your account.
              </Typography>
            </Box>
          </Paper>
        );
      
      default:
        return null;
    }
  };

  // Dashboard and Success pages handle their own layout
  if (currentStep === 'dashboard' || currentStep === 'success') {
    return (
      <Fade in={true} timeout={500}>
        <Box>
          {renderCurrentStep()}
          {error && currentStep === 'dashboard' && (
            <Box sx={{ 
              position: 'fixed', 
              top: 20, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              zIndex: 9999,
              width: '90%',
              maxWidth: 500
            }}>
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            </Box>
          )}
        </Box>
      </Fade>
    );
  }

  // Login flow uses centered container layout
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 3,
        background: (theme) => `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto'
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={500}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {renderCurrentStep()}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default App;