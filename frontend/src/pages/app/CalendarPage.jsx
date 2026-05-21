import { Box, Paper, Typography, Button } from '@mui/material';
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
            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Add event
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: 520 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 460, color: 'text.disabled', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1" fontWeight={500}>Calendar view coming soon</Typography>
          <Typography variant="body2">Events and renewals will appear here</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
