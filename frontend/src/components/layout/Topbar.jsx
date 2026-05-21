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
} from '@mui/material';
import { useColorMode } from '../../App';

const BRAND = '#BD562A';

function SearchIcon() {
  return (
    <SvgIcon sx={{ fontSize: 16, color: 'text.disabled' }}>
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
    <SvgIcon sx={{ fontSize: 20 }}>
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
    <SvgIcon sx={{ fontSize: 20 }}>
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
    <SvgIcon sx={{ fontSize: 16 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </SvgIcon>
  );
}

export default function Topbar({ onMenuToggle }) {
  const { mode, toggle: toggleTheme } = useColorMode();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
        height: 64,
        justifyContent: 'center',
        zIndex: (t) => t.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: '64px !important', px: { xs: 2, md: 3 } }}>
        <IconButton
          onClick={onMenuToggle}
          size="small"
          sx={{ display: { md: 'none' }, mr: 0.5 }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 1.5,
            py: 0.75,
            minWidth: 220,
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{ fontSize: 14, flex: 1, color: 'text.primary' }}
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
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
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
          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 13,
              fontWeight: 700,
              bgcolor: '#f3ddd5',
              color: BRAND,
              cursor: 'pointer',
            }}
          >
            U
          </Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
