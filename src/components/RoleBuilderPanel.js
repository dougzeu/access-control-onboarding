import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  FormGroup,
  Tooltip,
  Switch
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  SelectAll as SelectAllIcon,
  RemoveRedEye as ReadOnlyIcon,
  Block as ForbiddenIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const roleTemplates = [
  { id: '', name: 'Select template...' },
  { id: 'sr-leadership', name: 'Sr. Leadership' },
  { id: 'general-manager', name: 'General Manager' },
  { id: 'front-desk', name: 'Front Desk' }
];

const permissionModules = [
  {
    id: 'booking',
    name: 'Booking',
    description: 'Manage client bookings, sessions, and calendar operations',
    functions: [
      {
        name: 'Packages sold',
        description: 'View all client packages purchased and their details'
      },
      {
        name: 'Master calendar',
        description: 'Access and manage the main scheduling calendar'
      },
      {
        name: 'Session',
        description: 'Create and manage individual training sessions'
      },
      {
        name: 'Scheduling management',
        description: 'Manage and cancel bookings list and appointments'
      }
    ]
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Manage member information and membership operations',
    functions: [
      {
        name: 'Member',
        description: 'View the list of all members in the system'
      }
    ]
  },
  {
    id: 'subscription',
    name: 'Subscription',
    description: 'Handle recurring memberships and subscription management',
    functions: [
      {
        name: 'Member subscriptions',
        description: 'View, pause, and cancel recurring packages'
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Manage business operations and package offerings',
    functions: [
      {
        name: 'Packages management',
        description: 'View all packages from your club'
      }
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'System administration and user management',
    functions: [
      {
        name: 'Users',
        description: 'Create, modify, and delete user accounts'
      },
      {
        name: 'Club',
        description: 'Manage club options, details, and configurations'
      }
    ]
  },
  {
    id: 'franchise',
    name: 'Franchise',
    description: 'Multi-location management and franchise operations',
    functions: [
      {
        name: 'Franchise',
        description: 'View a franchise and its associated locations'
      },
      {
        name: 'Set club goals',
        description: 'Define club goals (Sr. Leadership only)'
      }
    ]
  },
  {
    id: 'access-permissions',
    name: 'Access & Permissions',
    description: 'Control user access rights and permission management',
    functions: [
      {
        name: 'Access & permissions',
        description: 'Manage user permissions and roles'
      }
    ]
  },
  {
    id: 'personal-info',
    name: 'Personal Info',
    description: 'Manage personal information and trainer details',
    functions: [
      {
        name: 'Reviews',
        description: 'Manage reviews received by trainers'
      },
      {
        name: 'Personal trainers',
        description: 'Manage trainer personal details'
      }
    ]
  },
  {
    id: 'configuration',
    name: 'Configuration',
    description: 'System configuration and package settings',
    functions: [
      {
        name: 'Package levels',
        description: 'View all levels available within packages'
      },
      {
        name: 'Package types',
        description: 'View all types of packages available'
      }
    ]
  }
];

// Permission states: 'forbidden' (0), 'read-only' (1), 'full-access' (2)
const getPermissionIcon = (state) => {
  switch (state) {
    case 2: return <SelectAllIcon sx={{ fontSize: 16, color: 'success.main' }} />;
    case 1: return <ReadOnlyIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
    default: return <ForbiddenIcon sx={{ fontSize: 16, color: 'error.main' }} />;
  }
};

const getPermissionLabel = (state) => {
  switch (state) {
    case 2: return 'Full Access';
    case 1: return 'Read Only';
    default: return 'Forbidden';
  }
};

const RoleBuilderPanel = ({ roleData, onChange, isNewRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    cloneFrom: '',
    permissions: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hideEmpty, setHideEmpty] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    setFormData(roleData);
  }, [roleData]);

  const validateForm = useCallback((data) => {
    if (!isNewRole) return true;
    
    return data.name.trim().length > 0;
  }, [isNewRole]);

  const validateAndNotify = useCallback((data) => {
    const isValid = validateForm(data);
    onChange(data, isValid);
  }, [onChange, validateForm]);

  useEffect(() => {
    // Initialize permissions for all modules if not already set
    const initialPermissions = { ...formData.permissions };
    permissionModules.forEach(module => {
      if (!initialPermissions[module.id]) {
        initialPermissions[module.id] = {};
        module.functions.forEach(func => {
          const funcName = typeof func === 'string' ? func : func.name;
          initialPermissions[module.id][funcName] = 0; // forbidden by default
        });
      }
    });
    
    if (JSON.stringify(initialPermissions) !== JSON.stringify(formData.permissions)) {
      const newFormData = { ...formData, permissions: initialPermissions };
      setFormData(newFormData);
      validateAndNotify(newFormData);
    }
  }, [formData.permissions, formData, validateAndNotify]);

  const handleFieldChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    validateAndNotify(newFormData);
  };

  const handleCloneFromTemplate = (templateId) => {
    if (!templateId) return;
    
    // Simulate loading template permissions
    const templatePermissions = {};
    permissionModules.forEach(module => {
      templatePermissions[module.id] = {};
      module.functions.forEach(func => {
        const funcName = typeof func === 'string' ? func : func.name;
        // Different templates have different permission patterns
        let permissionLevel = 0;
        switch (templateId) {
          case 'sr-leadership':
            permissionLevel = 2; // Full access for leadership
            break;
          case 'general-manager':
            permissionLevel = module.id === 'admin' ? 2 : 1; // Full admin, read-only others
            break;
          case 'front-desk':
            permissionLevel = ['booking', 'member'].includes(module.id) ? 2 : 0;
            break;
          default:
            permissionLevel = 0;
        }
        templatePermissions[module.id][funcName] = permissionLevel;
      });
    });

    const newFormData = {
      ...formData,
      cloneFrom: templateId,
      permissions: templatePermissions
    };
    setFormData(newFormData);
    validateAndNotify(newFormData);
  };

  const handlePermissionChange = (moduleId, functionName, newState) => {
    const newPermissions = {
      ...formData.permissions,
      [moduleId]: {
        ...formData.permissions[moduleId],
        [functionName]: newState
      }
    };
    
    const newFormData = { ...formData, permissions: newPermissions };
    setFormData(newFormData);
    validateAndNotify(newFormData);
  };

  const handleBulkAction = (action) => {
    const newPermissions = { ...formData.permissions };
    const actionValue = action === 'full' ? 2 : action === 'readonly' ? 1 : 0;
    
    permissionModules.forEach(module => {
      if (!newPermissions[module.id]) newPermissions[module.id] = {};
      module.functions.forEach(func => {
        const funcName = typeof func === 'string' ? func : func.name;
        newPermissions[module.id][funcName] = actionValue;
      });
    });
    
    const newFormData = { ...formData, permissions: newPermissions };
    setFormData(newFormData);
    validateAndNotify(newFormData);
  };

  const handleModuleBulkAction = (moduleId, action) => {
    const newPermissions = { ...formData.permissions };
    const actionValue = action === 'full' ? 2 : action === 'readonly' ? 1 : 0;
    
    if (!newPermissions[moduleId]) newPermissions[moduleId] = {};
    
    const module = permissionModules.find(m => m.id === moduleId);
    if (module) {
      module.functions.forEach(func => {
        const funcName = typeof func === 'string' ? func : func.name;
        newPermissions[moduleId][funcName] = actionValue;
      });
    }
    
    const newFormData = { ...formData, permissions: newPermissions };
    setFormData(newFormData);
    validateAndNotify(newFormData);
  };

  const getSelectedCount = () => {
    let count = 0;
    Object.values(formData.permissions).forEach(modulePerms => {
      Object.values(modulePerms).forEach(level => {
        if (level > 0) count++;
      });
    });
    return count;
  };

  const getModuleState = (moduleId) => {
    const modulePerms = formData.permissions[moduleId] || {};
    const values = Object.values(modulePerms);
    const hasAny = values.some(v => v > 0);
    const allFull = values.length > 0 && values.every(v => v === 2);
    const allReadOnly = values.length > 0 && values.every(v => v === 1);
    
    if (allFull) return 'full';
    if (allReadOnly) return 'readonly';
    if (hasAny) return 'mixed';
    return 'none';
  };

  const filteredModules = permissionModules.filter(module => {
    if (hideEmpty && getModuleState(module.id) === 'none') return false;
    if (!searchTerm) return true;
    
    return module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           module.functions.some(func => {
             const funcName = typeof func === 'string' ? func : func.name;
             return funcName.toLowerCase().includes(searchTerm.toLowerCase());
           });
  });

  const handleReset = () => {
    const resetPermissions = {};
    permissionModules.forEach(module => {
      resetPermissions[module.id] = {};
      module.functions.forEach(func => {
        const funcName = typeof func === 'string' ? func : func.name;
        resetPermissions[module.id][funcName] = 0;
      });
    });
    
    const newFormData = {
      name: '',
      cloneFrom: '',
      permissions: resetPermissions
    };
    setFormData(newFormData);
    validateAndNotify(newFormData);
  };

  if (!isNewRole) {
    return (
      <Box sx={{ p: 4, height: 'fit-content' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Role Builder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role builder is only available when creating a new role. 
          Select "New Role..." from the User Details to enable role creation.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, height: 'fit-content' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Role Builder
          </Typography>
          
          {/* Role Name */}
          <TextField
            fullWidth
            label="Role Name"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            required
            sx={{ mb: 2 }}
            placeholder="e.g., Senior Trainer"
          />

          {/* Clone From Template */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Clone From Template</InputLabel>
            <Select
              value={formData.cloneFrom}
              label="Clone From Template"
              onChange={(e) => handleCloneFromTemplate(e.target.value)}
            >
              {roleTemplates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Bulk Actions */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Bulk actions:
            </Typography>
            <Tooltip title="Grant full access to all functions">
              <Button
                size="small"
                startIcon={<SelectAllIcon />}
                onClick={() => handleBulkAction('full')}
                variant="outlined"
                color="success"
              >
                All Full
              </Button>
            </Tooltip>
            <Tooltip title="Grant read-only access to all functions">
              <Button
                size="small"
                startIcon={<ReadOnlyIcon />}
                onClick={() => handleBulkAction('readonly')}
                variant="outlined"
                color="warning"
              >
                All Read-only
              </Button>
            </Tooltip>
            <Tooltip title="Forbid access to all functions">
              <Button
                size="small"
                startIcon={<ForbiddenIcon />}
                onClick={() => handleBulkAction('forbidden')}
                variant="outlined"
                color="error"
              >
                All Forbidden
              </Button>
            </Tooltip>
          </Box>

          {/* Search and Filter */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 2,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <TextField
              placeholder="Search functions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={hideEmpty}
                  onChange={(e) => setHideEmpty(e.target.checked)}
                  size="small"
                />
              }
              label="Hide empty"
              sx={{ margin: 0 }}
            />
          </Box>

          {/* Summary Badge */}
          <Box sx={{ mb: 3 }}>
            <Chip 
              label={`${getSelectedCount()} functions selected`} 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Permission Matrix */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Permission Matrix
          </Typography>
          
          {filteredModules.map((module) => (
            <Accordion 
              key={module.id}
              expanded={expandedModules[module.id] || false}
              onChange={(event, isExpanded) => {
                setExpandedModules(prev => ({ ...prev, [module.id]: isExpanded }));
              }}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
                      {module.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {module.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPermissionIcon(getModuleState(module.id) === 'full' ? 2 : getModuleState(module.id) === 'readonly' ? 1 : 0)}
                    <Typography variant="caption" color="text.secondary">
                      {getModuleState(module.id) === 'mixed' ? 'Mixed' : getPermissionLabel(
                        getModuleState(module.id) === 'full' ? 2 : getModuleState(module.id) === 'readonly' ? 1 : 0
                      )}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      size="small"
                      onClick={() => handleModuleBulkAction(module.id, 'full')}
                      variant="outlined"
                      color="success"
                    >
                      All Full
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleModuleBulkAction(module.id, 'readonly')}
                      variant="outlined"
                      color="warning"
                    >
                      Read-only
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleModuleBulkAction(module.id, 'forbidden')}
                      variant="outlined"
                      color="error"
                    >
                      Forbidden
                    </Button>
                  </Box>
                </Box>
                
                <FormGroup>
                  {module.functions.map((func) => {
                    const funcName = typeof func === 'string' ? func : func.name;
                    const funcDescription = typeof func === 'string' ? '' : func.description;
                    const currentLevel = formData.permissions[module.id]?.[funcName] || 0;
                    return (
                      <Box key={funcName} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        py: 1,
                        px: 1,
                        '&:hover': { bgcolor: 'action.hover' },
                        borderRadius: 1,
                        mb: 0.5
                      }}>
                        <Box sx={{ flex: 1, mr: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {funcName}
                          </Typography>
                          {funcDescription && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {funcDescription}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          <Tooltip title="Forbidden">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={currentLevel === 0}
                                  onChange={() => handlePermissionChange(module.id, funcName, 0)}
                                  size="small"
                                  color="error"
                                />
                              }
                              label=""
                              sx={{ margin: 0 }}
                            />
                          </Tooltip>
                          <Tooltip title="Read Only">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={currentLevel === 1}
                                  onChange={() => handlePermissionChange(module.id, funcName, 1)}
                                  size="small"
                                  color="warning"
                                />
                              }
                              label=""
                              sx={{ margin: 0 }}
                            />
                          </Tooltip>
                          <Tooltip title="Full Access">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={currentLevel === 2}
                                  onChange={() => handlePermissionChange(module.id, funcName, 2)}
                                  size="small"
                                  color="success"
                                />
                              }
                              label=""
                              sx={{ margin: 0 }}
                            />
                          </Tooltip>
                        </Box>
                      </Box>
                    );
                  })}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          width: '100%',
          justifyContent: 'flex-end',
          pt: 4
        }}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
    </Box>
  );
};

export default RoleBuilderPanel;