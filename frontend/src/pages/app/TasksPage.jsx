import { useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, CircularProgress, Divider, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

const PRIORITY_COLOR = { high: '#ef4444', medium: '#f97316', low: '#64748b' };

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

function TaskRow({ task, contactMap }) {
  const contactName = task.related_contact ? (contactMap[task.related_contact] || `Contact #${task.related_contact}`) : null;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2.5,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Checkbox
        size="small"
        checked={task.completed}
        readOnly
        sx={{ p: 0, color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'text.disabled' : 'text.primary' }}
        >
          {task.title}
        </Typography>
        {contactName && (
          <Typography variant="caption" color="text.secondary">{contactName}</Typography>
        )}
      </Box>
      {task.priority && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 10,
            color: PRIORITY_COLOR[task.priority] || '#64748b',
          }}
        >
          {task.priority}
        </Typography>
      )}
      {task.due_date && (
        <Typography variant="caption" color="text.disabled">
          {new Date(task.due_date).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [contactMap, setContactMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, cRes] = await Promise.allSettled([
          api.get('/crm/tasks/'),
          api.get('/crm/contacts/'),
        ]);
        if (tRes.status === 'fulfilled') {
          const d = tRes.value.data;
          setTasks(Array.isArray(d) ? d : d.results ?? []);
        }
        if (cRes.status === 'fulfilled') {
          const d = cRes.value.data;
          const arr = Array.isArray(d) ? d : d.results ?? [];
          const map = {};
          arr.forEach((c) => { map[c.id] = c.full_name || `${c.first_name} ${c.last_name}`; });
          setContactMap(map);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const todayTasks = tasks.filter((t) => t.due_date && t.due_date.split('T')[0] === todayStr);
  const upcomingTasks = tasks.filter((t) => !t.due_date || t.due_date.split('T')[0] > todayStr);

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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderLeft: '3px solid rgba(189,86,42,0.45)',
            borderRadius: 0,
          }}
        >
          <SectionLabel>Today</SectionLabel>
          {todayTasks.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5, color: 'text.disabled' }}>
              <Typography variant="body2">No tasks for today</Typography>
            </Box>
          ) : (
            todayTasks.map((t) => <TaskRow key={t.id} task={t} contactMap={contactMap} />)
          )}
          <Divider />
          <SectionLabel>Upcoming</SectionLabel>
          {upcomingTasks.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5, color: 'text.disabled' }}>
              <Typography variant="body2">No upcoming tasks</Typography>
            </Box>
          ) : (
            upcomingTasks.map((t) => <TaskRow key={t.id} task={t} contactMap={contactMap} />)
          )}
        </Box>
      )}
    </Box>
  );
}
