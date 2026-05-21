import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';

const BRAND = '#BD562A';
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toLocalDateStr(dateVal) {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') return dateVal.slice(0, 10);
  return null;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [tasks, setTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/crm/tasks/')
      .then((res) => setTasks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const d = toLocalDateStr(t.due_date);
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(t);
    });
    return map;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const goPrev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const goNext = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const pad = (n) => String(n).padStart(2, '0');
  const selectedKey = selectedDay ? `${year}-${pad(month + 1)}-${pad(selectedDay)}` : null;
  const selectedTasks = selectedKey ? (tasksByDate[selectedKey] || []) : [];

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <Box>
      <PageHeader
        title="Calendar"
        subtitle="Renewals, follow-ups, and meetings in one place"
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: `3px solid ${BRAND}`,
              borderRadius: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={goPrev} size="small" sx={{ borderRadius: 0, color: 'text.secondary' }}>
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={goNext} size="small" sx={{ borderRadius: 0, color: 'text.secondary' }}>
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    fontSize: 18,
                    ml: 0.5,
                    letterSpacing: '0.01em',
                  }}
                >
                  {MONTHS[month]} {year}
                </Typography>
              </Box>
              <Box
                onClick={goToday}
                sx={{
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: '"Montserrat", sans-serif',
                  color: BRAND,
                  border: `1px solid ${BRAND}`,
                  px: 1.5,
                  py: 0.5,
                  '&:hover': { bgcolor: `${BRAND}14` },
                }}
              >
                Today
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {DAYS.map((d) => (
                <Box
                  key={d}
                  sx={{
                    py: 1,
                    textAlign: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    borderRight: '1px solid',
                    '&:last-child': { borderRight: 0 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      fontFamily: '"Montserrat", sans-serif',
                      color: 'text.disabled',
                    }}
                  >
                    {d}
                  </Typography>
                </Box>
              ))}

              {calendarDays.map((day, idx) => {
                const key = day ? `${year}-${pad(month + 1)}-${pad(day)}` : null;
                const hasTasks = key && tasksByDate[key]?.length > 0;
                const isSelected = day !== null && day === selectedDay;
                const isTodayCell = day !== null && isToday(day);
                const col = idx % 7;

                return (
                  <Box
                    key={idx}
                    onClick={() => day && setSelectedDay(isSelected ? null : day)}
                    sx={{
                      minHeight: 80,
                      p: 0.75,
                      borderBottom: '1px solid',
                      borderRight: col < 6 ? '1px solid' : '0',
                      borderColor: 'divider',
                      cursor: day ? 'pointer' : 'default',
                      position: 'relative',
                      bgcolor: isSelected
                        ? `${BRAND}0f`
                        : 'transparent',
                      transition: 'background-color 0.1s',
                      '&:hover': day ? { bgcolor: isSelected ? `${BRAND}18` : 'action.hover' } : {},
                    }}
                  >
                    {day && (
                      <>
                        <Box
                          sx={{
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isTodayCell ? BRAND : 'transparent',
                            borderRadius: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: isTodayCell ? 700 : 500,
                              color: isTodayCell ? '#fff' : 'text.primary',
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            {day}
                          </Typography>
                        </Box>
                        {hasTasks && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 6,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              gap: 0.5,
                            }}
                          >
                            {tasksByDate[key].slice(0, 3).map((_, ti) => (
                              <Box
                                key={ti}
                                sx={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  bgcolor: BRAND,
                                }}
                              />
                            ))}
                            {tasksByDate[key].length > 3 && (
                              <Typography sx={{ fontSize: 9, color: BRAND, lineHeight: '5px' }}>
                                +{tasksByDate[key].length - 3}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {selectedDay && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: `3px solid ${BRAND}`,
              borderRadius: 0,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {MONTHS[month]} {selectedDay}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}>
                {selectedTasks.length} TASK{selectedTasks.length !== 1 ? 'S' : ''}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selectedTasks.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: 'text.disabled', py: 2, textAlign: 'center' }}>
                  No tasks due this day
                </Typography>
              ) : (
                selectedTasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      p: 1.25,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderLeft: `3px solid ${BRAND}`,
                      borderRadius: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}>
                      {task.title}
                    </Typography>
                    {task.related_contact_name && (
                      <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>
                        {task.related_contact_name}
                      </Typography>
                    )}
                    <Chip
                      label={task.completed ? 'Done' : task.priority?.toUpperCase() || 'MEDIUM'}
                      size="small"
                      sx={{
                        borderRadius: 0,
                        height: 18,
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: '"Montserrat", sans-serif',
                        letterSpacing: '0.06em',
                        bgcolor: task.completed
                          ? 'success.main'
                          : task.priority === 'high'
                          ? '#EF444420'
                          : task.priority === 'low'
                          ? 'action.selected'
                          : `${BRAND}20`,
                        color: task.completed
                          ? '#fff'
                          : task.priority === 'high'
                          ? '#EF4444'
                          : task.priority === 'low'
                          ? 'text.secondary'
                          : BRAND,
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
