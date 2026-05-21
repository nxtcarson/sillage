import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DRAWER_WIDTH = 256;

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const sidebarContent = <Sidebar onClose={() => setMobileOpen(false)} />;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', position: 'relative', height: '100%' },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Topbar onMenuToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
