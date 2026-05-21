import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

const FALLBACK_STAGES = [
  { id: 'new', name: 'New Lead' },
  { id: 'contacted', name: 'Contacted' },
  { id: 'quoted', name: 'Quoted' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'won', name: 'Won' },
  { id: 'lost', name: 'Lost' },
];

function LeadCard({ lead, contactMap }) {
  const contactName = contactMap[lead.contact] || `Contact #${lead.contact}`;
  return (
    <Box
      sx={{
        mb: 1.5,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '3px solid rgba(189,86,42,0.45)',
        bgcolor: 'background.paper',
        cursor: 'default',
      }}
    >
      <Typography variant="body2" fontWeight={600} noWrap>{contactName}</Typography>
      {lead.value && (
        <Typography variant="caption" color="primary.main" fontWeight={600}>
          ${Number(lead.value).toLocaleString()}
        </Typography>
      )}
      {lead.expected_close && (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
          Close: {new Date(lead.expected_close).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}

export default function PipelinePage() {
  const [stages, setStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [contactMap, setContactMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [stagesRes, leadsRes, contactsRes] = await Promise.allSettled([
          api.get('/crm/pipeline-stages/'),
          api.get('/crm/leads/'),
          api.get('/crm/contacts/'),
        ]);

        if (stagesRes.status === 'fulfilled') {
          const d = stagesRes.value.data;
          const arr = Array.isArray(d) ? d : d.results ?? [];
          setStages(arr.length > 0 ? arr : FALLBACK_STAGES);
        } else {
          setStages(FALLBACK_STAGES);
        }

        if (leadsRes.status === 'fulfilled') {
          const d = leadsRes.value.data;
          setLeads(Array.isArray(d) ? d : d.results ?? []);
        }

        if (contactsRes.status === 'fulfilled') {
          const d = contactsRes.value.data;
          const arr = Array.isArray(d) ? d : d.results ?? [];
          const map = {};
          arr.forEach((c) => {
            map[c.id] = c.full_name || `${c.first_name} ${c.last_name}`;
          });
          setContactMap(map);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const leadsPerStage = (stageId) => leads.filter((l) => l.stage === stageId);

  return (
    <Box>
      <PageHeader title="Pipeline" subtitle="Track leads from first contact to close" />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 500 }}>
          {stages.map((stage, i) => {
            const stageLeads = leadsPerStage(stage.id);
            const isWon = stage.name?.toLowerCase() === 'won';
            return (
              <Box
                key={stage.id}
                sx={{
                  minWidth: 240,
                  flex: '0 0 240px',
                  borderRadius: 0,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderTop: `2px solid ${isWon ? '#BD562A' : 'rgba(189,86,42,0.15)'}`,
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.02)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    mb: 2,
                  }}
                >
                  {stage.name}{' '}
                  <Box component="span" sx={{ color: '#475569', ml: 0.5 }}>
                    {stageLeads.length}
                  </Box>
                </Typography>
                {stageLeads.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, color: 'text.disabled' }}>
                    <Typography variant="caption">No leads</Typography>
                  </Box>
                ) : (
                  stageLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} contactMap={contactMap} />
                  ))
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
