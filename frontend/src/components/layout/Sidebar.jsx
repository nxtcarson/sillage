import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  SvgIcon,
} from '@mui/material';

const BRAND = '#BD562A';
const DRAWER_WIDTH = 256;

function NavIcon({ d }) {
  return (
    <SvgIcon sx={{ fontSize: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </SvgIcon>
  );
}

const PRIMARY_NAV = [
  {
    label: 'Dashboard',
    to: '/app/dashboard',
    iconD:
      'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  },
  {
    label: 'Contacts',
    to: '/app/contacts',
    iconD:
      'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  },
  {
    label: 'Pipeline',
    to: '/app/pipeline',
    iconD:
      'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  },
  {
    label: 'Automations',
    to: '/app/automations',
    iconD: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  },
  {
    label: 'Policies',
    to: '/app/policies',
    iconD:
      'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  },
  {
    label: 'Boards',
    to: '/app/boards',
    iconD:
      'M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z',
  },
  {
    label: 'Calendar',
    to: '/app/calendar',
    iconD:
      'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
  },
  {
    label: 'Tasks',
    to: '/app/tasks',
    iconD: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    label: 'Documents',
    to: '/app/documents',
    iconD:
      'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0A2.25 2.25 0 0 1 19.5 16.5h-15a2.25 2.25 0 0 1-2.25-2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 16.91a2.25 2.25 0 0 1-1.07-1.916V14.25',
  },
  {
    label: 'Billing',
    to: '/app/billing',
    iconD:
      'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z',
  },
];

const SETTINGS_NAV = [
  {
    label: 'Profile',
    to: '/app/settings/profile',
    iconD:
      'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  },
  {
    label: 'Company',
    to: '/app/settings/org',
    iconD:
      'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  },
  {
    label: 'Team',
    to: '/app/settings/team',
    iconD:
      'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
  },
];

function NavItem({ label, to, iconD, onClick }) {
  return (
    <ListItem disablePadding sx={{ mb: 0.125 }}>
      <ListItemButton
        component={NavLink}
        to={to}
        onClick={onClick}
        sx={{
          borderRadius: 0,
          borderLeft: '3px solid transparent',
          px: 1.5,
          py: 0.75,
          color: '#64748B',
          transition: 'color 0.15s, border-color 0.15s',
          '&.active': {
            borderLeftColor: BRAND,
            color: BRAND,
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': { color: BRAND },
          },
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.04)',
            color: '#94A3B8',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
          <NavIcon d={iconD} />
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.01em' }}
        />
      </ListItemButton>
    </ListItem>
  );
}

function GeometricDivider() {
  return (
    <Box sx={{ position: 'relative', my: 2, mx: 1.5 }}>
      <Box sx={{ height: 1, bgcolor: 'rgba(189,86,42,0.2)' }} />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width: 5,
          height: 5,
          bgcolor: BRAND,
        }}
      />
    </Box>
  );
}

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(189,86,42,0.12)',
        bgcolor: '#0F172A',
      }}
    >
      <Box
        sx={{
          height: 56,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(189,86,42,0.12)',
          flexShrink: 0,
        }}
      >
        <NavLink to="/app/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Box
            component="img"
            src="/img/sillage-logo.svg"
            alt="Sillage"
            sx={{ width: 26, height: 26 }}
          />
          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 17,
              color: '#F1F5F9',
              letterSpacing: '-0.01em',
            }}
          >
            Sillage
          </Typography>
        </NavLink>
      </Box>

      <Box component="nav" sx={{ flex: 1, overflowY: 'auto', px: 0, py: 1.5 }}>
        <List disablePadding>
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </List>

        <GeometricDivider />

        <Typography
          variant="caption"
          sx={{
            px: 1.75,
            mb: 0.5,
            display: 'block',
            fontWeight: 600,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: 10,
          }}
        >
          Settings
        </Typography>
        <List disablePadding>
          {SETTINGS_NAV.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </List>
      </Box>

      <Box
        sx={{
          px: 0,
          py: 1,
          borderTop: '1px solid rgba(189,86,42,0.12)',
          flexShrink: 0,
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 0,
            borderLeft: '3px solid transparent',
            px: 1.5,
            py: 0.75,
            color: '#EF4444',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
            <SvgIcon sx={{ fontSize: 18 }}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  );
}
