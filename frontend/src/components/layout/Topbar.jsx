import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useColorMode } from '../../App';
import { useAuth } from '../../context/AuthContext';

const BRAND = '#BD562A';

function SearchIcon() {
  return (
    <SvgIcon sx={{ fontSize: 15, color: '#475569' }}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}

function MenuIcon() {
  return (
    <SvgIcon sx={{ fontSize: 20 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" />
    </SvgIcon>
  );
}

function SunIcon() {
  return (
    <SvgIcon sx={{ fontSize: 18 }}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}

function MoonIcon() {
  return (
    <SvgIcon sx={{ fontSize: 18 }}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}

function PlusIcon() {
  return (
    <SvgIcon sx={{ fontSize: 14 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </SvgIcon>
  );
}

export default function Topbar({ onMenuToggle }) {
  const { mode, toggle: toggleTheme } = useColorMode();
  const { user, org, logout } = useAuth() ?? {};
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarAnchor, setAvatarAnchor] = useState(null);

  const avatarLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#0F172A',
        borderBottom: '1px solid rgba(189,86,42,0.1)',
        color: 'text.primary',
        height: 56,
        justifyContent: 'center',
        zIndex: (t) => t.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: '56px !important', px: { xs: 2, md: 3 } }}>
        <IconButton
          onClick={onMenuToggle}
          size="small"
          sx={{ display: { md: 'none' }, mr: 0.5, color: '#94A3B8' }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid #334155',
            px: 0.5,
            py: 0.5,
            minWidth: 200,
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{ fontSize: 13, flex: 1, color: '#94A3B8' }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          size="small"
          startIcon={<PlusIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            bgcolor: BRAND,
            '&:hover': { bgcolor: '#a84a24' },
            borderRadius: 0,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 13,
            px: 1.75,
            py: 0.625,
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          New
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>Contact</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Task</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Policy</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Lead</MenuItem>
        </Menu>

        <Tooltip title="Toggle theme">
          <IconButton onClick={toggleTheme} size="small" sx={{ color: '#64748B' }}>
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Tooltip>

        {org?.name && (
          <Typography
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#64748B',
              display: { xs: 'none', sm: 'block' },
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {org.name}
          </Typography>
        )}

        <Tooltip title={user?.name || user?.email || 'Account'}>
          <Avatar
            onClick={(e) => setAvatarAnchor(e.currentTarget)}
            sx={{
              width: 30,
              height: 30,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: 'rgba(189,86,42,0.15)',
              color: BRAND,
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            {avatarLetter}
          </Avatar>
        </Tooltip>
        <Menu anchorEl={avatarAnchor} open={Boolean(avatarAnchor)} onClose={() => setAvatarAnchor(null)}>
          {user?.name && (
            <MenuItem disabled sx={{ fontWeight: 600, opacity: '1 !important' }}>
              {user.name}
            </MenuItem>
          )}
          <MenuItem onClick={() => { setAvatarAnchor(null); logout?.(); }}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
