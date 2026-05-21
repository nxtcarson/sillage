import { Box, Paper, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const STAGES = ['New Lead', 'Quoted', 'Bind', 'Won', 'Lost'];

export default function PipelinePage() {
  return (
    <Box>
      <PageHeader title="Pipeline" subtitle="Track leads from first contact to close" />
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 500 }}>
        {STAGES.map((stage) => (
          <Paper
            key={stage}
            variant="outlined"
            sx={{
              minWidth: 240,
              flex: '0 0 240px',
              borderRadius: 2,
              borderTopWidth: 3,
              borderTopColor: stage === 'Won' ? 'primary.main' : 'divider',
              p: 2,
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
              {stage} <Typography component="span" variant="body2" color="text.disabled">0</Typography>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, color: 'text.disabled' }}>
              <Typography variant="caption">No leads</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
