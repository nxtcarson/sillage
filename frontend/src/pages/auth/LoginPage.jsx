import { Box, Button, Divider, Link as MuiLink, Paper, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const BRAND = '#BD562A';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none', mb: 2 }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: BRAND,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>S</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 20, color: BRAND }}>Sillage</Typography>
          </Box>
          <Typography variant="h5" fontWeight={700}>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to your account
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Email" size="small" type="email" autoComplete="email" />
            <TextField fullWidth label="Password" size="small" type="password" autoComplete="current-password" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ color: BRAND }}>
                Forgot password?
              </MuiLink>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: 2, fontWeight: 600, py: 1.25 }}
            >
              Sign in
            </Button>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2.5 }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/signup" sx={{ color: BRAND, fontWeight: 600 }}>
            Sign up free
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
