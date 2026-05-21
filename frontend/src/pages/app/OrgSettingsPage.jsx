import { useState, useEffect } from 'react';
import { Box, Button, Chip, Divider, Grid, Paper, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const BRAND = '#BD562A';

export default function OrgSettingsPage() {
  const { org, refetch } = useAuth() ?? {};

  const [orgName, setOrgName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    if (org) {
      setOrgName(org.name || '');
    }
  }, [org]);

  async function handleSaveOrg(e) {
    e.preventDefault();
    if (!org?.id) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await api.patch(`/accounts/organizations/${org.id}/update_org/`, { name: orgName });
      await refetch?.();
      setSaveMsg({ type: 'success', text: 'Organization updated.' });
    } catch {
      setSaveMsg({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  }

  const tierLabel = org?.tier
    ? org.tier.charAt(0).toUpperCase() + org.tier.slice(1)
    : 'Free';

  return (
    <Box sx={{ maxWidth: 680 }}>
      <PageHeader title="Company" subtitle="Manage your organization settings" />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Organization details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSaveOrg}>
          {saveMsg && (
            <Alert severity={saveMsg.type} sx={{ mb: 2 }}>{saveMsg.text}</Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company name"
                size="small"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Website" size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" size="small" multiline rows={2} />
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>Current plan</Typography>
          <Chip label={tierLabel} size="small" />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {tierLabel === 'Free'
            ? 'You are on the Free plan. Upgrade to unlock more seats, storage, and features.'
            : `You are on the ${tierLabel} plan.`}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1, textTransform: 'none', borderRadius: 2, borderColor: BRAND, color: BRAND }}
        >
          View plans
        </Button>
      </Paper>
    </Box>
  );
}
