import { useEffect, useState } from 'react';
import {
  Box, Button, Link as MuiLink, Skeleton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [contactMap, setContactMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dRes, cRes] = await Promise.allSettled([
          api.get('/crm/documents/'),
          api.get('/crm/contacts/'),
        ]);
        if (dRes.status === 'fulfilled') {
          const d = dRes.value.data;
          setDocuments(Array.isArray(d) ? d : d.results ?? []);
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
                <TableCell>Linked to</TableCell>
                <TableCell>Uploaded by</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton variant="text" width="75%" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 5, textAlign: 'center', color: 'text.disabled' }}>
                      <Typography variant="body2">No documents yet</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => {
                  const url = doc.download_url || doc.firebase_storage_url || doc.file;
                  const linkedTo = doc.contact
                    ? (contactMap[doc.contact] || `Contact #${doc.contact}`)
                    : doc.policy
                    ? `Policy #${doc.policy}`
                    : '—';
                  return (
                    <TableRow key={doc.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                      <TableCell>{linkedTo}</TableCell>
                      <TableCell>{doc.uploaded_by || '—'}</TableCell>
                      <TableCell>
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell align="right">
                        {url ? (
                          <MuiLink
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="none"
                            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontWeight: 600, fontSize: 13 }}
                          >
                            <DownloadIcon fontSize="small" />
                            View
                          </MuiLink>
                        ) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
