import { useEffect, useState } from 'react';
import {
  Box, Button, Chip, MenuItem, Select, Skeleton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

const STATUS_COLORS = {
  active: 'success',
  expired: 'error',
  pending: 'warning',
  cancelled: 'default',
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [contactMap, setContactMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const [pRes, cRes] = await Promise.allSettled([
          api.get('/crm/policies/'),
          api.get('/crm/contacts/'),
        ]);
        if (pRes.status === 'fulfilled') {
          const d = pRes.value.data;
          setPolicies(Array.isArray(d) ? d : d.results ?? []);
        }
        if (cRes.status === 'fulfilled') {
          const d = cRes.value.data;
          const arr = Array.isArray(d) ? d : d.results ?? [];
          const map = {};
          arr.forEach((c) => { map[c.id] = c.full_name || `${c.first_name} ${c.last_name}`; });
          setContactMap(map);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = statusFilter === 'all'
    ? policies
    : policies.filter((p) => p.status?.toLowerCase() === statusFilter);

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
            sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 600 }}
          >
            Add policy
          </Button>
        }
      />
      <Box sx={{ mb: 2 }}>
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ borderRadius: 0, fontSize: 14, minWidth: 160 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '3px solid rgba(189,86,42,0.45)',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <TableCell>Policy #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expiry</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton variant="text" width="80%" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 5, textAlign: 'center', color: 'text.disabled' }}>
                      <Typography variant="body2">No policies found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    component={Link}
                    to={`/app/policies/${p.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{p.policy_number || `#${p.id}`}</TableCell>
                    <TableCell>{contactMap[p.contact] || '—'}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{p.type || '—'}</TableCell>
                    <TableCell>
                      {p.premium != null ? `$${Number(p.premium).toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.status || 'unknown'}
                        size="small"
                        color={STATUS_COLORS[p.status?.toLowerCase()] || 'default'}
                        sx={{ borderRadius: 0, textTransform: 'capitalize', fontWeight: 600, fontSize: 11 }}
                      />
                    </TableCell>
                    <TableCell>
                      {p.expiry_date ? new Date(p.expiry_date).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
