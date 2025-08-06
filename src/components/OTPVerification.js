import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { Security as SecurityIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const OTPVerification = ({ phoneNumber, onVerify, onBack, loading, error }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (newOtp.every(digit => digit !== '') && !loading) {
        handleVerify(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (digits.length === 6) {
      setOtp(digits);
      handleVerify(digits.join(''));
    }
  };

  const handleVerify = (otpCode = otp.join('')) => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    // In a real app, this would trigger resending the OTP
  };

  const formatPhoneNumber = (phone) => {
    // Format phone number for display (mask middle digits)
    if (phone.length > 6) {
      return phone.slice(0, -6).replace(/\d/g, '*') + phone.slice(-2);
    }
    return phone;
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 5, 
      maxWidth: 600, 
      width: '100%'
    }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <SecurityIcon sx={{ 
          fontSize: 56, 
          color: 'primary.main', 
          mb: 2 
        }} />
        <Typography 
          variant="h6" 
          component="h1" 
          gutterBottom
        >
          Verify Code
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          We sent a 6-digit code to
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {formatPhoneNumber(phoneNumber)}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Enter the verification code
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1.5, 
            justifyContent: 'center',
            mb: 3
          }}
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: { 
                  textAlign: 'center', 
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }
              }}
              sx={{ 
                width: 64,
                '& .MuiOutlinedInput-root': {
                  height: 64
                }
              }}
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => handleVerify()}
          disabled={loading || otp.some(digit => digit === '')}
          sx={{ mb: 2, py: 1.5 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Verifying...
            </Box>
          ) : (
            'Verify Code'
          )}
        </Button>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {canResend ? (
            <Link
              component="button"
              variant="body2"
              onClick={handleResend}
              sx={{ textDecoration: 'none' }}
            >
              Resend verification code
            </Link>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Resend code in {timeLeft}s
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={loading}
          sx={{ mt: 1 }}
        >
          Change Phone Number
        </Button>
      </Box>
    </Paper>
  );
};

export default OTPVerification;