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
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import RoleBuilderPanel from './RoleBuilderPanel';

const RoleManagement = ({ onCreateRole, onEditRole, onDeleteRole, existingRoles = [] }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [roleToView, setRoleToView] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const [roleData, setRoleData] = useState({
    name: '',
    cloneFrom: '',
    permissions: {}
  });
  const [roleValid, setRoleValid] = useState(false);

  const handleCreateNew = () => {
    setRoleData({
      name: '',
      cloneFrom: '',
      permissions: {}
    });
    setEditingRole(null);
    setDrawerOpen(true);
  };

  const handleEdit = (role) => {
    setRoleData(role);
    setEditingRole(role);
    setDrawerOpen(true);
  };

  const handleView = (role) => {
    setRoleToView(role);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete && onDeleteRole) {
      onDeleteRole(roleToDelete.id);
    }
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleRoleDataChange = (data, valid) => {
    setRoleData(data);
    setRoleValid(valid);
  };

  const handleSaveRole = () => {
    if (roleValid) {
      const roleToSave = {
        ...roleData,
        id: editingRole ? editingRole.id : `role-${Date.now()}`,
        createdAt: editingRole ? editingRole.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingRole) {
        onEditRole && onEditRole(roleToSave);
      } else {
        onCreateRole && onCreateRole(roleToSave);
      }

      setDrawerOpen(false);
      setEditingRole(null);
      setRoleData({
        name: '',
        cloneFrom: '',
        permissions: {}
      });
    }
  };

  const handleCancel = () => {
    setDrawerOpen(false);
    setEditingRole(null);
    setRoleData({
      name: '',
      cloneFrom: '',
      permissions: {}
    });
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

  const toggleRowExpansion = (roleId) => {
    setExpandedRows(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
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

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4
      }}>
        <Typography variant="h6" component="h1">
          Role Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          size="large"
          sx={{ minWidth: 'auto' }}
        >
          Create New Role
        </Button>
      </Box>

      {/* Create Role Drawer */}
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
            {editingRole ? 'Edit Role' : 'Create New Role'}
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
          <RoleBuilderPanel
            roleData={roleData}
            onChange={handleRoleDataChange}
            isNewRole={true}
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
            onClick={handleSaveRole}
            disabled={!roleValid}
          >
            {editingRole ? 'Update Role' : 'Create Role'}
          </Button>
        </Box>
      </Drawer>



      {/* Roles Table */}
      <Card elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ 
            '& .MuiTable-root': {
              minWidth: 750
            }
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                              <TableCell sx={{ width: '25%' }}>Role Name</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>Permissions</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>Created</TableCell>
            <TableCell align="center" sx={{ width: '30%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {existingRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No roles created yet. Click "Create New Role" to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  existingRoles.map((role) => {
                    const { totalFunctions, selectedFunctions } = getPermissionSummary(role.permissions || {});
                    const isExpanded = expandedRows[role.id];
                    const permissionDetails = getPermissionDetails(role.permissions || {});

                    return (
                      <React.Fragment key={role.id}>
                        <TableRow sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => toggleRowExpansion(role.id)}
                                disabled={permissionDetails.length === 0}
                              >
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {role.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${selectedFunctions}/${totalFunctions} functions`}
                              color={selectedFunctions > 0 ? 'primary' : 'default'}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">
                              {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => handleView(role)}>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Role">
                                <IconButton size="small" onClick={() => handleEdit(role)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Role">
                                <IconButton size="small" onClick={() => handleDeleteClick(role)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Permission Details */}
                        <TableRow>
                          <TableCell colSpan={4} sx={{ py: 0, border: 0 }}>
                            <Collapse in={isExpanded}>
                              <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Permission Details:
                                </Typography>
                                {permissionDetails.length === 0 ? (
                                  <Typography variant="body2" color="text.secondary">
                                    No permissions assigned
                                  </Typography>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {permissionDetails.map((module) => (
                                      <Box key={module.module}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize', mb: 1 }}>
                                          {module.module.replace('-', ' ')}
                                        </Typography>
                                        <Box sx={{ ml: 2 }}>
                                          {module.permissions.map((perm, index) => (
                                            <Box 
                                              key={index}
                                              sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                py: 0.5,
                                                px: 1,
                                                mb: 0.5,
                                                bgcolor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 1,
                                                '&:hover': { bgcolor: 'action.hover' }
                                              }}
                                            >
                                              <Typography variant="body2">
                                                {perm.function}
                                              </Typography>
                                              <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                  px: 1, 
                                                  py: 0.25,
                                                  borderRadius: 1,
                                                  bgcolor: perm.level === 'Full Access' ? 'success.light' : 'warning.light',
                                                  color: perm.level === 'Full Access' ? 'success.dark' : 'warning.dark',
                                                  fontWeight: 500
                                                }}
                                              >
                                                {perm.level}
                                              </Typography>
                                            </Box>
                                          ))}
                                        </Box>
                                      </Box>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Role Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Role Details: {roleToView?.name}
        </DialogTitle>
        <DialogContent>
          {roleToView && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created: {roleToView.createdAt ? new Date(roleToView.createdAt).toLocaleString() : 'N/A'}
              </Typography>
              {roleToView.updatedAt && roleToView.updatedAt !== roleToView.createdAt && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last Updated: {new Date(roleToView.updatedAt).toLocaleString()}
                </Typography>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Permissions:
                </Typography>
                {getPermissionDetails(roleToView.permissions || {}).map((module) => (
                  <Box key={module.module} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize', mb: 1.5 }}>
                      {module.module.replace('-', ' ')}
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      {module.permissions.map((perm, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            py: 1,
                            px: 1.5,
                            mb: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <Typography variant="body2">
                            {perm.function}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              px: 1.5, 
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: perm.level === 'Full Access' ? 'success.light' : 'warning.light',
                              color: perm.level === 'Full Access' ? 'success.dark' : 'warning.dark',
                              fontWeight: 500
                            }}
                          >
                            {perm.level}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
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
            Are you sure you want to delete the role "{roleToDelete?.name}"? 
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
    </Box>
  );
};

export default RoleManagement;