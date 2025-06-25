import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import SettingsIcon from '@mui/icons-material/Settings';

interface HomeScreenProps {
  theme: 'light' | 'dark';
  onPlay: () => void;
  onSettings: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ theme, onPlay, onSettings }) => (
  <Box sx={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',bgcolor:theme==='light'?'#e0f2f1':'#222'}}>
    <Typography variant="h2" sx={{mb:2,letterSpacing:2}}>MiniGolf <SportsGolfIcon fontSize="large" sx={{animation:'logo-spin 2s linear infinite'}}/></Typography>
    <Button variant="contained" size="large" color="primary" onClick={onPlay}>Play</Button>
    <Button variant="outlined" sx={{mt:2}} startIcon={<SettingsIcon/>} onClick={onSettings}>Settings</Button>
  </Box>
);

export default HomeScreen; 