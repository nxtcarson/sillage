import { createTheme } from '@mui/material/styles';

const brandOrange = '#BD562A';

export function buildTheme(mode) {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandOrange,
        light: '#D4784D',
        dark: '#9E3E18',
        contrastText: '#ffffff',
      },
      background: {
        default: dark ? '#0F172A' : '#ffffff',
        paper: dark ? '#1E293B' : '#ffffff',
      },
      text: {
        primary: dark ? '#F1F5F9' : '#0F172A',
        secondary: dark ? '#94A3B8' : '#475569',
      },
      divider: dark ? '#334155' : '#E2E8F0',
    },
    typography: {
      fontFamily: '"Montserrat", sans-serif',
      h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
      h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
          containedPrimary: {
            backgroundColor: brandOrange,
            '&:hover': { backgroundColor: '#C6632E' },
          },
          outlinedPrimary: {
            borderColor: dark ? '#334155' : '#CBD5E1',
            color: dark ? '#CBD5E1' : '#334155',
            '&:hover': {
              borderColor: brandOrange,
              color: brandOrange,
              backgroundColor: dark ? 'rgba(189,86,42,0.08)' : 'rgba(189,86,42,0.05)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}
