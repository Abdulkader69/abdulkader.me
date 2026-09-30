export type Wallpaper = {
  id: string;
  name: string;
  light: string;
  dark: string;
};

export const wallpapers: Wallpaper[] = [
  {
    id: 'sonoma',
    name: 'Sonoma Horizon',
    light:
      'radial-gradient(circle at 30% 70%, #ffd194, transparent 50%), radial-gradient(circle at 70% 25%, #ff7eb3, transparent 50%), linear-gradient(135deg,#ff9a8b,#ff6a88,#ff99ac)',
    dark: 'radial-gradient(circle at 30% 70%, #3a1c71, transparent 50%), radial-gradient(circle at 70% 25%, #661a4a, transparent 50%), linear-gradient(135deg,#2b0a3d,#3a0f47,#1a0a2e)',
  },
  {
    id: 'sequoia',
    name: 'Sequoia',
    light:
      'radial-gradient(circle at 20% 20%, #7fd6ff, transparent 45%), radial-gradient(circle at 80% 30%, #4f8cff, transparent 50%), radial-gradient(circle at 50% 85%, #1e3c72, transparent 55%), linear-gradient(160deg,#8fd3f4,#2b5876)',
    dark: 'radial-gradient(circle at 20% 20%, #16323f, transparent 45%), radial-gradient(circle at 80% 30%, #1c3b45, transparent 50%), radial-gradient(circle at 50% 85%, #0a0f1a, transparent 55%), linear-gradient(160deg,#141e30,#0a0f1a)',
  },

  {
    id: 'ventura',
    name: 'Ventura',
    light:
      'radial-gradient(circle at 25% 25%, #f6d365, transparent 45%), radial-gradient(circle at 75% 75%, #fda085, transparent 50%), linear-gradient(160deg,#f6d365,#fda085)',
    dark: 'radial-gradient(circle at 25% 25%, #4a2708, transparent 45%), radial-gradient(circle at 75% 75%, #5c1f0a, transparent 50%), linear-gradient(160deg,#2b1305,#3e1a08)',
  },
  {
    id: 'monterey',
    name: 'Monterey',
    light:
      'radial-gradient(circle at 30% 30%, #a1c4fd, transparent 50%), radial-gradient(circle at 70% 70%, #c2e9fb, transparent 50%), linear-gradient(150deg,#a1c4fd,#c2e9fb)',
    dark: 'radial-gradient(circle at 30% 30%, #12263d, transparent 50%), radial-gradient(circle at 70% 70%, #1b263b, transparent 50%), linear-gradient(150deg,#0d1b2a,#1b263b)',
  },
  {
    id: 'bigsur',
    name: 'Big Sur',
    light:
      'radial-gradient(circle at 20% 40%, #ff6a6a, transparent 45%), radial-gradient(circle at 80% 60%, #ffb56a, transparent 50%), linear-gradient(160deg,#ff5f6d,#ffc371)',
    dark: 'radial-gradient(circle at 20% 40%, #55130f, transparent 45%), radial-gradient(circle at 80% 60%, #5c2b0e, transparent 50%), linear-gradient(160deg,#3a0d12,#4d1a0a)',
  },
  {
    id: 'peach',
    name: 'Peach',
    light:
      'radial-gradient(circle at 15% 15%, #ffe3cf, transparent 55%), radial-gradient(circle at 85% 10%, #ffd7c9, transparent 50%), radial-gradient(circle at 70% 90%, #f8c9b8, transparent 55%), linear-gradient(150deg,#fde3d2,#f6c3ae)',
    dark: 'radial-gradient(circle at 15% 15%, #3a251c, transparent 55%), radial-gradient(circle at 85% 10%, #46281f, transparent 50%), radial-gradient(circle at 70% 90%, #2a1712, transparent 55%), linear-gradient(150deg,#2b1a14,#1d110d)',
  },
  {
    id: 'graphite-wave',
    name: 'Graphite Wave',
    light:
      'radial-gradient(circle at 30% 30%, #e0e0e0, transparent 50%), radial-gradient(circle at 70% 70%, #b8c6db, transparent 50%), linear-gradient(160deg,#e0e0e0,#b8c6db)',
    dark: 'radial-gradient(circle at 30% 30%, #2b2d2e, transparent 50%), radial-gradient(circle at 70% 70%, #0f2027, transparent 50%), linear-gradient(160deg,#141517,#232526)',
  },
];
