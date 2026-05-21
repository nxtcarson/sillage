import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

function StatCard({ label, value, accent, loading }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      {loading ? (
        <CircularProgress size={24} sx={{ mt: 0.5 }} />
      ) : (
        <Typography variant="h4" fontWeight={700} color={accent || 'text.primary'}>
          {value ?? '—'}
        </Typography>
      )}
    </Paper>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ contacts: null, leads: null, policies: null, tasks: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [contacts, leads, policies, tasks] = await Promise.allSettled([
          api.get('/crm/contacts/'),
          api.get('/crm/leads/'),
          api.get('/crm/policies/'),
          api.get('/crm/tasks/'),
        ]);

        const extract = (result) => {
          if (result.status === 'fulfilled') {
            const data = result.value.data;
            return data?.count ?? (Array.isArray(data) ? data.length : null);
          }
          return null;
        };

        setStats({
          contacts: extract(contacts),
          leads: extract(leads),
          policies: extract(policies),
          tasks: extract(tasks),
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Your agency at a glance" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active contacts" value={stats.contacts} loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Open leads" value={stats.leads} loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active policies" value={stats.policies} loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Open tasks" value={stats.tasks} loading={loading} accent="primary.main" />
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
