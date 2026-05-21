import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
          >
            Upload
          </Button>
        }
      />
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '1px solid rgba(189,86,42,0.25)',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <TableCell>Name</TableCell>
                <TableCell>Linked to</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 5, textAlign: 'center', color: 'text.disabled' }}>
                    <Typography variant="body2">No documents yet</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
