import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

function KanbanCard({ card }) {
  return (
    <Box
      sx={{
        mb: 1.5,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '3px solid rgba(189,86,42,0.45)',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="body2" fontWeight={600}>{card.title}</Typography>
      {card.description && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {card.description}
        </Typography>
      )}
      {card.due_date && (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
          Due: {new Date(card.due_date).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}

export default function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/boards/boards/${id}/`)
      .then((res) => setBoard(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const columns = board?.columns ?? [];

  return (
    <Box>
      <PageHeader
        title={board?.name || 'Board'}
        subtitle={board?.description || `Board #${id}`}
        action={
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', borderRadius: 0 }}
          >
            Add column
          </Button>
        }
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 480 }}>
          {columns.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: 320,
                border: '1px dashed',
                borderColor: 'rgba(189,86,42,0.2)',
                color: 'text.disabled',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography variant="body2">No columns yet</Typography>
            </Box>
          ) : (
            columns
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((col, i) => (
                <Paper
                  key={col.id}
                  variant="outlined"
                  sx={{
                    minWidth: 256,
                    flex: '0 0 256px',
                    borderRadius: 0,
                    borderTop: `2px solid ${col.color || (i === columns.length - 1 ? '#22c55e' : 'rgba(189,86,42,0.2)')}`,
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
                    {col.name}{' '}
                    <Box component="span" sx={{ color: '#475569' }}>
                      {col.cards?.length ?? 0}
                    </Box>
                  </Typography>
                  {(col.cards ?? [])
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((card) => (
                      <KanbanCard key={card.id} card={card} />
                    ))}
                  <Button
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 0,
                      borderStyle: 'dashed',
                      color: 'text.disabled',
                      borderColor: 'divider',
                      mt: 1,
                    }}
                  >
                    + Add card
                  </Button>
                </Paper>
              ))
          )}
        </Box>
      )}
    </Box>
  );
}
