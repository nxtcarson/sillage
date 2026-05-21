import { useEffect, useState } from 'react';
import {
  Box, Chip, CircularProgress, Divider, Grid, Paper, Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
    </Box>
  );
}

const ACTIVITY_ICONS = { call: '📞', email: '✉️', meeting: '📅', note: '📝' };

export default function ContactDetailPage() {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cRes, aRes] = await Promise.allSettled([
          api.get(`/crm/contacts/${id}/`),
          api.get(`/crm/activities/?contact=${id}`),
        ]);
        if (cRes.status === 'fulfilled') setContact(cRes.value.data);
        if (aRes.status === 'fulfilled') {
          const d = aRes.value.data;
          setActivities(Array.isArray(d) ? d : d.results ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const initials = contact
    ? `${contact.first_name?.[0] ?? ''}${contact.last_name?.[0] ?? ''}`.toUpperCase() || '?'
    : '?';

  return (
    <Box>
      <PageHeader
        title={contact ? (contact.full_name || `${contact.first_name} ${contact.last_name}`) : 'Contact'}
        subtitle={contact ? contact.email || `Contact #${id}` : `Contact #${id}`}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 0, borderLeft: '3px solid rgba(189,86,42,0.45)' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'rgba(189,86,42,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <Typography variant="h5" fontWeight={700} color="primary.main">{initials}</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {contact?.full_name || `${contact?.first_name} ${contact?.last_name}`}
                </Typography>
                <Chip
                  label={contact?.status || 'Unknown'}
                  size="small"
                  sx={{
                    mt: 1,
                    borderRadius: 0,
                    bgcolor: 'rgba(189,86,42,0.12)',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Email" value={contact?.email} />
              <InfoRow label="Phone" value={contact?.phone} />
              <InfoRow label="Address" value={contact?.address} />
              <InfoRow label="Source" value={contact?.source} />
              <InfoRow label="DOB" value={contact?.date_of_birth ? new Date(contact.date_of_birth).toLocaleDateString() : null} />
              <InfoRow label="Member since" value={contact?.created_at ? new Date(contact.created_at).toLocaleDateString() : null} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 0, minHeight: 320 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Activity</Typography>
              <Divider sx={{ mb: 2 }} />
              {activities.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.disabled' }}>
                  <Typography variant="body2">No activity yet</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {activities.map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderLeft: '3px solid rgba(189,86,42,0.35)',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: 18, lineHeight: 1 }}>
                        {ACTIVITY_ICONS[a.type] || '🔔'}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                          {a.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{a.description}</Typography>
                        <Typography variant="caption" color="text.disabled">
                          {a.timestamp ? new Date(a.timestamp).toLocaleString() : ''}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
