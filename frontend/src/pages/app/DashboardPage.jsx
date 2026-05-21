import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

function StatCard({ label, value, accent, loading }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 0, borderLeft: '3px solid rgba(189,86,42,0.35)' }}>
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

function PipelineBar({ stage, count, max }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 100, flexShrink: 0, textAlign: 'right' }}>
        {stage}
      </Typography>
      <Box sx={{ flex: 1, height: 18, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            width: `${pct}%`,
            bgcolor: '#BD562A',
            minWidth: count > 0 ? 4 : 0,
            transition: 'width 0.4s ease',
          }}
        />
      </Box>
      <Typography variant="body2" fontWeight={600} sx={{ width: 24, textAlign: 'right', color: '#BD562A' }}>
        {count}
      </Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ contacts: null, leads: null, policies: null, tasks: null });
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pipelineLoading, setPipelineLoading] = useState(true);

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

    async function fetchPipeline() {
      try {
        const [stagesRes, leadsRes] = await Promise.allSettled([
          api.get('/crm/pipeline-stages/'),
          api.get('/crm/leads/'),
        ]);

        const stages = stagesRes.status === 'fulfilled'
          ? (Array.isArray(stagesRes.value.data) ? stagesRes.value.data : stagesRes.value.data.results ?? [])
          : [];

        const leads = leadsRes.status === 'fulfilled'
          ? (Array.isArray(leadsRes.value.data) ? leadsRes.value.data : leadsRes.value.data.results ?? [])
          : [];

        if (stages.length > 0) {
          const byStage = stages.map((s) => ({
            name: s.name,
            count: leads.filter((l) => l.stage === s.id).length,
          }));
          setPipelineData(byStage);
        } else {
          const FALLBACK = ['New Lead', 'Contacted', 'Quoted', 'Negotiation', 'Won', 'Lost'];
          const byStage = FALLBACK.map((name) => ({
            name,
            count: leads.filter((l) => {
              const stageName = typeof l.stage === 'string' ? l.stage : '';
              return stageName.toLowerCase() === name.toLowerCase();
            }).length,
          }));
          setPipelineData(byStage);
        }
      } finally {
        setPipelineLoading(false);
      }
    }

    fetchStats();
    fetchPipeline();
  }, []);

  const maxCount = pipelineData.length > 0 ? Math.max(...pipelineData.map((d) => d.count), 1) : 1;

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
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 0, minHeight: 280 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Pipeline overview
            </Typography>
            {pipelineLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <CircularProgress size={28} sx={{ color: 'primary.main' }} />
              </Box>
            ) : pipelineData.every((d) => d.count === 0) ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.disabled' }}>
                <Typography variant="body2">No lead data yet</Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                {pipelineData.map((d) => (
                  <PipelineBar key={d.name} stage={d.name} count={d.count} max={maxCount} />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 0, minHeight: 280 }}>
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
