import { useEffect, useState } from 'react';
import {
  Box, Button, InputAdornment, Skeleton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/crm/contacts/')
      .then((res) => {
        const data = res.data;
        setContacts(Array.isArray(data) ? data : data.results ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.full_name || `${c.first_name} ${c.last_name}`).toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  });

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
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 0, fontSize: 14 },
          }}
          sx={{ width: 300 }}
        />
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Created</TableCell>
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
                      <Typography variant="body2">
                        {search ? 'No contacts match your search' : 'No contacts yet'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    component={Link}
                    to={`/app/contacts/${c.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {c.full_name || `${c.first_name} ${c.last_name}`}
                    </TableCell>
                    <TableCell>{c.email || '—'}</TableCell>
                    <TableCell>{c.phone || '—'}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{c.status || '—'}</TableCell>
                    <TableCell>{c.source || '—'}</TableCell>
                    <TableCell>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
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
