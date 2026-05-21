import { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Grid, Paper, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/boards/boards/')
      .then((res) => {
        const d = res.data;
        setBoards(Array.isArray(d) ? d : d.results ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <PageHeader
        title="Boards"
        subtitle="Kanban boards for renewals, onboarding, and custom workflows"
        action={
          <Button
            variant="contained"
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
          >
            New board
          </Button>
        }
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : boards.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 320,
            border: '1px dashed',
            borderColor: 'rgba(189,86,42,0.2)',
            borderRadius: 0,
            color: 'text.disabled',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body1" fontWeight={500}>No boards yet</Typography>
          <Typography variant="body2">Create a board to organize work</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} key={board.id}>
              <Paper
                variant="outlined"
                component={Link}
                to={`/app/boards/${board.id}`}
                sx={{
                  p: 2.5,
                  borderRadius: 0,
                  borderLeft: '3px solid rgba(189,86,42,0.45)',
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                  '&:hover': { borderLeftColor: 'primary.main' },
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom noWrap>
                  {board.name}
                </Typography>
                {board.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }} noWrap>
                    {board.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.disabled">
                  {board.columns?.length ?? 0} column{board.columns?.length !== 1 ? 's' : ''}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
