import { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Draw a simple placeholder minigolf course
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(100, 150, 15, 0, Math.PI * 2); // Ball
    ctx.fill();
    ctx.fillStyle = '#795548';
    ctx.fillRect(350, 120, 30, 60); // Hole
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(365, 150, 10, 0, Math.PI * 2); // Hole opening
    ctx.fill();
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#e0f2f1' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" gutterBottom>MiniGolf Game</Typography>
        <canvas ref={canvasRef} width={400} height={300} style={{ border: '2px solid #333', background: '#4caf50', borderRadius: 8 }} />
      </Box>
      <Paper elevation={3} sx={{ width: 300, p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fafafa' }}>
        <Typography variant="h5">Controls</Typography>
        <Button variant="contained" color="primary">Shoot</Button>
        <Button variant="outlined">Reset Ball</Button>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Aim and shoot the ball into the hole!<br />
          (Game logic coming soon)
        </Typography>
      </Paper>
    </Box>
  );
}

export default App;




