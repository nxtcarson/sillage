import { Box, Button, Grid, Typography } from '@mui/material';
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
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
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
        </Grid>
      </Grid>
    </Box>
  );
}
