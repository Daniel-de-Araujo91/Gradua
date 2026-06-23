const DAY_MAP = {
  '2': 'SEG', '3': 'TER', '4': 'QUA',
  '5': 'QUI', '6': 'SEX', '7': 'SAB', '1': 'DOM',
};

const SHIFT_PERIODS = {
  M: { label: 'Manhã', periods: [
    { n:1, start:'07:00', end:'07:50' }, { n:2, start:'07:50', end:'08:40' },
    { n:3, start:'08:40', end:'09:30' }, { n:4, start:'09:40', end:'10:30' },
    { n:5, start:'10:30', end:'11:20' }, { n:6, start:'11:20', end:'12:10' },
  ]},
  T: { label: 'Tarde', periods: [
    { n:1, start:'13:30', end:'14:20' }, { n:2, start:'14:20', end:'15:10' },
    { n:3, start:'15:20', end:'16:10' }, { n:4, start:'16:10', end:'17:00' },
    { n:5, start:'17:10', end:'18:00' }, { n:6, start:'18:00', end:'18:50' },
  ]},
  N: { label: 'Noite', periods: [
    { n:1, start:'18:50', end:'19:40' }, { n:2, start:'19:40', end:'20:30' },
    { n:3, start:'20:40', end:'21:30' }, { n:4, start:'21:30', end:'22:20' },
    { n:5, start:'22:20', end:'23:10' },
  ]},
};

export function parseSchedule(scheduleStr) {
  if (!scheduleStr || typeof scheduleStr !== 'string') return null;

  // Normalize: trim and uppercase
  const s = scheduleStr.trim().toUpperCase();

  // Extract day digits at start, turn letter, period digits at end
  const dayMatch = s.match(/^(\d+)/);
  const shiftMatch = s.match(/[MTN]/);
  const periodMatch = s.match(/(\d+)$/);

  if (!dayMatch) { console.warn('[scheduleParser] No day digits in:', scheduleStr); return null; }
  if (!shiftMatch) { console.warn('[scheduleParser] No shift letter (M/T/N) in:', scheduleStr); return null; }
  if (!periodMatch) { console.warn('[scheduleParser] No period digits in:', scheduleStr); return null; }

  const days = dayMatch[1].split('').map(ch => DAY_MAP[ch]).filter(Boolean);
  if (days.length === 0) return null;

  const shiftKey = shiftMatch[0];
  const shift = SHIFT_PERIODS[shiftKey];
  if (!shift) return null;

  const periodNumbers = periodMatch[1].split('').map(Number);
  const periods = shift.periods.filter(p => periodNumbers.includes(p.n));
  if (periods.length === 0) return null;

  return {
    days,
    shiftLabel: shift.label,
    shiftKey,
    startTime: periods[0].start,
    endTime: periods[periods.length - 1].end,
    periods: periodNumbers,
  };
}

export function classOnDay(scheduleStr, dayLabel) {
  const parsed = parseSchedule(scheduleStr);
  if (!parsed) return null;
  if (parsed.days.includes(dayLabel)) return parsed;
  return null;
}