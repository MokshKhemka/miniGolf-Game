import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';

interface World {
  name: string;
  image: string;
  levels: number[];
}

interface WorldsHomeScreenProps {
  worlds: World[];
  unlockedWorlds: number;
  onSelectWorld: (index: number) => void;
}

const WorldsHomeScreen: React.FC<WorldsHomeScreenProps> = ({ worlds, unlockedWorlds, onSelectWorld }) => (
  <Box sx={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',bgcolor:'#e0f2f1'}}>
    <Typography variant="h2" sx={{mb:4,letterSpacing:2}}>MiniGolf Worlds</Typography>
    <Box sx={{display:'flex',gap:4}}>
      {worlds.map((w, i) => (
        <Box key={w.name} sx={{textAlign:'center'}}>
          <Box sx={{width:160,height:160,mb:1,position:'relative',borderRadius:4,overflow:'hidden',boxShadow:3,opacity: i <= unlockedWorlds ? 1 : 0.5,background:'#fff'}}>
            <img src={w.image} alt={w.name} style={{width:'100%',height:'100%',objectFit:'cover',filter: i <= unlockedWorlds ? 'none' : 'grayscale(1)'}} />
            {i > unlockedWorlds && <LockIcon sx={{position:'absolute',top:8,right:8,fontSize:40,color:'#888'}}/>}
          </Box>
          <Button variant="contained" color="primary" disabled={i > unlockedWorlds} onClick={()=>onSelectWorld(i)}>{w.name}</Button>
        </Box>
      ))}
    </Box>
  </Box>
);

export default WorldsHomeScreen; 