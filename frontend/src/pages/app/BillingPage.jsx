import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

const BRAND = '#BD562A';

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', features: ['2 seats', '3 boards', '100 contacts'], popular: false },
  { name: 'Basic', price: '$4', period: '/month', features: ['5 seats', '5GB storage', 'Email support'], popular: false },
  { name: 'Standard', price: '$8', period: '/month', features: ['10 seats', 'Calendar view', '20GB storage'], popular: true },
  { name: 'Pro', price: '$12', period: '/month', features: ['25 seats', 'Private boards', '50GB storage'], popular: false },
];

export default function BillingPage() {
  return (
    <Box>
      <PageHeader title="Billing" subtitle="Manage your subscription and plan" />
      <Grid container spacing={2.5} sx={{ maxWidth: 900 }}>
        {PLANS.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.name}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: plan.popular ? BRAND : 'divider',
                borderWidth: plan.popular ? 2 : 1,
                position: 'relative',
              }}
            >
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: BRAND,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.25,
                    borderRadius: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Most popular
                </Box>
              )}
              <CardContent sx={{ flex: 1, p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={600}>{plan.name}</Typography>
                <Box sx={{ mt: 1.5, mb: 0.5 }}>
                  <Typography component="span" variant="h4" fontWeight={700}>{plan.price}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{plan.period}</Typography>
                <Divider sx={{ my: 2 }} />
                <Box component="ul" sx={{ pl: 2, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {plan.features.map((f) => (
                    <Typography key={f} component="li" variant="body2" color="text.secondary">{f}</Typography>
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 600,
                    ...(plan.popular && { bgcolor: BRAND, '&:hover': { bgcolor: '#a84a24' } }),
                  }}
                >
                  {plan.name === 'Free' ? 'Get started' : 'Subscribe'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
