import { useState } from 'react';
import { Box, Button, Divider, Link as MuiLink, TextField, Typography } from '@mui/material';
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

export default function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/registration/', {
        email,
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
      });
      localStorage.setItem('authToken', data.key);
      navigate('/app/dashboard');
    } catch (err) {
      const errors = err.response?.data;
      const firstMessage = errors
        ? Object.values(errors).flat()[0]
        : 'Registration failed. Please try again.';
      setError(typeof firstMessage === 'string' ? firstMessage : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#0F172A', px: 2, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', bgcolor: 'rgba(189,86,42,0.12)', filter: 'blur(80px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

      <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box component={Link} to="/" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none', mb: 2 }}>
            <Box component="img" src="/img/sillage-logo.svg" alt="Sillage" sx={{ width: 36, height: 36 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: BRAND, fontFamily: '"Fraunces", serif' }}>Sillage</Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F1F5F9' }}>Create your account</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: '#94A3B8' }}>Free forever · No credit card required</Typography>
        </Box>

        <Box sx={{ bgcolor: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(189,86,42,0.15)', borderRadius: 3, p: 4 }}>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <FieldLabel>First name</FieldLabel>
                <TextField
                  fullWidth
                  autoComplete="given-name"
                  placeholder="Jane"
                  variant="outlined"
                  sx={inputSx}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FieldLabel>Last name</FieldLabel>
                <TextField
                  fullWidth
                  autoComplete="family-name"
                  placeholder="Doe"
                  variant="outlined"
                  sx={inputSx}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Box>
            </Box>

            <Box>
              <FieldLabel>Email</FieldLabel>
              <TextField
                fullWidth
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
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
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                variant="outlined"
                sx={inputSx}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Box>
              <FieldLabel>Company name</FieldLabel>
              <TextField fullWidth placeholder="Acme Insurance" variant="outlined" sx={inputSx} />
            </Box>

            <Divider sx={{ my: 0.5, borderColor: 'rgba(189,86,42,0.15)' }} />

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
              {loading ? 'Creating account…' : 'Get started free'}
            </Button>

            <Typography variant="caption" sx={{ textAlign: 'center', color: 'rgba(241,245,249,0.4)' }}>
              By signing up you agree to our Terms and Privacy Policy.
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2.5, color: '#64748B' }}>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" sx={{ color: BRAND, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Sign in
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
