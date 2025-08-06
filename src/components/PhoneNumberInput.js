import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import LogoIcon from './LogoIcon';

const countryCodes = [
  { code: '+1', country: 'US/CA' },
  { code: '+55', country: 'Brazil' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+81', country: 'Japan' },
];

const PhoneNumberInput = ({ onSubmit, loading, error }) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (number) => {
    // Basic phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number.replace(/\D/g, ''));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      setPhoneError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    onSubmit(fullPhoneNumber);
  };

  const formatPhoneDisplay = (number) => {
    if (number.length >= 6) {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    } else if (number.length >= 3) {
      return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    }
    return number;
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 5, 
      maxWidth: 600, 
      width: '100%'
    }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <LogoIcon sx={{ 
          fontSize: 56, 
          mb: 2 
        }} />
        <Typography 
          variant="h6" 
          component="h1" 
          gutterBottom
        >
          Access Control Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your phone number to receive a verification code
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 2
        }}>
          <FormControl sx={{ 
            minWidth: 140,
            flex: '0 0 auto'
          }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={countryCode}
              label="Country"
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={loading}
            >
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{country.code}</span>
                    <span>({country.country})</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Phone Number"
            value={formatPhoneDisplay(phoneNumber)}
            onChange={handlePhoneChange}
            error={!!phoneError}
            helperText={phoneError}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {countryCode}
                </InputAdornment>
              ),
            }}
            placeholder="(123) 456-7890"
            sx={{ flex: 1 }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading || !phoneNumber}
          sx={{ mt: 2, py: 1.5 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Sending Code...
            </Box>
          ) : (
            'Send Verification Code'
          )}
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          By continuing, you agree to receive SMS messages at the number provided.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PhoneNumberInput;