import { Box, Button, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

export default function BoardsPage() {
  return (
    <Box>
      <PageHeader
        title="Boards"
        subtitle="Kanban boards for renewals, onboarding, and custom workflows"
        action={
          <Button
            variant="contained"
            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            New board
          </Button>
        }
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              border: 2,
              borderStyle: 'dashed',
              borderColor: 'divider',
              borderRadius: 3,
              color: 'text.disabled',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="body1" fontWeight={500}>No boards yet</Typography>
            <Typography variant="body2">Create a board to organize work</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
