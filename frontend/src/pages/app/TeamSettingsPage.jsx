import { Avatar, Box, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
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
            sx={{ bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' }, borderRadius: 0, fontWeight: 600 }}
          >
            Invite member
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
          mb: 2,
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(255,255,255,0.015)',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#64748B',
            }}
          >
            Members
          </Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
              <TableCell>Member</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>
                <Box sx={{ py: 5, textAlign: 'center', color: 'text.disabled' }}>
                  <Typography variant="body2">No team members yet. Invite someone to get started.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '1px solid rgba(189,86,42,0.25)',
          borderRadius: 0,
          p: 2.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748B',
            mb: 1.5,
          }}
        >
          Pending invitations
        </Typography>
        <Divider sx={{ mb: 2, borderColor: 'rgba(189,86,42,0.15)' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3, color: 'text.disabled' }}>
          <Typography variant="body2">No pending invitations</Typography>
        </Box>
      </Box>
    </Box>
  );
}
