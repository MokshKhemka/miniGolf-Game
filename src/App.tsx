import { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { LEVELS } from './levels';
import type { Powerup, LevelConfig } from './levels';
import './App.css';

const BALL_RADIUS = 15;
const HOLE_RADIUS = 10;
const CANVAS_W = 400;
const CANVAS_H = 300;
const FRICTION = 0.98;
const MIN_SPEED = 0.5;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [level, setLevel] = useState(0);
  const [ball, setBall] = useState({ ...LEVELS[0].ball });
  const [hole, setHole] = useState({ ...LEVELS[0].hole });
  const [obstacles, setObstacles] = useState(LEVELS[0].obstacles);
  const [powerups, setPowerups] = useState<Powerup[]>(LEVELS[0].powerups.map(p => ({ ...p })));
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [moving, setMoving] = useState(false);
  const [message, setMessage] = useState('');
  const [strokeCount, setStrokeCount] = useState(0);
  const [aiming, setAiming] = useState(false);
  const [aimStart, setAimStart] = useState<{ x: number; y: number } | null>(null);
  const [aimEnd, setAimEnd] = useState<{ x: number; y: number } | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [superShotActive, setSuperShotActive] = useState(false);

  // Draw course, obstacles, and aiming line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // Obstacles
    ctx.fillStyle = '#607d8b';
    obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    // Hole
    ctx.fillStyle = '#795548';
    ctx.fillRect(hole.x - 15, hole.y - 30, 30, 60);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2);
    ctx.fill();
    // Aiming line
    if (aiming && aimStart && aimEnd) {
      ctx.strokeStyle = '#1976d2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(aimStart.x, aimStart.y);
      ctx.lineTo(aimEnd.x, aimEnd.y);
      ctx.stroke();
      // Arrowhead
      const angle = Math.atan2(aimEnd.y - aimStart.y, aimEnd.x - aimStart.x);
      const arrowLen = 15;
      ctx.beginPath();
      ctx.moveTo(aimEnd.x, aimEnd.y);
      ctx.lineTo(aimEnd.x - arrowLen * Math.cos(angle - 0.3), aimEnd.y - arrowLen * Math.sin(angle - 0.3));
      ctx.moveTo(aimEnd.x, aimEnd.y);
      ctx.lineTo(aimEnd.x - arrowLen * Math.cos(angle + 0.3), aimEnd.y - arrowLen * Math.sin(angle + 0.3));
      ctx.stroke();
    }
  }, [ball, aiming, aimStart, aimEnd, obstacles, hole]);

  // Ball movement animation with improved obstacle collision
  useEffect(() => {
    if (!moving) return;
    let animId: number;
    function animate() {
      setBall(prev => {
        let next = { x: prev.x + velocity.x, y: prev.y + velocity.y };
        let vx = velocity.x;
        let vy = velocity.y;
        // Wall collision
        if (next.x - BALL_RADIUS < 0 || next.x + BALL_RADIUS > CANVAS_W) vx = -vx;
        if (next.y - BALL_RADIUS < 0 || next.y + BALL_RADIUS > CANVAS_H) vy = -vy;
        // Obstacle collision (improved AABB)
        for (const o of obstacles) {
          if (
            next.x + BALL_RADIUS > o.x &&
            next.x - BALL_RADIUS < o.x + o.w &&
            next.y + BALL_RADIUS > o.y &&
            next.y - BALL_RADIUS < o.y + o.h
          ) {
            // Determine collision side
            const overlapX = Math.min(next.x + BALL_RADIUS - o.x, o.x + o.w - (next.x - BALL_RADIUS));
            const overlapY = Math.min(next.y + BALL_RADIUS - o.y, o.y + o.h - (next.y - BALL_RADIUS));
            if (overlapX < overlapY) {
              vx = -vx;
              next.x = prev.x;
            } else {
              vy = -vy;
              next.y = prev.y;
            }
          }
        }
        // Friction (unless superShot)
        if (!superShotActive) {
          vx *= FRICTION;
          vy *= FRICTION;
        }
        setVelocity({ x: vx, y: vy });
        // Check if in hole
        const dist = Math.hypot(next.x - hole.x, next.y - hole.y);
        if (dist < hole.r) {
          setMessage('Level Complete!');
          setShowSnackbar(true);
          setMoving(false);
          setVelocity({ x: 0, y: 0 });
          setSuperShotActive(false);
          return { ...hole };
        }
        // Stop if slow
        if (Math.abs(vx) < MIN_SPEED && Math.abs(vy) < MIN_SPEED) {
          setMoving(false);
          setVelocity({ x: 0, y: 0 });
          setSuperShotActive(false);
          return next;
        }
        animId = requestAnimationFrame(animate);
        return next;
      });
    }
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [moving, velocity, obstacles, hole, superShotActive]);

  // Mouse events for aiming
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (moving) return;
    const pos = getCanvasPos(e);
    const dist = Math.hypot(pos.x - ball.x, pos.y - ball.y);
    if (dist <= BALL_RADIUS) {
      setAiming(true);
      setAimStart({ ...ball });
      setAimEnd(pos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!aiming) return;
    setAimEnd(getCanvasPos(e));
  };

  const handleMouseUp = () => {
    if (!aiming || !aimStart || !aimEnd) return;
    const dx = aimStart.x - aimEnd.x;
    const dy = aimStart.y - aimEnd.y;
    const power = Math.min(Math.hypot(dx, dy) / 10, 10);
    if (power > 0.5) {
      setVelocity({ x: dx / 10, y: dy / 10 });
      setMoving(true);
      setStrokeCount(c => c + 1);
      setMessage('');
    }
    setAiming(false);
    setAimStart(null);
    setAimEnd(null);
  };

  const handleReset = () => {
    setBall({ ...LEVELS[level].ball });
    setHole({ ...LEVELS[level].hole });
    setObstacles(LEVELS[level].obstacles);
    setPowerups(LEVELS[level].powerups.map(p => ({ ...p })));
    setVelocity({ x: 0, y: 0 });
    setMessage('');
    setMoving(false);
    setStrokeCount(0);
    setAiming(false);
    setAimStart(null);
    setAimEnd(null);
    setShowSnackbar(false);
    setSuperShotActive(false);
  };

  const handleNextLevel = () => {
    const nextLevel = (level + 1) % LEVELS.length;
    setLevel(nextLevel);
    setBall({ ...LEVELS[nextLevel].ball });
    setHole({ ...LEVELS[nextLevel].hole });
    setObstacles(LEVELS[nextLevel].obstacles);
    setPowerups(LEVELS[nextLevel].powerups.map(p => ({ ...p })));
    setVelocity({ x: 0, y: 0 });
    setMessage('');
    setMoving(false);
    setStrokeCount(0);
    setAiming(false);
    setAimStart(null);
    setAimEnd(null);
    setShowSnackbar(false);
    setSuperShotActive(false);
  };

  // Powerup logic
  const usePowerup = (type: Powerup['type']) => {
    if (moving) return;
    if (type === 'superShot') {
      setSuperShotActive(true);
      setPowerups(p => p.map(pp => pp.type === 'superShot' && !pp.used ? { ...pp, used: true } : pp));
    } else if (type === 'teleport') {
      // Move ball near hole
      setBall(prev => ({ x: hole.x - 2 * BALL_RADIUS, y: hole.y }));
      setPowerups(p => p.map(pp => pp.type === 'teleport' && !pp.used ? { ...pp, used: true } : pp));
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#e0f2f1' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" gutterBottom>MiniGolf Game</Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>Level {level + 1} / {LEVELS.length}</Typography>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ border: '2px solid #333', background: '#4caf50', borderRadius: 8, cursor: moving ? 'not-allowed' : 'crosshair' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <Snackbar open={showSnackbar} autoHideDuration={4000} onClose={() => setShowSnackbar(false)}>
          <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%' }}>
            {message} <Button color="inherit" size="small" onClick={handleNextLevel}>Next Level</Button>
          </MuiAlert>
        </Snackbar>
      </Box>
      <Paper elevation={3} sx={{ width: 300, p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fafafa' }}>
        <Typography variant="h5">Controls</Typography>
        <Button variant="outlined" onClick={handleReset} disabled={moving && !message}>Reset Level</Button>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Click and drag from the ball to aim and set power.<br />
          Release to shoot. Try to get the ball in the hole!<br />
          <b>Strokes:</b> {strokeCount}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Powerups</Typography>
          {powerups.length === 0 && <Typography variant="body2">No powerups this level.</Typography>}
          {powerups.map((p, i) => (
            <Button
              key={i}
              variant={p.used ? 'outlined' : 'contained'}
              color={p.type === 'superShot' ? 'secondary' : 'success'}
              disabled={!!p.used || moving}
              sx={{ mr: 1, mb: 1 }}
              onClick={() => usePowerup(p.type)}
            >
              {p.type === 'superShot' ? 'Super Shot' : 'Teleport'}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default App;