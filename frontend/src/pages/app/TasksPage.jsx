import { Box, Button, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

function SectionLabel({ children }) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.015)',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Montserrat", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#64748B',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

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
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
          >
            Add task
          </Button>
        }
      />
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '1px solid rgba(189,86,42,0.25)',
          borderRadius: 0,
        }}
      >
        <SectionLabel>Today</SectionLabel>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            color: 'text.disabled',
          }}
        >
          <Typography variant="body2">No tasks for today</Typography>
        </Box>
        <Divider />
        <SectionLabel>Upcoming</SectionLabel>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            color: 'text.disabled',
          }}
        >
          <Typography variant="body2">No upcoming tasks</Typography>
        </Box>
      </Box>
    </Box>
  );
}
