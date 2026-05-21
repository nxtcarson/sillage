import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from './theme';
import LandingPage from './pages/LandingPage';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/app/DashboardPage';
import ContactsPage from './pages/app/ContactsPage';
import ContactDetailPage from './pages/app/ContactDetailPage';
import PipelinePage from './pages/app/PipelinePage';
import PoliciesPage from './pages/app/PoliciesPage';
import PolicyDetailPage from './pages/app/PolicyDetailPage';
import BoardsPage from './pages/app/BoardsPage';
import BoardDetailPage from './pages/app/BoardDetailPage';
import CalendarPage from './pages/app/CalendarPage';
import TasksPage from './pages/app/TasksPage';
import DocumentsPage from './pages/app/DocumentsPage';
import BillingPage from './pages/app/BillingPage';
import ProfileSettingsPage from './pages/app/ProfileSettingsPage';
import OrgSettingsPage from './pages/app/OrgSettingsPage';
import TeamSettingsPage from './pages/app/TeamSettingsPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

export const ColorModeContext = createContext({ toggle: () => {}, mode: 'light' });

export function useColorMode() {
  return useContext(ColorModeContext);
}

function getInitialMode() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggle: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="contacts/:id" element={<ContactDetailPage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="policies" element={<PoliciesPage />} />
              <Route path="policies/:id" element={<PolicyDetailPage />} />
              <Route path="boards" element={<BoardsPage />} />
              <Route path="boards/:id" element={<BoardDetailPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="settings/profile" element={<ProfileSettingsPage />} />
              <Route path="settings/org" element={<OrgSettingsPage />} />
              <Route path="settings/team" element={<TeamSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
