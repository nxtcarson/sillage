import { Box, Paper, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

const PLACEHOLDER_COLUMNS = ['To do', 'In progress', 'In review', 'Done'];

export default function BoardDetailPage() {
  const { id } = useParams();

  return (
    <Box>
      <PageHeader
        title="Board"
        subtitle={`Board #${id}`}
        action={
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Add column
          </Button>
        }
      />
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 480 }}>
        {PLACEHOLDER_COLUMNS.map((col, i) => (
          <Paper
            key={col}
            variant="outlined"
            sx={{
              minWidth: 256,
              flex: '0 0 256px',
              borderRadius: 2,
              borderTopWidth: 3,
              borderTopColor: i === PLACEHOLDER_COLUMNS.length - 1 ? 'success.main' : 'divider',
              p: 2,
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
              {col}{' '}
              <Typography component="span" variant="body2" color="text.disabled">0</Typography>
            </Typography>
            <Button
              size="small"
              fullWidth
              variant="outlined"
              sx={{ textTransform: 'none', borderRadius: 2, borderStyle: 'dashed', color: 'text.disabled', borderColor: 'divider' }}
            >
              + Add card
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
