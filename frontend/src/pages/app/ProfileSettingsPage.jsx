import { Box, Avatar, Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const BRAND = '#BD562A';

export default function ProfileSettingsPage() {
  return (
    <Box sx={{ maxWidth: 680 }}>
      <PageHeader title="Profile" subtitle="Manage your personal information" />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Personal information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: 22, fontWeight: 700, bgcolor: '#f3ddd5', color: BRAND }}>
            U
          </Avatar>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
            Change photo
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First name" size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last name" size="small" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" size="small" type="email" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Phone" size="small" type="tel" />
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
