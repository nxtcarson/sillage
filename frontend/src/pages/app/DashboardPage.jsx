import { Box, Grid, Paper, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

function StatCard({ label, value, accent }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={700} color={accent || 'text.primary'}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function DashboardPage() {
  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Your agency at a glance" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active contacts" value="—" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Open leads" value="—" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active policies" value="—" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Renewals this week" value="—" accent="primary.main" />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: 280 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Pipeline overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.disabled' }}>
              <Typography variant="body2">Pipeline chart coming soon</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: 280 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Upcoming renewals
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.disabled' }}>
              <Typography variant="body2">No upcoming renewals</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
