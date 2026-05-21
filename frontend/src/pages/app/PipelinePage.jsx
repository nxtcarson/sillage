import { Box, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const STAGES = ['New Lead', 'Quoted', 'Bind', 'Won', 'Lost'];

export default function PipelinePage() {
  return (
    <Box>
      <PageHeader title="Pipeline" subtitle="Track leads from first contact to close" />
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 500 }}>
        {STAGES.map((stage) => (
          <Box
            key={stage}
            sx={{
              minWidth: 240,
              flex: '0 0 240px',
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'divider',
              borderTop: `2px solid ${stage === 'Won' ? '#BD562A' : 'rgba(189,86,42,0.15)'}`,
              p: 2,
              bgcolor: 'rgba(255,255,255,0.02)',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94A3B8',
                mb: 2,
              }}
            >
              {stage}{' '}
              <Box component="span" sx={{ color: '#475569', ml: 0.5 }}>
                0
              </Box>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption">No leads</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
