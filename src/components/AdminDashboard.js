import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Badge,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as RoleIcon,
  ExitToApp as ExitIcon
} from '@mui/icons-material';

import RoleManagement from './RoleManagement';
import UserManagement from './UserManagement';
import SuccessPage from './SuccessPage';
import LogoIcon from './LogoIcon';

const clubs = [
  { id: 'club-001', name: 'Downtown Fitness Center' },
  { id: 'club-002', name: 'Westside Athletic Club' },
  { id: 'club-003', name: 'Elite Sports Complex' },
  { id: 'club-004', name: 'Suburban Recreation Center' },
  { id: 'club-005', name: 'Metro Health & Wellness' }
];

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [existingRoles, setExistingRoles] = useState([
    { 
      id: 'role-002', 
      name: 'Senior Leadership', 
      permissions: {
        booking: {
          'Packages sold': 2,
          'Master calendar': 2,
          'Session': 2,
          'Scheduling management': 2
        },
        member: {
          'Member': 2
        },
        subscription: {
          'Member subscriptions': 2
        },
        commercial: {
          'Packages management': 2
        },
        admin: {
          'Users': 2,
          'Club': 2
        },
        franchise: {
          'Franchise': 2,
          'Set club goals': 2
        },
        'access-permissions': {
          'Access & permissions': 2
        },
        'personal-info': {
          'Reviews': 2,
          'Personal trainers': 2
        },
        configuration: {
          'Package levels': 2,
          'Package types': 2
        }
      }, 
      createdAt: '2024-01-20T14:30:00Z' 
    },
    { 
      id: 'role-003', 
      name: 'General Manager', 
      permissions: {
        booking: {
          'Packages sold': 1,
          'Master calendar': 1,
          'Session': 1,
          'Scheduling management': 1
        },
        member: {
          'Member': 1
        },
        subscription: {
          'Member subscriptions': 1
        },
        commercial: {
          'Packages management': 1
        },
        admin: {
          'Users': 2,
          'Club': 2
        },
        franchise: {
          'Franchise': 1,
          'Set club goals': 1
        },
        'access-permissions': {
          'Access & permissions': 1
        },
        'personal-info': {
          'Reviews': 1,
          'Personal trainers': 1
        },
        configuration: {
          'Package levels': 1,
          'Package types': 1
        }
      }, 
      createdAt: '2024-02-01T09:15:00Z' 
    },
    { 
      id: 'role-004', 
      name: 'Front Desk', 
      permissions: {
        booking: {
          'Packages sold': 2,
          'Master calendar': 2,
          'Session': 2,
          'Scheduling management': 2
        },
        member: {
          'Member': 2
        },
        subscription: {
          'Member subscriptions': 0
        },
        commercial: {
          'Packages management': 0
        },
        admin: {
          'Users': 0,
          'Club': 0
        },
        franchise: {
          'Franchise': 0,
          'Set club goals': 0
        },
        'access-permissions': {
          'Access & permissions': 0
        },
        'personal-info': {
          'Reviews': 0,
          'Personal trainers': 0
        },
        configuration: {
          'Package levels': 0,
          'Package types': 0
        }
      }, 
      createdAt: '2024-02-10T16:45:00Z' 
    }
  ]);
  const [existingUsers, setExistingUsers] = useState([
    { 
      id: 'user-001', 
      fullName: 'John Doe', 
      email: 'john.doe@example.com', 
      phoneNumber: '+1 (555) 123-4567',
      club: 'club-001',
      role: 'role-003',
      createdAt: '2024-01-25T10:00:00Z'
    },
    { 
      id: 'user-002', 
      fullName: 'Jane Smith', 
      email: 'jane.smith@example.com', 
      phoneNumber: '+1 (555) 987-6543',
      club: 'club-002',
      role: 'role-004',
      createdAt: '2024-02-05T14:30:00Z'
    }
  ]);



  // Handlers for role management
  const handleCreateRole = (role) => {
    setExistingRoles(prev => [...prev, role]);
  };

  const handleEditRole = (updatedRole) => {
    setExistingRoles(prev => prev.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    ));
  };

  const handleDeleteRole = (roleId) => {
    setExistingRoles(prev => prev.filter(role => role.id !== roleId));
  };

  // Handlers for user management
  const handleCreateUser = (user) => {
    setExistingUsers(prev => [...prev, user]);
  };

  const handleEditUser = (updatedUser) => {
    setExistingUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setExistingUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleSubmitConfiguration = (users, roles) => {
    // Store the submission data for the success page
    setSubmissionData({
      users,
      roles,
      timestamp: new Date().toISOString()
    });
    setShowSuccessPage(true);
  };

  const handleBackToManagement = () => {
    setShowSuccessPage(false);
    setSubmissionData(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExit = () => {
    // Reload the page to exit the dashboard and return to initial state
    window.location.reload();
  };

  // Show success page if submission is complete
  if (showSuccessPage && submissionData) {
    return (
      <SuccessPage
        submissionData={submissionData}
        onCreateAnother={handleBackToManagement}
        onViewAllUsers={handleBackToManagement}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Enhanced AppBar with Best Practices */}
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters
            sx={{ 
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2
            }}
          >
            {/* Brand Section */}
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              component="header"
              role="banner"
            >
              <LogoIcon 
                sx={{ 
                  fontSize: 40,
                  color: 'primary.main'
                }} 
              />
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                >
                  Access Control
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  User & Role Management System
                </Typography>
              </Box>
            </Stack>
            
            {/* Right Section with Navigation and Exit Button */}
            <Stack direction="row" spacing={3} alignItems="center">
              {/* Navigation Section */}
              <Box component="nav" role="navigation" aria-label="Main navigation">
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange}
                  variant="standard"
                  sx={{ 
                    '& .MuiTab-root': {
                      minWidth: 180,
                      minHeight: 64,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      color: 'text.secondary',
                      '&.Mui-selected': {
                        color: 'primary.main',
                        fontWeight: 600
                      }
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0'
                    }
                  }}
                >
                  <Tab 
                    icon={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <RoleIcon sx={{ fontSize: 20 }} />
                        <Chip 
                          label={existingRoles.length} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ 
                            minWidth: 24,
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        />
                      </Stack>
                    }
                    label="Manage Roles" 
                    iconPosition="start"
                    aria-label={`Manage Roles (${existingRoles.length} roles)`}
                  />
                  <Tab 
                    icon={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: 20 }} />
                        <Chip 
                          label={existingUsers.length} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ 
                            minWidth: 24,
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        />
                      </Stack>
                    }
                    label="Manage Users" 
                    iconPosition="start"
                    aria-label={`Manage Users (${existingUsers.length} users)`}
                  />
                </Tabs>
              </Box>

              {/* Exit Button */}
              <Tooltip title="Exit Dashboard" arrow placement="bottom">
                <IconButton
                  onClick={handleExit}
                  size="medium"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: 'error.50'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  aria-label="Exit dashboard"
                >
                  <ExitIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>


        {/* Tab 0: Role Management */}
        {currentTab === 0 && (
          <RoleManagement
            onCreateRole={handleCreateRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            existingRoles={existingRoles}
          />
        )}

        {/* Tab 1: User Management */}
        {currentTab === 1 && (
          <UserManagement
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onSubmitConfiguration={handleSubmitConfiguration}
            existingUsers={existingUsers}
            existingRoles={existingRoles}
            clubs={clubs}
          />
        )}
      </Box>


    </Box>
  );
};

export default AdminDashboard;