import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, Container, Typography, Button, Grid,
  Card, CardContent, IconButton, Chip, Divider, Paper,
  useTheme, useMediaQuery, Drawer, List, ListItem,
  ListItemButton, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import BoltIcon from '@mui/icons-material/Bolt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import StarIcon from '@mui/icons-material/Star';
import { useColorMode } from '../App';

const BRAND = '#BD562A';

function CheckItem({ children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <CheckIcon sx={{ color: BRAND, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
      <Typography variant="body2" color="text.secondary">{children}</Typography>
    </Box>
  );
}

function MockWindowBar({ label }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25,
      borderBottom: '1px solid', borderColor: 'divider',
      bgcolor: 'action.hover',
    }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FC8888' }} />
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FBCA45' }} />
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#5AC468' }} />
      <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>{label}</Typography>
    </Box>
  );
}

function DashboardMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const sl = (light, d) => (dark ? d : light);

  return (
    <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <MockWindowBar label="Dashboard — Sillage" />
      <Box sx={{ display: 'flex', minHeight: 280 }}>
        <Box sx={{
          width: 56, flexShrink: 0, borderRight: '1px solid', borderColor: 'divider',
          bgcolor: sl('#F8FAFC', '#0F172A'), p: 1, display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          <Box sx={{ height: 32, borderRadius: 1.5, bgcolor: sl('#FDE8DC', 'rgba(189,86,42,0.25)') }} />
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ height: 24, borderRadius: 1, bgcolor: sl('#E2E8F0', '#334155') }} />
          ))}
        </Box>
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ height: 32, flex: 1, borderRadius: 1.5, bgcolor: sl('#F1F5F9', '#334155') }} />
            <Box sx={{ height: 32, width: 72, borderRadius: 1.5, bgcolor: BRAND }} />
          </Box>
          <Grid container spacing={1}>
            {[
              { label: 'New leads', bg: sl('#DBEAFE', 'rgba(59,130,246,0.2)'), border: sl('#BFDBFE', 'rgba(59,130,246,0.3)') },
              { label: 'Quoted', bg: sl('#FEF3C7', 'rgba(245,158,11,0.2)'), border: sl('#FDE68A', 'rgba(245,158,11,0.3)') },
              { label: 'Closed', bg: sl('#DCFCE7', 'rgba(34,197,94,0.2)'), border: sl('#BBF7D0', 'rgba(34,197,94,0.3)'), accent: true },
            ].map(({ label, bg, border, accent }) => (
              <Grid item xs={4} key={label}>
                <Box sx={{
                  borderRadius: 1.5, bgcolor: sl('#F8FAFC', '#0F172A'), p: 1,
                  border: '1px solid', borderColor: accent ? BRAND : 'divider',
                }}>
                  <Typography variant="caption" sx={{ color: accent ? BRAND : 'text.disabled', fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Box sx={{ height: 28, borderRadius: 1, bgcolor: bg, border: '1px solid', borderColor: border }} />
                    {accent && <Box sx={{ height: 28, borderRadius: 1, bgcolor: bg, border: '1px solid', borderColor: border }} />}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
            <Box sx={{ flex: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', p: 1 }}>
              <Typography variant="caption" color="text.disabled">Active policies</Typography>
              <Typography variant="h6" fontWeight={700} color="text.primary">127</Typography>
            </Box>
            <Box sx={{ flex: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', p: 1 }}>
              <Typography variant="caption" color="text.disabled">Renewals this week</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: BRAND }}>8</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function RenewalsMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const sl = (l, d) => (dark ? d : l);
  const rows = [
    { initials: 'J', name: 'Johnson · Auto', sub: 'Renews May 24 · State Farm', badge: 'Active', badgeBg: sl('#DCFCE7', 'rgba(34,197,94,0.2)'), badgeColor: sl('#15803D', '#4ADE80') },
    { initials: 'M', name: 'Martinez · Home', sub: 'Renews May 21 · Allstate', badge: 'Due soon', badgeBg: sl('#FEF3C7', 'rgba(245,158,11,0.2)'), badgeColor: sl('#B45309', '#FCD34D'), highlight: true },
    { initials: 'C', name: 'Chen · Life', sub: 'Renews Jun 2 · Northwestern', badge: 'Active', badgeBg: sl('#DCFCE7', 'rgba(34,197,94,0.2)'), badgeColor: sl('#15803D', '#4ADE80') },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" fontWeight={600}>Upcoming renewals</Typography>
        <Typography variant="caption" sx={{ color: BRAND, fontWeight: 600 }}>This week</Typography>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rows.map((r) => (
          <Box key={r.name} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 1.5,
            border: '1px solid', borderColor: r.highlight ? sl('#FDE8DC', 'rgba(189,86,42,0.3)') : 'divider',
            bgcolor: r.highlight ? sl('rgba(253,232,220,0.4)', 'rgba(189,86,42,0.08)') : sl('#F8FAFC', 'transparent'),
          }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: sl('#F1F5F9', '#334155'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">{r.initials}</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} noWrap>{r.name}</Typography>
              <Typography variant="caption" color="text.disabled" noWrap>{r.sub}</Typography>
            </Box>
            <Box sx={{ px: 1.5, py: 0.25, borderRadius: 10, bgcolor: r.badgeBg, flexShrink: 0 }}>
              <Typography variant="caption" sx={{ color: r.badgeColor, fontWeight: 600 }}>{r.badge}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function ContactsMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const sl = (l, d) => (dark ? d : l);

  const contacts = [
    { initials: 'MJ', name: 'Maria Johnson', email: 'maria@email.com', status: 'Client', statusColor: sl('#15803D', '#4ADE80'), statusBg: sl('#DCFCE7', 'rgba(34,197,94,0.2)'), agent: 'You', avatarBg: sl('#FDE8DC', 'rgba(189,86,42,0.25)'), avatarColor: sl('#9E3E18', '#D4784D') },
    { initials: 'DW', name: 'David Wong', email: 'david@email.com', status: 'Prospect', statusColor: sl('#B45309', '#FCD34D'), statusBg: sl('#FEF3C7', 'rgba(245,158,11,0.2)'), agent: 'Sarah K.', avatarBg: sl('#DBEAFE', 'rgba(59,130,246,0.2)'), avatarColor: sl('#1D4ED8', '#93C5FD') },
    { initials: 'AL', name: 'Amy Lewis', email: 'amy@email.com', status: 'Lead', statusColor: sl('#1D4ED8', '#93C5FD'), statusBg: sl('#DBEAFE', 'rgba(59,130,246,0.2)'), agent: 'You', avatarBg: sl('#F3E8FF', 'rgba(168,85,247,0.2)'), avatarColor: sl('#7E22CE', '#C084FC') },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <MockWindowBar label="Contacts — Sillage" />
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Box sx={{ height: 36, flex: 1, borderRadius: 1.5, bgcolor: sl('#F1F5F9', '#334155') }} />
          <Box sx={{ height: 36, width: 72, borderRadius: 1.5, bgcolor: BRAND }} />
        </Box>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', px: 1.5, py: 1, bgcolor: sl('#F8FAFC', '#0F172A'), borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ flex: 1, textTransform: 'uppercase', letterSpacing: 0.8 }}>Name</Typography>
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ width: 72, textTransform: 'uppercase', letterSpacing: 0.8 }}>Status</Typography>
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ width: 56, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'right' }}>Agent</Typography>
          </Box>
          {contacts.map((c) => (
            <Box key={c.name} sx={{
              display: 'flex', alignItems: 'center', px: 1.5, py: 1.25,
              borderBottom: '1px solid', borderColor: 'divider',
              '&:last-child': { borderBottom: 'none' },
              '&:hover': { bgcolor: 'action.hover' },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: c.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="caption" sx={{ color: c.avatarColor, fontWeight: 700 }}>{c.initials}</Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>{c.name}</Typography>
                  <Typography variant="caption" color="text.disabled" noWrap>{c.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ width: 72 }}>
                <Box sx={{ display: 'inline-block', px: 1, py: 0.25, borderRadius: 10, bgcolor: c.statusBg }}>
                  <Typography variant="caption" sx={{ color: c.statusColor, fontWeight: 600 }}>{c.status}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ width: 56, textAlign: 'right' }}>{c.agent}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

function BoardsMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const sl = (l, d) => (dark ? d : l);

  const cols = [
    { title: 'To do', count: 2, accent: sl('#94A3B8', '#64748B'), cards: [{ text: 'Call Johnson', due: 'Due May 22' }, { text: 'Send quote', due: 'Due May 25' }] },
    { title: 'In progress', count: 1, accent: '#FBCA45', cards: [{ text: 'Martinez renewal', due: 'Due May 21', tag: 'In review', tagBg: sl('#FEF3C7', 'rgba(245,158,11,0.2)'), tagColor: sl('#B45309', '#FCD34D') }] },
    { title: 'Done', count: 3, accent: '#5AC468', cards: [{ text: 'Park policy sent', due: 'May 19', done: true }] },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <MockWindowBar label="Renewals — Sillage" />
      <Box sx={{ p: 1.5, overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 1.5, minWidth: 320 }}>
          {cols.map((col) => (
            <Box key={col.title} sx={{
              flex: 1, borderRadius: 1.5, p: 1.5,
              bgcolor: sl('#F1F5F9', 'rgba(51,65,85,0.4)'),
              borderTop: `2px solid ${col.accent}`,
            }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                {col.title} <span style={{ fontWeight: 400, opacity: 0.6 }}>{col.count}</span>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {col.cards.map((card) => (
                  <Paper key={card.text} elevation={1} sx={{
                    p: 1.25, borderRadius: 1.5,
                    opacity: card.done ? 0.65 : 1,
                    border: '1px solid', borderColor: 'divider',
                  }}>
                    <Typography variant="body2" fontWeight={500} sx={{ textDecoration: card.done ? 'line-through' : 'none', color: card.done ? 'text.secondary' : 'text.primary' }}>
                      {card.text}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">{card.due}</Typography>
                    {card.tag && (
                      <Box sx={{ mt: 0.75, display: 'inline-block', px: 1, py: 0.25, borderRadius: 10, bgcolor: card.tagBg }}>
                        <Typography variant="caption" sx={{ color: card.tagColor, fontWeight: 600 }}>{card.tag}</Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

function CalendarMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  const events = [
    { dot: BRAND, title: 'Renewal Call', sub: '9:00 AM · Maria Johnson', bg: dark ? 'rgba(189,86,42,0.15)' : 'rgba(253,232,220,0.6)', border: dark ? 'rgba(189,86,42,0.3)' : 'rgba(253,200,170,0.8)', today: true },
    { dot: '#22C55E', title: 'Follow-up', sub: '2:00 PM · David Wong', bg: dark ? 'rgba(34,197,94,0.1)' : 'rgba(240,253,244,0.8)', border: dark ? 'rgba(34,197,94,0.2)' : '#BBF7D0', today: true },
    { dot: '#60A5FA', title: 'Team Meeting', sub: '10:00 AM · All agents', bg: dark ? 'rgba(96,165,250,0.1)' : 'rgba(239,246,255,0.8)', border: dark ? 'rgba(96,165,250,0.2)' : '#BFDBFE', label: 'Thu, May 22' },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <MockWindowBar label="Calendar — Sillage" />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>May 2026</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {['<', '>'].map((ch) => (
              <Box key={ch} sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">{ch}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Typography variant="caption" fontWeight={700} sx={{ color: BRAND, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
          Today · Wed, May 21
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {events.map((ev) => (
            <React.Fragment key={ev.title}>
              {ev.label && (
                <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mt: 0.5 }}>
                  {ev.label}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, borderRadius: 1.5, bgcolor: ev.bg, border: `1px solid ${ev.border}` }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ev.dot, flexShrink: 0, mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>{ev.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{ev.sub}</Typography>
                </Box>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

function TasksMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const sl = (l, d) => (dark ? d : l);

  const tasks = [
    { text: 'Call Maria about renewal', sub: 'Due May 21 · Maria Johnson', urgent: true, done: false },
    { text: 'Send quote to David Wong', sub: 'Due May 23 · David Wong', done: false },
    { text: 'Email Chen policy docs', sub: 'Completed · Amy Lewis', done: true },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <MockWindowBar label="Tasks — Sillage" />
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Box sx={{ height: 36, flex: 1, borderRadius: 1.5, bgcolor: sl('#F1F5F9', '#334155') }} />
          <Box sx={{ height: 36, width: 72, borderRadius: 1.5, bgcolor: BRAND }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {tasks.map((t) => (
            <Box key={t.text} sx={{
              display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, borderRadius: 1.5,
              border: '1px solid', borderColor: 'divider',
              bgcolor: t.done ? sl('rgba(240,253,244,0.5)', 'rgba(34,197,94,0.05)') : 'transparent',
            }}>
              {t.done ? (
                <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                  <CheckIcon sx={{ fontSize: 12, color: '#fff' }} />
                </Box>
              ) : (
                <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: 'divider', flexShrink: 0, mt: 0.25 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} noWrap sx={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'text.disabled' : 'text.primary' }}>
                  {t.text}
                </Typography>
                <Typography variant="caption" color="text.disabled" noWrap>{t.sub}</Typography>
              </Box>
              {t.urgent && !t.done && (
                <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700, flexShrink: 0 }}>Today</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

function FeatureSection({ tag, title, desc, bullets, cta, ctaHref, visual, reverse }) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const textCol = (
    <Box>
      <Typography variant="overline" sx={{ color: BRAND, fontWeight: 700, letterSpacing: 1.2 }}>{tag}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, mb: 2, lineHeight: 1.2 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.75 }}>{desc}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
        {bullets.map((b) => <CheckItem key={b}>{b}</CheckItem>)}
      </Box>
      <Button variant="contained" color="primary" size="large" href={ctaHref}>{cta}</Button>
    </Box>
  );

  const visualCol = <Box>{visual}</Box>;

  return (
    <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center" direction={reverse ? 'row-reverse' : 'row'}>
      <Grid item xs={12} lg={6}>{reverse ? textCol : visualCol}</Grid>
      <Grid item xs={12} lg={6}>{reverse ? visualCol : textCol}</Grid>
    </Grid>
  );
}

function PipelineMockup() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const stages = [
    { label: 'Lead', bg: dark ? 'rgba(59,130,246,0.2)' : '#DBEAFE', border: dark ? 'rgba(59,130,246,0.3)' : '#BFDBFE' },
    { label: 'Quote', bg: dark ? 'rgba(245,158,11,0.2)' : '#FEF3C7', border: dark ? 'rgba(245,158,11,0.3)' : '#FDE68A' },
    { label: 'Bind', bg: dark ? 'rgba(168,85,247,0.2)' : '#F3E8FF', border: dark ? 'rgba(168,85,247,0.3)' : '#E9D5FF' },
    { label: 'Won', accent: true, bg: dark ? 'rgba(34,197,94,0.2)' : '#DCFCE7', border: dark ? 'rgba(34,197,94,0.3)' : '#BBF7D0' },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 3, '&:hover': { transform: 'translateY(-6px)', boxShadow: 12, transition: 'all 0.3s ease' }, transition: 'all 0.3s ease', cursor: 'default' }}>
      <Grid container spacing={1.5}>
        {stages.map((s) => (
          <Grid item xs={3} key={s.label}>
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: s.accent ? BRAND : 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                {s.label}
              </Typography>
              <Box sx={{ height: 64, borderRadius: 1.5, bgcolor: s.bg, border: `${s.accent ? 2 : 1}px solid ${s.border}`, boxShadow: s.accent ? 2 : 'none' }} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="caption" color="text.secondary">Drag leads between stages</Typography>
        <Typography variant="caption" sx={{ color: BRAND, fontWeight: 600 }}>12 in pipeline</Typography>
      </Box>
    </Paper>
  );
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export default function LandingPage() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const { toggle, mode } = useColorMode();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <Box sx={{
        position: 'fixed', top: 16, left: 16, right: 16, zIndex: 1300,
        borderRadius: 3,
        bgcolor: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid', borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        maxWidth: 1152, mx: 'auto',
      }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none' }}>
            <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BoltIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: BRAND, fontFamily: '"Fraunces", serif' }}>Sillage</Typography>
          </Box>

          {isMd && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {NAV_LINKS.map((l) => (
                <Button key={l.label} href={l.href} size="small" sx={{ color: 'text.secondary', '&:hover': { color: BRAND, bgcolor: dark ? 'rgba(189,86,42,0.08)' : 'rgba(189,86,42,0.05)' } }}>
                  {l.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={toggle} sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
            {isMd && (
              <Button size="small" href="http://localhost:8001/login/" sx={{ color: 'text.secondary', '&:hover': { color: BRAND } }}>
                Log in
              </Button>
            )}
            <Button variant="contained" color="primary" size="small" href="http://localhost:8001/signup/">
              Sign up free
            </Button>
            {!isMd && (
              <IconButton size="small" onClick={() => setDrawerOpen(true)} sx={{ color: 'text.secondary' }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { bgcolor: 'background.default', pt: 8 } }}>
        <Box sx={{ px: 2, pb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <List disablePadding>
            {NAV_LINKS.map((l) => (
              <ListItem key={l.label} disablePadding>
                <ListItemButton component="a" href={l.href} onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton component="a" href="http://localhost:8001/login/">
                <ListItemText primary="Log in" />
              </ListItemButton>
            </ListItem>
          </List>
          <Button fullWidth variant="contained" color="primary" href="http://localhost:8001/signup/" sx={{ mt: 2 }}>
            Sign up free
          </Button>
        </Box>
      </Drawer>

      <Box component="main">
        {/* Hero */}
        <Box component="section" sx={{ pt: { xs: 16, sm: 18 }, pb: { xs: 8, sm: 12 }, px: 2, position: 'relative' }}>
          <Box sx={{
            position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
            width: 700, height: 400, borderRadius: '50%',
            bgcolor: dark ? 'rgba(189,86,42,0.08)' : 'rgba(253,232,220,0.4)',
            filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
          }} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center">
              <Grid item xs={12} lg={6}>
                <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                  <Chip
                    icon={<BoltIcon sx={{ fontSize: '14px !important', color: `${BRAND} !important` }} />}
                    label="Built for insurance professionals"
                    size="small"
                    sx={{
                      mb: 3, fontWeight: 600, fontSize: 11,
                      bgcolor: dark ? 'rgba(189,86,42,0.15)' : 'rgba(253,232,220,0.8)',
                      color: BRAND, border: '1px solid', borderColor: dark ? 'rgba(189,86,42,0.3)' : 'rgba(189,86,42,0.25)',
                    }}
                  />
                  <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem', lg: '4.5rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', mb: 3 }}>
                    Close more policies.<br />Miss fewer renewals.
                  </Typography>
                  <Box sx={{ mb: 4, maxWidth: 540, mx: { xs: 'auto', lg: 0 } }}>
                    <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.4 }}>
                      The CRM built for insurance agents.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>
                      Pipeline, policies, and team in one workspace.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                    <Button variant="contained" color="primary" size="large" href="http://localhost:8001/signup/" sx={{ px: 4, py: 1.5 }}>
                      Get started free
                    </Button>
                    <Button variant="outlined" size="large" href="http://localhost:8001/pricing/" sx={{ px: 4, py: 1.5 }}>
                      View pricing
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2 }}>
                    No credit card required · Free forever plan · Setup in under 2 minutes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box sx={{ position: 'relative' }}>
                  <DashboardMockup />
                  <Paper elevation={6} sx={{
                    position: 'absolute', bottom: -16, left: -24, px: 2, py: 1.5, borderRadius: 2,
                    display: { xs: 'none', sm: 'block' },
                  }}>
                    <Typography variant="caption" color="text.secondary">Pipeline value</Typography>
                    <Typography variant="h6" fontWeight={700}>$284K</Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Trust Indicators */}
        <Box component="section" sx={{ py: 5, px: 2, bgcolor: dark ? 'rgba(30,41,59,0.4)' : 'rgba(241,245,249,0.6)' }}>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              {[
                { value: '500+', label: 'Insurance agents' },
                { value: '$2M+', label: 'Policies tracked' },
                { value: '2 min', label: 'Average setup' },
                { value: '4.9/5', label: 'Agent satisfaction', accent: true },
              ].map((stat) => (
                <Grid item xs={6} md={3} key={stat.label}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: stat.accent ? BRAND : 'text.primary' }}>{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{stat.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Features */}
        <Box id="features" component="section" sx={{ py: { xs: 10, sm: 14 }, px: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 12, sm: 16 } }}>
              <FeatureSection
                tag="Pipeline"
                title="See every deal from first call to close"
                desc="Visual pipeline stages built for insurance workflows. Move leads with drag-and-drop, automate follow-ups when stages change, and never lose track of a hot prospect."
                bullets={['Custom stages for your agency workflow', 'Automations trigger tasks on stage change', 'Full activity history on every lead']}
                cta="Start your pipeline"
                ctaHref="http://localhost:8001/signup/"
                visual={<PipelineMockup />}
                reverse={false}
              />
              <FeatureSection
                tag="Policies"
                title="Never miss a renewal again"
                desc="Track every policy by carrier, type, and status. Built-in renewal reminders and a calendar view keep your book of business organized, so clients stay with you year after year."
                bullets={['Carrier, type, and status at a glance', 'Renewal alerts before policies lapse', 'Link policies directly to contacts']}
                cta="Manage policies"
                ctaHref="http://localhost:8001/signup/"
                visual={<RenewalsMockup />}
                reverse={true}
              />
            </Box>
          </Container>
        </Box>

        {/* Everything else header */}
        <Box component="section" sx={{ py: { xs: 6, sm: 8 }, px: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 8, sm: 10 } }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5 }}>And everything else you need</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
                One platform for contacts, boards, calendar, and team collaboration.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 12, sm: 16 } }}>
              <FeatureSection
                tag="Contacts"
                title="Every client in one place"
                desc="Centralize client info, notes, and history. Assign agents, filter by status, and pull up any contact in seconds."
                bullets={['Search and filter by status or agent', 'Full activity log on every profile', 'Link policies and tasks to contacts']}
                cta="Manage contacts"
                ctaHref="http://localhost:8001/signup/"
                visual={<ContactsMockup />}
                reverse={false}
              />
              <FeatureSection
                tag="Boards"
                title="Organize work your way"
                desc="Kanban boards for renewals, onboarding, and custom workflows. Drag cards between columns and keep your team aligned."
                bullets={['Drag-and-drop cards between stages', 'Link cards to contacts and due dates', 'Multiple boards for different workflows']}
                cta="Create a board"
                ctaHref="http://localhost:8001/signup/"
                visual={<BoardsMockup />}
                reverse={true}
              />
              <FeatureSection
                tag="Calendar"
                title="See your week at a glance"
                desc="Schedule meetings, follow-ups, and renewals. Color-coded events keep you ahead of every deadline."
                bullets={['Monthly and weekly views', 'Renewal dates synced from policies', 'Tasks and meetings in one place']}
                cta="Open calendar"
                ctaHref="http://localhost:8001/signup/"
                visual={<CalendarMockup />}
                reverse={false}
              />
              <FeatureSection
                tag="Tasks & Activity"
                title="Never drop a follow-up"
                desc="Log calls, emails, and notes. Assign tasks with due dates and link them to contacts so nothing slips through."
                bullets={['Check off tasks as you complete them', 'Activity timeline on every contact', 'Automations create tasks on stage change']}
                cta="Track tasks"
                ctaHref="http://localhost:8001/signup/"
                visual={<TasksMockup />}
                reverse={true}
              />
            </Box>
          </Container>
        </Box>

        {/* How It Works */}
        <Box id="how-it-works" component="section" sx={{ py: { xs: 10, sm: 14 }, px: 2, bgcolor: dark ? 'rgba(30,41,59,0.3)' : 'rgba(241,245,249,0.5)' }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', mb: 7 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5 }}>Up and running in minutes</Typography>
              <Typography color="text.secondary">Three steps to a fully organized pipeline.</Typography>
            </Box>
            <Grid container spacing={5} sx={{ position: 'relative' }}>
              {isMd && (
                <Box sx={{
                  position: 'absolute', top: 24, left: '16.67%', right: '16.67%', height: 2,
                  bgcolor: dark ? 'rgba(189,86,42,0.3)' : 'rgba(189,86,42,0.2)',
                }} />
              )}
              {[
                { num: '1', title: 'Sign up free', desc: 'Create your account in under 30 seconds. No credit card required.' },
                { num: '2', title: 'Add your contacts', desc: 'Import or add clients manually. Invite your team with a shareable link.' },
                { num: '3', title: 'Close more deals', desc: 'Use the pipeline, boards, and calendar to stay organized and never drop a lead.' },
              ].map((step) => (
                <Grid item xs={12} sm={4} key={step.num}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '50%', bgcolor: BRAND, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
                      fontWeight: 700, fontSize: 18, boxShadow: 3,
                      border: '3px solid', borderColor: 'background.default',
                      position: 'relative', zIndex: 1,
                    }}>
                      {step.num}
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{step.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>{step.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button variant="contained" color="primary" size="large" href="http://localhost:8001/signup/" sx={{ px: 5, py: 1.5 }}>
                Get started free
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Testimonials */}
        <Box component="section" sx={{ py: { xs: 10, sm: 14 }, px: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5 }}>Trusted by agents who sell</Typography>
              <Typography color="text.secondary">See why insurance professionals switch to Sillage.</Typography>
            </Box>
            <Grid container spacing={3}>
              {[
                { quote: 'I replaced three spreadsheets with Sillage. My renewal rate went up because I actually see what\'s due this week.', name: 'Maria Rodriguez', role: 'Independent P&C Agent, Ohio', initials: 'MR', color: dark ? '#D4784D' : '#9E3E18', bg: dark ? 'rgba(189,86,42,0.2)' : '#FDE8DC' },
                { quote: 'The pipeline view is exactly how we think about deals. My team adopted it in a day and no training manual was needed.', name: 'James Thompson', role: 'Agency Owner, Texas', initials: 'JT', color: dark ? '#93C5FD' : '#1D4ED8', bg: dark ? 'rgba(59,130,246,0.2)' : '#DBEAFE' },
                { quote: 'Finally a CRM that understands insurance. Policy tracking alone saved me hours every month.', name: 'Sarah Kim', role: 'Life & Health Producer, California', initials: 'SK', color: dark ? '#4ADE80' : '#15803D', bg: dark ? 'rgba(34,197,94,0.2)' : '#DCFCE7' },
              ].map((t) => (
                <Grid item xs={12} md={4} key={t.name}>
                  <Card elevation={1} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} sx={{ color: '#FBBF24', fontSize: 16 }} />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3 }}>
                        &ldquo;{t.quote}&rdquo;
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography variant="caption" fontWeight={700} sx={{ color: t.color }}>{t.initials}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{t.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Pricing */}
        <Box id="pricing" component="section" sx={{ py: { xs: 10, sm: 14 }, px: 2, bgcolor: dark ? 'rgba(30,41,59,0.3)' : 'rgba(241,245,249,0.5)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5 }}>Simple, transparent pricing</Typography>
              <Typography color="text.secondary">Start free. Upgrade when your team needs more.</Typography>
            </Box>
            <Grid container spacing={2.5} justifyContent="center">
              {[
                { name: 'Free', price: '$0', per: 'forever', features: ['2 seats', '3 boards', '100 contacts'], popular: false },
                { name: 'Basic', price: '$4', per: '/month', features: ['5 seats', '5GB storage', 'Email support'], popular: false },
                { name: 'Standard', price: '$8', per: '/month', features: ['10 seats', 'Calendar view', '20GB storage'], popular: true },
                { name: 'Pro', price: '$12', per: '/month', features: ['25 seats', 'Private boards', '50GB storage'], popular: false },
              ].map((plan) => (
                <Grid item xs={12} sm={6} lg={3} key={plan.name}>
                  <Card elevation={plan.popular ? 6 : 1} sx={{
                    height: '100%', border: '2px solid', borderColor: plan.popular ? BRAND : 'divider',
                    position: 'relative', display: 'flex', flexDirection: 'column',
                    transition: 'box-shadow 0.2s', '&:hover': { boxShadow: plan.popular ? 8 : 4 },
                  }}>
                    {plan.popular && (
                      <Box sx={{
                        position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                        bgcolor: BRAND, color: '#fff', px: 2, py: 0.25, borderRadius: 10, whiteSpace: 'nowrap',
                      }}>
                        <Typography variant="caption" fontWeight={600}>Most popular</Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600}>{plan.name}</Typography>
                      <Box sx={{ mt: 1.5, mb: 0.5 }}>
                        <Typography variant="h4" fontWeight={700} component="span">{plan.price}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled" sx={{ mb: 3, display: 'block' }}>{plan.per}</Typography>
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.25, mb: 3 }}>
                        {plan.features.map((f) => (
                          <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckIcon sx={{ color: '#22C55E', fontSize: 16, flexShrink: 0 }} />
                            <Typography variant="body2" color="text.secondary">{f}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button
                        fullWidth
                        variant={plan.popular ? 'contained' : 'outlined'}
                        color="primary"
                        href="http://localhost:8001/signup/"
                      >
                        {plan.name === 'Free' ? 'Get started' : 'Subscribe'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2">
                <Box component="a" href="http://localhost:8001/pricing/" sx={{ color: BRAND, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  View full pricing details
                </Box>
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* CTA */}
        <Box component="section" sx={{ py: { xs: 12, sm: 16 }, px: 2, bgcolor: '#0F172A', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 350, borderRadius: '50%', bgcolor: 'rgba(189,86,42,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', top: 0, right: '25%', width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(189,86,42,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<BoltIcon sx={{ fontSize: '14px !important', color: '#BD784D !important' }} />}
              label="Free to get started"
              size="small"
              sx={{ mb: 3, fontWeight: 600, fontSize: 11, bgcolor: 'rgba(189,86,42,0.2)', color: '#D4784D', border: '1px solid rgba(189,86,42,0.35)' }}
            />
            <Typography variant="h2" sx={{ color: '#F1F5F9', fontSize: { xs: '2rem', sm: '3rem' }, fontWeight: 700, lineHeight: 1.2, mb: 2.5 }}>
              Ready to grow your book of business?
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: '1.1rem', mb: 5, maxWidth: 520, mx: 'auto', lineHeight: 1.75 }}>
              Join hundreds of insurance agents who manage their pipeline, policies, and team in one place.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'center' }}>
              <Button variant="contained" color="primary" size="large" href="http://localhost:8001/signup/" sx={{ px: 5, py: 1.5, fontSize: '1rem' }}>
                Start free today
              </Button>
              <Button size="large" href="http://localhost:8001/pricing/" sx={{ px: 5, py: 1.5, fontSize: '1rem', color: '#F1F5F9', border: '1px solid rgba(241,245,249,0.15)', bgcolor: 'rgba(241,245,249,0.05)', '&:hover': { bgcolor: 'rgba(241,245,249,0.1)' } }}>
                View pricing
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2.5 }}>No credit card required</Typography>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 7, px: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, textDecoration: 'none' }}>
                <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BoltIcon sx={{ color: '#fff', fontSize: 14 }} />
                </Box>
                <Typography fontWeight={700} sx={{ color: BRAND, fontFamily: '"Fraunces", serif' }}>Sillage</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 240, lineHeight: 1.75 }}>
                Built for insurance agents who close. Pipeline, policies, and team in one workspace.
              </Typography>
            </Grid>
            {[
              { heading: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: 'http://localhost:8001/pricing/' }, { label: 'Sign up', href: 'http://localhost:8001/signup/' }] },
              { heading: 'Company', links: [{ label: 'How it works', href: '#how-it-works' }, { label: 'Book a demo', href: 'http://localhost:8001/signup/' }] },
              { heading: 'Account', links: [{ label: 'Log in', href: 'http://localhost:8001/login/' }, { label: 'Create account', href: 'http://localhost:8001/signup/' }] },
            ].map((col) => (
              <Grid item xs={6} sm={3} lg={3} key={col.heading}>
                <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 1, display: 'block', mb: 2 }}>{col.heading}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {col.links.map((l) => (
                    <Box key={l.label} component="a" href={l.href} sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: 14, '&:hover': { color: BRAND } }}>
                      {l.label}
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Box sx={{ pt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.disabled">&copy; 2026 Sillage. All rights reserved.</Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {[{ label: 'Pricing', href: 'http://localhost:8001/pricing/' }, { label: 'Log in', href: 'http://localhost:8001/login/' }, { label: 'Sign up', href: 'http://localhost:8001/signup/' }].map((l) => (
                <Box key={l.label} component="a" href={l.href} sx={{ color: 'text.disabled', textDecoration: 'none', fontSize: 12, '&:hover': { color: 'text.secondary' } }}>
                  {l.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
