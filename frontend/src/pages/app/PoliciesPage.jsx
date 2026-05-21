import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

export default function PoliciesPage() {
  return (
    <Box>
      <PageHeader
        title="Policies"
        subtitle="Track every policy, carrier, and renewal"
        action={
          <Button
            variant="contained"
            component={Link}
            to="/app/policies/new"
            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Add policy
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Policy #</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Carrier</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Renewal</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
                    <Typography variant="body2">No policies yet</Typography>
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
