import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F47E6',
      dark: '#3832A4',
    },
    secondary: {
      main: '#dc004e',
    },
  },

  spacing: 8,
  typography: {
    h6: {
      fontSize: '1.5rem', // Desktop-optimized large headings
      fontWeight: 600,
    },
    h4: {
      fontSize: '2rem', // Large titles for desktop
      fontWeight: 700,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none', // More professional for desktop
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 32,
          paddingRight: 32,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 8, // Consistent with card radius
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Consistent with cards
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Consistent rounded inputs
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Consistent chip styling
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (min-width: 1024px)': {
            minHeight: 80, // Desktop-optimized toolbar height
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 64,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 64,
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(79, 71, 230, 0.04)',
          },
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
  },
});

// Removed responsive font sizes for desktop-only app

export default theme;