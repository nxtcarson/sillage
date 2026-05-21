import { Box, Button, Chip, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const BRAND = '#BD562A';

export default function OrgSettingsPage() {
  return (
    <Box sx={{ maxWidth: 680 }}>
      <PageHeader title="Company" subtitle="Manage your organization settings" />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Organization details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Company name" size="small" />
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
            variant="contained"
            sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Save changes
          </Button>
        </Box>
      </Paper>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>Current plan</Typography>
          <Chip label="Free" size="small" />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" gutterBottom>
          You are on the Free plan. Upgrade to unlock more seats, storage, and features.
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
