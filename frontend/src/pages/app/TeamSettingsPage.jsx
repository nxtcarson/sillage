import { Avatar, Box, Button, Chip, Divider, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const BRAND = '#BD562A';

export default function TeamSettingsPage() {
  return (
    <Box sx={{ maxWidth: 760 }}>
      <PageHeader
        title="Team"
        subtitle="Manage members and their roles"
        action={
          <Button
            variant="contained"
            sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Invite member
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={600}>Members</Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>Joined</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>
                <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
                  <Typography variant="body2">No team members yet. Invite someone to get started.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Pending invitations</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3, color: 'text.disabled' }}>
          <Typography variant="body2">No pending invitations</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
