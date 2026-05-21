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

const STATUS_COLORS = {
  active: 'success',
  expired: 'error',
  pending: 'warning',
  cancelled: 'default',
};

export default function PolicyDetailPage() {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [contactName, setContactName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/crm/policies/${id}/`);
        const p = res.data;
        setPolicy(p);
        if (p.contact) {
          api.get(`/crm/contacts/${p.contact}/`).then((cr) => {
            const c = cr.data;
            setContactName(c.full_name || `${c.first_name} ${c.last_name}`);
          }).catch(() => {});
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <Box>
      <PageHeader
        title={policy?.policy_number || `Policy #${id}`}
        subtitle={contactName ? `Client: ${contactName}` : `Policy #${id}`}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 0, borderLeft: '3px solid rgba(189,86,42,0.45)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>Policy details</Typography>
                {policy?.status && (
                  <Chip
                    label={policy.status}
                    size="small"
                    color={STATUS_COLORS[policy.status?.toLowerCase()] || 'default'}
                    sx={{ borderRadius: 0, fontWeight: 600, textTransform: 'capitalize', fontSize: 11 }}
                  />
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Policy number" value={policy?.policy_number} />
              <InfoRow label="Carrier" value={policy?.carrier} />
              <InfoRow label="Type" value={policy?.type} />
              <InfoRow
                label="Premium"
                value={policy?.premium != null ? `$${Number(policy.premium).toLocaleString()}` : null}
              />
              <InfoRow
                label="Commission"
                value={policy?.commission != null ? `$${Number(policy.commission).toLocaleString()}` : null}
              />
              <InfoRow
                label="Effective date"
                value={policy?.effective_date ? new Date(policy.effective_date).toLocaleDateString() : null}
              />
              <InfoRow
                label="Expiry date"
                value={policy?.expiry_date ? new Date(policy.expiry_date).toLocaleDateString() : null}
              />
              <InfoRow label="Client" value={contactName || `Contact #${policy?.contact}`} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 0, minHeight: 260 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Notes</Typography>
              <Divider sx={{ mb: 2 }} />
              {policy?.notes ? (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {policy.notes}
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: 'text.disabled' }}>
                  <Typography variant="body2">No notes</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
