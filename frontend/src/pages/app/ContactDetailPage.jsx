import { Box, Grid, Paper, Typography, Divider, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

export default function ContactDetailPage() {
  const { id } = useParams();

  return (
    <Box>
      <PageHeader title="Contact" subtitle={`Contact #${id}`} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <Typography variant="h5" fontWeight={700} color="primary.main">?</Typography>
              </Box>
              <Typography variant="h6" fontWeight={600}>—</Typography>
              <Chip label="Unknown" size="small" sx={{ mt: 1 }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Contact details will appear here once loaded.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: 320 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Activity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, color: 'text.disabled' }}>
              <Typography variant="body2">No activity yet</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
