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
        default: dark ? '#111827' : '#ffffff',
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
      h5: {
        fontFamily: '"Montserrat", sans-serif',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Montserrat", sans-serif',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      },
    },
    shape: { borderRadius: 2 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
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
            borderRadius: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 0,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: dark ? '#334155' : '#E2E8F0',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '8px 16px',
            borderColor: dark ? '#334155' : '#E2E8F0',
          },
          head: {
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: dark ? '#94A3B8' : '#475569',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },
    },
  });
}
