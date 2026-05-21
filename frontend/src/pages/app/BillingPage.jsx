import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../api/axios';

const BRAND = '#BD562A';

function AngularCorner({ position }) {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');
  return (
    <Box
      sx={{
        position: 'absolute',
        top: isTop ? 0 : 'auto',
        bottom: isTop ? 'auto' : 0,
        left: isLeft ? 0 : 'auto',
        right: isLeft ? 'auto' : 0,
        width: 10,
        height: 10,
        borderTop: isTop ? `1px solid ${BRAND}` : 'none',
        borderBottom: isTop ? 'none' : `1px solid ${BRAND}`,
        borderLeft: isLeft ? `1px solid ${BRAND}` : 'none',
        borderRight: isLeft ? 'none' : `1px solid ${BRAND}`,
      }}
    />
  );
}

export default function BillingPage() {
  const [plans, setPlans] = useState([]);
  const [activeTier, setActiveTier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, subRes] = await Promise.allSettled([
          api.get('/billing/plans/'),
          api.get('/billing/subscriptions/'),
        ]);

        if (plansRes.status === 'fulfilled') {
          const d = plansRes.value.data;
          setPlans(Array.isArray(d) ? d : d.results ?? []);
        }

        if (subRes.status === 'fulfilled') {
          const d = subRes.value.data;
          const subs = Array.isArray(d) ? d : d.results ?? [];
          const active = subs.find((s) => s.status === 'active');
          if (active?.plan?.tier) setActiveTier(active.plan.tier);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayPlans = plans.length > 0
    ? plans
    : [
        { id: 'free', name: 'Free', tier: 'free', price: '$0', features: ['2 seats', '3 boards', '100 contacts'] },
        { id: 'basic', name: 'Basic', tier: 'basic', price: '$4', features: ['5 seats', '5GB storage', 'Email support'] },
        { id: 'standard', name: 'Standard', tier: 'standard', price: '$8', features: ['10 seats', 'Calendar view', '20GB storage'] },
        { id: 'pro', name: 'Pro', tier: 'pro', price: '$12', features: ['25 seats', 'Private boards', '50GB storage'] },
      ];

  return (
    <Box>
      <PageHeader title="Billing" subtitle="Manage your subscription and plan" />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <>
          {activeTier && (
            <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'rgba(189,86,42,0.3)', borderLeft: `3px solid ${BRAND}`, borderRadius: 0 }}>
              <Typography variant="body2" color="text.secondary">
                Current plan:{' '}
                <Typography component="span" fontWeight={700} color="primary.main" sx={{ textTransform: 'capitalize' }}>
                  {activeTier}
                </Typography>
              </Typography>
            </Box>
          )}
          <Grid container spacing={2.5} sx={{ maxWidth: 900 }}>
            {displayPlans.map((plan) => {
              const isActive = activeTier === plan.tier;
              const isPopular = plan.tier === 'standard';
              const highlighted = isActive || isPopular;

              return (
                <Grid item xs={12} sm={6} md={3} key={plan.id}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: highlighted ? BRAND : 'divider',
                      borderTop: highlighted ? `2px solid ${BRAND}` : '1px solid',
                      borderTopColor: highlighted ? BRAND : 'divider',
                      borderRadius: 0,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'border-color 0.15s',
                      '&:hover': { borderColor: 'rgba(189,86,42,0.4)' },
                    }}
                  >
                    <AngularCorner position="top-left" />
                    <AngularCorner position="top-right" />
                    <AngularCorner position="bottom-left" />
                    <AngularCorner position="bottom-right" />

                    {isActive && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -1,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: BRAND,
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          px: 1.5,
                          py: 0.375,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Current plan
                      </Box>
                    )}
                    {!isActive && isPopular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -1,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: BRAND,
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          px: 1.5,
                          py: 0.375,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Most popular
                      </Box>
                    )}

                    <Box sx={{ flex: 1, p: 2.5, pt: highlighted ? 3 : 2.5 }}>
                      <Typography
                        sx={{
                          fontFamily: '"Montserrat", sans-serif',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#94A3B8',
                        }}
                      >
                        {plan.name}
                      </Typography>
                      <Box sx={{ mt: 1.5, mb: 0.25 }}>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 32,
                            fontWeight: 700,
                            color: highlighted ? BRAND : '#F1F5F9',
                          }}
                        >
                          {plan.price ?? `$${plan.tier === 'free' ? '0' : '?'}`}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {plan.tier === 'free' ? 'forever' : '/month'}
                      </Typography>
                      <Divider sx={{ my: 2, borderColor: 'rgba(189,86,42,0.15)' }} />
                      <Box component="ul" sx={{ pl: 2, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {(Array.isArray(plan.features) ? plan.features : plan.features?.items ?? []).map((f, i) => (
                          <Typography key={i} component="li" variant="body2" color="text.secondary">
                            {f}
                          </Typography>
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ px: 2.5, pb: 2.5 }}>
                      <Button
                        fullWidth
                        variant={highlighted ? 'contained' : 'outlined'}
                        disabled={isActive}
                        sx={{
                          borderRadius: 0,
                          fontWeight: 600,
                          fontSize: 12,
                          letterSpacing: '0.05em',
                          ...(highlighted && !isActive && { bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' } }),
                        }}
                      >
                        {isActive ? 'Active' : plan.tier === 'free' ? 'Get started' : 'Subscribe'}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
}
