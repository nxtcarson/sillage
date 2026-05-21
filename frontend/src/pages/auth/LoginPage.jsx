import { useState } from 'react';
import { Box, Button, Link as MuiLink, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BRAND = '#BD562A';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(15,23,42,0.6)',
    color: '#F1F5F9',
    '& fieldset': { borderColor: 'rgba(100,116,139,0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(189,86,42,0.4)' },
    '&.Mui-focused fieldset': { borderColor: BRAND },
  },
  '& input': { color: '#F1F5F9' },
  '& input::placeholder': { color: '#475569', opacity: 1 },
};

function FieldLabel({ children }) {
  return (
    <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.75 }}>
      {children}
    </Typography>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login/', { email, password });
      localStorage.setItem('authToken', data.key);
      navigate('/app/dashboard');
    } catch (err) {
      const detail = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Invalid email or password.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0F172A', px: 2, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', bgcolor: 'rgba(189,86,42,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Box sx={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box component={Link} to="/" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', mb: 2 }}>
            <Box component="img" src="/img/sillage-logo.svg" alt="Sillage" sx={{ width: 36, height: 36 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: BRAND, fontFamily: '"Fraunces", serif' }}>Sillage</Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F1F5F9' }}>Welcome back</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: '#94A3B8' }}>Sign in to your account</Typography>
        </Box>

        <Box sx={{ bgcolor: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(189,86,42,0.15)', borderRadius: 3, p: 4 }}>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <FieldLabel>Email</FieldLabel>
              <TextField
                fullWidth
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                variant="outlined"
                sx={inputSx}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box>
              <FieldLabel>Password</FieldLabel>
              <TextField
                fullWidth
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                variant="outlined"
                sx={inputSx}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ color: BRAND, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </MuiLink>
            </Box>

            {error && (
              <Typography variant="body2" sx={{ color: '#F87171', textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: '50px', py: 1.5, fontWeight: 700, fontSize: '0.95rem', boxShadow: 'none' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#64748B' }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/signup" sx={{ color: BRAND, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Sign up free
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
