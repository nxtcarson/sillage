import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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
            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Add contact
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Agent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
                    <Typography variant="body2">No contacts yet</Typography>
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
