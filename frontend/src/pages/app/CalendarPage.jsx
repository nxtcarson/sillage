import { Box, Button, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

export default function CalendarPage() {
  return (
    <Box>
      <PageHeader
        title="Calendar"
        subtitle="Renewals, follow-ups, and meetings in one place"
        action={
          <Button
            variant="contained"
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
          >
            Add event
          </Button>
        }
      />
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '1px solid rgba(189,86,42,0.25)',
          borderRadius: 0,
          p: 3,
          minHeight: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
          <Typography variant="body1" fontWeight={500}>Calendar view coming soon</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>Events and renewals will appear here</Typography>
        </Box>
      </Box>
    </Box>
  );
}
