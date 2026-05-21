import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

export default function ContactsPage() {
  return (
    <Box>
      <PageHeader
        title="Contacts"
        subtitle="All clients, leads, and prospects"
        action={
          <Button
            variant="contained"
            component={Link}
            to="/app/contacts/new"
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
          >
            Add contact
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
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Agent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 5, textAlign: 'center', color: 'text.disabled' }}>
                    <Typography variant="body2">No contacts yet</Typography>
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
