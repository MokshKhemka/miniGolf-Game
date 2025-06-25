import React from 'react';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ColorLensIcon from '@mui/icons-material/ColorLens';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  soundOn: boolean;
  setSoundOn: (s: boolean) => void;
  showAimingLine: boolean;
  setShowAimingLine: (a: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, theme, setTheme, soundOn, setSoundOn, showAimingLine, setShowAimingLine }) => (
  <Modal open={open} onClose={onClose}>
    <Paper sx={{p:4,position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',minWidth:300}}>
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Button onClick={()=>setTheme(theme==='light'?'dark':'light')} startIcon={<ColorLensIcon/>} sx={{mb:2}}>{theme==='light'?'Switch to Dark':'Switch to Light'}</Button>
      <Button onClick={()=>setSoundOn(!soundOn)} startIcon={soundOn?<VolumeUpIcon/>:<VolumeOffIcon/>} sx={{mb:2}}>{soundOn?'Sound On':'Sound Off'}</Button>
      <Button onClick={()=>setShowAimingLine(!showAimingLine)} sx={{mb:2}}>{showAimingLine?'Hide Aiming Line':'Show Aiming Line'}</Button>
      <Button onClick={onClose} sx={{mt:2}}>Close</Button>
    </Paper>
  </Modal>
);

export default SettingsModal; 

