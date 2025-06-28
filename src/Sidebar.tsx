import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import RocketLaunchIcon2 from '@mui/icons-material/RocketLaunch';

import type { Powerup } from './levels';

interface SidebarProps {
  strokeCount: number;
  handleReset: () => void;
  moving: boolean;
  message: string;
  powerups: Powerup[];
  usePowerup: (type: Powerup['type']) => void;
  tip: string;
}

const Sidebar: React.FC<SidebarProps> = ({ strokeCount, handleReset, moving, message, powerups, usePowerup, tip }) => (
  <Paper elevation={3} sx={{ width: 300, p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fafafa' }}>
    <Typography variant="h5">Controls</Typography>
    <Button variant="outlined" onClick={handleReset} disabled={moving} startIcon={<RestartAltIcon />}>Reset Level</Button>
    <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', fontSize: 22, color: '#1976d2' }}>
      <RocketLaunchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Strokes: {strokeCount}
    </Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      Click and drag from the ball to aim and set power.<br />
      Release to shoot. Try to get the ball in the hole!<br />
    </Typography>
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Powerups</Typography>
      {powerups.length === 0 && <Typography variant="body2">No powerups this level.</Typography>}
      {powerups.map((p, i) => (
        <Button
          key={i}
          variant={p.used ? 'outlined' : 'contained'}
          color={p.type === 'superShot' ? 'secondary' : p.type === 'ghostBall' ? 'info' : 'success'}
          disabled={!!p.used || moving}
          sx={{ mr: 1, mb: 1 }}
          onClick={() => usePowerup(p.type)}
          startIcon={p.type === 'superShot' ? <FlashOnIcon /> : p.type === 'ghostBall' ? <SportsGolfIcon /> : <RocketLaunchIcon2 />}
        >
          {p.type === 'superShot' ? 'Super Shot' : p.type === 'ghostBall' ? 'Ghost Ball' : 'Teleport'}
        </Button>
      ))}
    </Box>
    {/* Fun Tip Box */}
    <Paper elevation={2} sx={{mt:3,p:2,bgcolor:'#fffde7'}}>
      <Typography variant="subtitle1" color="primary">Tip of the Game:</Typography>
      <Typography variant="body2">{tip}</Typography>
    </Paper>
  </Paper>
);

export default Sidebar; 