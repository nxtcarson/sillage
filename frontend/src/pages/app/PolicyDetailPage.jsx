import { Box, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
    </Box>
  );
}

export default function PolicyDetailPage() {
  const { id } = useParams();

  return (
    <Box>
      <PageHeader title="Policy" subtitle={`Policy #${id}`} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Policy details</Typography>
            <Divider sx={{ mb: 2 }} />
            <InfoRow label="Carrier" value={null} />
            <InfoRow label="Type" value={null} />
            <InfoRow label="Premium" value={null} />
            <InfoRow label="Effective date" value={null} />
            <InfoRow label="Renewal date" value={null} />
            <InfoRow label="Status" value={null} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: 260 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Notes & activity</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: 'text.disabled' }}>
              <Typography variant="body2">No activity yet</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
