import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const BRAND = '#BD562A';

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', features: ['2 seats', '3 boards', '100 contacts'], popular: false },
  { name: 'Basic', price: '$4', period: '/month', features: ['5 seats', '5GB storage', 'Email support'], popular: false },
  { name: 'Standard', price: '$8', period: '/month', features: ['10 seats', 'Calendar view', '20GB storage'], popular: true },
  { name: 'Pro', price: '$12', period: '/month', features: ['25 seats', 'Private boards', '50GB storage'], popular: false },
];

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
  return (
    <Box>
      <PageHeader title="Billing" subtitle="Manage your subscription and plan" />
      <Grid container spacing={2.5} sx={{ maxWidth: 900 }}>
        {PLANS.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.name}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: plan.popular ? BRAND : 'divider',
                borderTop: plan.popular ? `2px solid ${BRAND}` : '1px solid',
                borderTopColor: plan.popular ? BRAND : 'divider',
                borderRadius: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'border-color 0.15s',
                '&:hover': {
                  borderColor: 'rgba(189,86,42,0.4)',
                },
              }}
            >
              <AngularCorner position="top-left" />
              <AngularCorner position="top-right" />
              <AngularCorner position="bottom-left" />
              <AngularCorner position="bottom-right" />

              {plan.popular && (
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

              <Box sx={{ flex: 1, p: 2.5, pt: plan.popular ? 3 : 2.5 }}>
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
                      color: plan.popular ? BRAND : '#F1F5F9',
                    }}
                  >
                    {plan.price}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{plan.period}</Typography>
                <Divider sx={{ my: 2, borderColor: 'rgba(189,86,42,0.15)' }} />
                <Box component="ul" sx={{ pl: 2, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {plan.features.map((f) => (
                    <Typography key={f} component="li" variant="body2" color="text.secondary">{f}</Typography>
                  ))}
                </Box>
              </Box>

              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: 0,
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    ...(plan.popular && { bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' } }),
                  }}
                >
                  {plan.name === 'Free' ? 'Get started' : 'Subscribe'}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
