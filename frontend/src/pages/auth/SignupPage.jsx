import { Box, Button, Link as MuiLink, Paper, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const BRAND = '#BD562A';

export default function SignupPage() {
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
      <Box sx={{ width: '100%', maxWidth: 420 }}>
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
          <Typography variant="h5" fontWeight={700}>Create your account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Free forever · No credit card required
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField fullWidth label="First name" size="small" autoComplete="given-name" />
              <TextField fullWidth label="Last name" size="small" autoComplete="family-name" />
            </Box>
            <TextField fullWidth label="Email" size="small" type="email" autoComplete="email" />
            <TextField fullWidth label="Password" size="small" type="password" autoComplete="new-password" />
            <TextField fullWidth label="Company name" size="small" />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: 2, fontWeight: 600, py: 1.25 }}
            >
              Get started free
            </Button>
            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center' }}>
              By signing up you agree to our Terms and Privacy Policy.
            </Typography>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2.5 }}>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" sx={{ color: BRAND, fontWeight: 600 }}>
            Sign in
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
