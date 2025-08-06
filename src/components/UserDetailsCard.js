import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { Phone as PhoneIcon, Email as EmailIcon, Person as PersonIcon } from '@mui/icons-material';

const clubs = [
  { id: 'club-001', name: 'Downtown Fitness Center' },
  { id: 'club-002', name: 'Westside Athletic Club' },
  { id: 'club-003', name: 'Elite Sports Complex' },
  { id: 'club-004', name: 'Suburban Recreation Center' },
  { id: 'club-005', name: 'Metro Health & Wellness' }
];

const UserDetailsCard = ({ userDetails, onChange, existingRoles = [] }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    club: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [emailWarning, setEmailWarning] = useState('');

  useEffect(() => {
    setFormData(userDetails);
  }, [userDetails]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const capitalizeWords = (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const handleFieldChange = (field, value) => {
    let processedValue = value;
    
    // Auto-capitalize full name
    if (field === 'fullName') {
      processedValue = capitalizeWords(value);
    }

    const newFormData = { ...formData, [field]: processedValue };
    setFormData(newFormData);

    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Email uniqueness check simulation
    if (field === 'email' && processedValue && validateEmail(processedValue)) {
      // Simulate checking if email already exists
      const existingEmails = ['john.doe@example.com', 'admin@club.com'];
      if (existingEmails.includes(processedValue.toLowerCase())) {
        setEmailWarning('This email is already registered');
      } else {
        setEmailWarning('');
      }
    } else {
      setEmailWarning('');
    }

    // Validate and notify parent
    validateAndNotify(newFormData);
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(data.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.club) {
      newErrors.club = 'Please select a club';
    }

    if (!data.role) {
      newErrors.role = 'Please select a role';
    }

    return newErrors;
  };

  const validateAndNotify = (data) => {
    const newErrors = validateForm(data);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0 && !emailWarning;
    onChange(data, isValid);
  };



  return (
    <Box sx={{ height: 'fit-content' }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
          User Details
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Full Name */}
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          {/* Phone Number */}
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            required
            placeholder="+1 (555) 123-4567"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            error={!!errors.email || !!emailWarning}
            helperText={errors.email || emailWarning}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          {emailWarning && (
            <Alert severity="warning" sx={{ mt: -1 }}>
              {emailWarning}
            </Alert>
          )}

          {/* Club */}
          <Autocomplete
            fullWidth
            options={clubs}
            getOptionLabel={(option) => option.name}
            value={clubs.find(club => club.id === formData.club) || null}
            onChange={(event, newValue) => {
              handleFieldChange('club', newValue ? newValue.id : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Club"
                required
                error={!!errors.club}
                helperText={errors.club}
              />
            )}
          />

          {/* Role */}
          <FormControl fullWidth required error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => handleFieldChange('role', e.target.value)}
            >
              {existingRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
              <MenuItem value="new" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                New Role...
              </MenuItem>
            </Select>
            {errors.role && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.role}
              </Typography>
            )}
          </FormControl>
        </Box>
    </Box>
  );
};

export default UserDetailsCard;