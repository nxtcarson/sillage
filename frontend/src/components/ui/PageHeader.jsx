import { Box, Typography, Divider } from '@mui/material';

const BRAND = '#BD562A';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.5 }}>
          <Box sx={{ width: 3, bgcolor: BRAND, flexShrink: 0 }} />
          <Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: { xs: 22, md: 26 },
                color: '#F1F5F9',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#64748B',
                  mt: 0.75,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Divider sx={{ borderColor: 'rgba(189,86,42,0.15)' }} />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%) rotate(45deg)',
            width: 5,
            height: 5,
            bgcolor: BRAND,
          }}
        />
      </Box>
    </Box>
  );
}
