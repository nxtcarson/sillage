import { useState, useEffect } from 'react';
import { Box, Avatar, Button, Divider, Grid, Paper, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const BRAND = '#BD562A';

export default function ProfileSettingsPage() {
  const { user, refetch } = useAuth() ?? {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const avatarLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      await api.patch('/accounts/me/', { name: fullName });
      await refetch?.();
      setSaveMsg({ type: 'success', text: 'Profile updated.' });
    } catch {
      setSaveMsg({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 680 }}>
      <PageHeader title="Profile" subtitle="Manage your personal information" />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Personal information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSaveProfile}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, fontSize: 22, fontWeight: 700, bgcolor: '#f3ddd5', color: BRAND }}>
              {avatarLetter}
            </Avatar>
            <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
              Change photo
            </Button>
          </Box>
          {saveMsg && (
            <Alert severity={saveMsg.type} sx={{ mb: 2 }}>{saveMsg.text}</Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First name"
                size="small"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last name"
                size="small"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                size="small"
                type="email"
                value={email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              {saving ? <CircularProgress size={18} color="inherit" /> : 'Save changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Change password
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Current password" size="small" type="password" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="New password" size="small" type="password" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Confirm new password" size="small" type="password" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Update password
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
