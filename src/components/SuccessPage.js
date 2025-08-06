import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Add as AddIcon,
  List as ListIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const SuccessPage = ({ 
  userData, 
  roleData, 
  isNewRole, 
  submissionData,
  onCreateAnother, 
  onViewAllUsers 
}) => {
  const [showToast, setShowToast] = useState(true);

  const handleToastClose = () => {
    setShowToast(false);
  };

  const getClubName = (clubId) => {
    const clubs = {
      'club-001': 'Downtown Fitness Center',
      'club-002': 'Westside Athletic Club',
      'club-003': 'Elite Sports Complex',
      'club-004': 'Suburban Recreation Center',
      'club-005': 'Metro Health & Wellness'
    };
    return clubs[clubId] || 'Unknown Club';
  };

  const getRoleName = (roleId) => {
    if (isNewRole && roleData) {
      return roleData.name;
    }
    
    const roles = {
      'role-001': 'Client Services',
      'role-002': 'Senior Leadership',
      'role-003': 'General Manager',
      'role-004': 'Front Desk',
      'role-005': 'Trainer',
      'role-006': 'Maintenance'
    };
    return roles[roleId] || 'Unknown Role';
  };

  const getPermissionSummary = () => {
    if (!isNewRole || !roleData?.permissions) return null;
    
    let totalFunctions = 0;
    let selectedFunctions = 0;
    
    Object.values(roleData.permissions).forEach(modulePerms => {
      Object.values(modulePerms).forEach(level => {
        totalFunctions++;
        if (level > 0) selectedFunctions++;
      });
    });
    
    return { totalFunctions, selectedFunctions };
  };

  const permissionSummary = getPermissionSummary();
  const timestamp = submissionData ? new Date(submissionData.timestamp).toLocaleString() : new Date().toLocaleString();
  const isSubmission = !!submissionData;

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      py: 6,
      background: (theme) => `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 5,
          minHeight: '100%',
          pb: 4
        }}>
          {/* Success Icon and Title */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 5, 
              textAlign: 'center',
              borderRadius: 3,
              width: '100%',
              maxWidth: 600
            }}
          >
            <CheckCircleIcon sx={{ 
              fontSize: 96, 
              color: 'success.main', 
              mb: 2 
            }} />
            <Typography 
              variant="h6" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'success.main'
              }}
            >
              Success!
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontSize: '1.5rem' }}
            >
              {isSubmission 
                ? `Configuration submitted successfully! ${submissionData.roles.length} roles and ${submissionData.users.length} users processed.`
                : isNewRole 
                  ? 'Role and user created successfully' 
                  : 'User created successfully'
              }
            </Typography>
          </Paper>

          {/* Summary Panel */}
          <Card elevation={2} sx={{ width: '100%', maxWidth: 700 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Summary
              </Typography>

              {isSubmission ? (
                <>
                  {/* Submission Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Roles Submitted
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Total Roles:</strong> {submissionData.roles.length}
                      </Typography>
                      {submissionData.roles.map((role, index) => (
                        <Chip 
                          key={role.id}
                          label={role.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Users Submitted
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Total Users:</strong> {submissionData.users.length}
                      </Typography>
                      {submissionData.users.map((user, index) => (
                        <Box key={user.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>{user.fullName}</strong> - {user.email}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  {/* Single User Creation Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        User Details
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body1">
                        <strong>Name:</strong> {userData.fullName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Email:</strong> {userData.email}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Phone:</strong> {userData.phoneNumber}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Club Information */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Club Assignment
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body1">
                        {getClubName(userData.club)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Role Information */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Role Assignment
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                          <strong>Role:</strong> {getRoleName(userData.role)}
                        </Typography>
                        {isNewRole && (
                          <Chip 
                            label="New Role" 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                      {permissionSummary && (
                        <Typography variant="body2" color="text.secondary">
                          {permissionSummary.selectedFunctions} of {permissionSummary.totalFunctions} functions enabled
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Timestamp */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Created on {timestamp}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Call-to-Action Buttons */}
          {!isSubmission && (
            <Box sx={{ 
              display: 'flex', 
              gap: 4,
              flexDirection: 'row',
              width: '100%',
              maxWidth: 600
            }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={onCreateAnother}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  fontSize: '1.125rem'
                }}
              >
                Create Another User / Role
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ListIcon />}
                onClick={onViewAllUsers}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  fontSize: '1.125rem'
                }}
              >
                View All Users
              </Button>
            </Box>
          )}


        </Box>
      </Container>

      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {isSubmission 
            ? `Configuration submitted: ${submissionData.roles.length} roles and ${submissionData.users.length} users processed`
            : `${userData.fullName} added as ${getRoleName(userData.role)} (${getClubName(userData.club)})`
          }
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuccessPage;