import { Box, Button, Checkbox, Chip, Divider, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

export default function TasksPage() {
  return (
    <Box>
      <PageHeader
        title="Tasks"
        subtitle="Stay on top of every follow-up and deadline"
        action={
          <Button
            variant="contained"
            component={Link}
            to="/app/tasks/new"
            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Add task
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Today
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, color: 'text.disabled' }}>
          <Typography variant="body2">No tasks for today</Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Upcoming
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, color: 'text.disabled' }}>
          <Typography variant="body2">No upcoming tasks</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
