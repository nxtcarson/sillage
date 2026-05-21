import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

export default function DocumentsPage() {
  return (
    <Box>
      <PageHeader
        title="Documents"
        subtitle="Manage files and attachments for your contacts and policies"
        action={
          <Button
            variant="contained"
            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Upload
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Linked to</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Uploaded</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
                    <Typography variant="body2">No documents yet</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
