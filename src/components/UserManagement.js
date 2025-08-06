import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';
import UserDetailsCard from './UserDetailsCard';

const UserManagement = ({ 
  onCreateUser, 
  onEditUser, 
  onDeleteUser, 
  onSubmitConfiguration,
  existingUsers = [], 
  existingRoles = [],
  clubs = [] 
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterClub, setFilterClub] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    club: '',
    role: ''
  });
  const [userValid, setUserValid] = useState(false);

  const handleCreateNew = () => {
    setUserData({
      fullName: '',
      phoneNumber: '',
      email: '',
      club: '',
      role: ''
    });
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleEdit = (user) => {
    setUserData(user);
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleView = (user) => {
    setUserToView(user);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete && onDeleteUser) {
      onDeleteUser(userToDelete.id);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleUserDataChange = (data, valid) => {
    setUserData(data);
    setUserValid(valid);
  };

  const handleSaveUser = () => {
    if (userValid) {
      const userToSave = {
        ...userData,
        id: editingUser ? editingUser.id : `user-${Date.now()}`,
        createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingUser) {
        onEditUser && onEditUser(userToSave);
      } else {
        onCreateUser && onCreateUser(userToSave);
      }

      setDrawerOpen(false);
      setEditingUser(null);
      setUserData({
        fullName: '',
        phoneNumber: '',
        email: '',
        club: '',
        role: ''
      });
    }
  };

  const handleCancel = () => {
    setDrawerOpen(false);
    setEditingUser(null);
    setUserData({
      fullName: '',
      phoneNumber: '',
      email: '',
      club: '',
      role: ''
    });
  };

  const getRoleName = (roleId) => {
    const role = existingRoles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  const getClubName = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Unknown Club';
  };

  const getFilteredUsers = () => {
    return existingUsers.filter(user => {
      if (filterRole && user.role !== filterRole) return false;
      if (filterClub && user.club !== filterClub) return false;
      return true;
    });
  };

  const getUserInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = () => {
    setSubmitDialogOpen(true);
  };

  const handleSubmitConfirm = () => {
    // Submit both users and roles
    console.log('Submitting users:', existingUsers);
    console.log('Submitting roles:', existingRoles);
    setSubmitDialogOpen(false);
    
    // Call the parent callback to show success page
    if (onSubmitConfiguration) {
      onSubmitConfiguration(existingUsers, existingRoles);
    }
  };

  const getUserRoleSummary = () => {
    const roleSummary = {};
    existingUsers.forEach(user => {
      const roleName = getRoleName(user.role);
      if (roleSummary[roleName]) {
        roleSummary[roleName]++;
      } else {
        roleSummary[roleName] = 1;
      }
    });
    return roleSummary;
  };

  const getPermissionSummary = (permissions) => {
    let totalFunctions = 0;
    let selectedFunctions = 0;

    Object.values(permissions).forEach(modulePerms => {
      Object.values(modulePerms).forEach(level => {
        totalFunctions++;
        if (level > 0) selectedFunctions++;
      });
    });

    return { totalFunctions, selectedFunctions };
  };

  const getPermissionDetails = (permissions) => {
    const details = [];
    Object.entries(permissions).forEach(([moduleId, modulePerms]) => {
      const modulePermissions = Object.entries(modulePerms).filter(([_, level]) => level > 0);
      if (modulePermissions.length > 0) {
        details.push({
          module: moduleId,
          permissions: modulePermissions.map(([func, level]) => ({
            function: func,
            level: level === 2 ? 'Full Access' : 'Read Only'
          }))
        });
      }
    });
    return details;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4
      }}>
        <Typography variant="h6" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          size="large"
          sx={{ minWidth: 'auto' }}
        >
          Create New User
        </Button>
      </Box>

      {/* Filters */}
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                {existingRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel>Filter by Club</InputLabel>
              <Select
                value={filterClub}
                label="Filter by Club"
                onChange={(e) => setFilterClub(e.target.value)}
              >
                <MenuItem value="">All Clubs</MenuItem>
                {clubs.map((club) => (
                  <MenuItem key={club.id} value={club.id}>
                    {club.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(filterRole || filterClub) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setFilterRole('');
                  setFilterClub('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Create/Edit User Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCancel}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50%',
            maxWidth: '600px'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6">
            {editingUser ? 'Edit User' : 'Create New User'}
          </Typography>
          <IconButton onClick={handleCancel} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2
        }}>
          <UserDetailsCard
            userDetails={userData}
            onChange={handleUserDataChange}
            existingRoles={existingRoles}
          />
        </Box>
        
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex', 
          gap: 2, 
          justifyContent: 'flex-end'
        }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            disabled={!userValid}
          >
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </Box>
      </Drawer>

      {/* Users Table */}
      <Card elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ 
            '& .MuiTable-root': {
              minWidth: 900
            }
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '18%' }}>User</TableCell>
                  <TableCell sx={{ width: '22%' }}>Contact</TableCell>
                  <TableCell sx={{ width: '15%' }}>Role</TableCell>
                  <TableCell sx={{ width: '15%' }}>Club</TableCell>
                  <TableCell align="center" sx={{ width: '12%' }}>Created</TableCell>
                  <TableCell align="center" sx={{ width: '18%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {existingUsers.length === 0 
                          ? "No users created yet. Click \"Create New User\" to get started."
                          : "No users match the current filters."
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getUserInitials(user.fullName)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {user.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2">{user.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2">{user.phoneNumber}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleName(user.role)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getClubName(user.club)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleView(user)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit User">
                            <IconButton size="small" onClick={() => handleEdit(user)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton size="small" onClick={() => handleDeleteClick(user)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Submit Button Card */}
      {(existingUsers.length > 0 || existingRoles.length > 0) && (
        <Card elevation={2} sx={{ mt: 3 }}>
          <CardContent sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 3
          }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Ready to Submit Roles & Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {existingRoles.length} role{existingRoles.length !== 1 ? 's' : ''} and {existingUsers.length} user{existingUsers.length !== 1 ? 's' : ''} configured and ready for submission
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              sx={{ 
                minWidth: 180,
                fontSize: '1.1rem',
                py: 1.5
              }}
            >
              Submit Roles & Users
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View User Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          User Details: {userToView?.fullName}
        </DialogTitle>
        <DialogContent>
          {userToView && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  {getUserInitials(userToView.fullName)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{userToView.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getRoleName(userToView.role)} • {getClubName(userToView.club)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="action" />
                  <Typography>{userToView.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="action" />
                  <Typography>{userToView.phoneNumber}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  Created: {userToView.createdAt ? new Date(userToView.createdAt).toLocaleString() : 'N/A'}
                </Typography>
                {userToView.updatedAt && userToView.updatedAt !== userToView.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {new Date(userToView.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "{userToDelete?.fullName}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog 
        open={submitDialogOpen} 
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Confirm Configuration Submission
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to submit the following access control configuration:
          </Typography>
          
          {/* Roles Summary */}
          {existingRoles.length > 0 && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Roles Summary ({existingRoles.length} total)
              </Typography>
              <TableContainer component={Card} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell align="center">Permissions</TableCell>
                      <TableCell>Assigned Users</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {existingRoles.map((role) => {
                      const { selectedFunctions, totalFunctions } = getPermissionSummary(role.permissions || {});
                      const assignedUsers = existingUsers.filter(user => user.role === role.id);
                      return (
                        <TableRow key={role.id}>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {role.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${selectedFunctions}/${totalFunctions} functions`}
                              color={selectedFunctions > 0 ? 'primary' : 'default'}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {assignedUsers.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {assignedUsers.map(user => (
                                  <Chip
                                    key={user.id}
                                    label={user.fullName}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No users assigned
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Users Summary */}
          {existingUsers.length > 0 && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Users Summary ({existingUsers.length} total)
              </Typography>
            <TableContainer component={Card} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Club</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {existingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleName(user.role)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{getClubName(user.club)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          )}



          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            This action will finalize the access control configuration. Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSubmitDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitConfirm} 
            color="primary" 
            variant="contained"
            startIcon={<SendIcon />}
          >
            Submit Roles & Users
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;