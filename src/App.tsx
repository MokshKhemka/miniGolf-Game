import { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LEVELS } from './levels';
import type { Powerup } from './levels';
import './App.css';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsIcon from '@mui/icons-material/Settings';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import React from 'react';
import HomeScreen from './HomeScreen';
import SettingsModal from './SettingsModal';
import Sidebar from './Sidebar';
import WorldsHomeScreen from './WorldsHomeScreen';
import Tooltip from '@mui/material/Tooltip';

const BALL_RADIUS = 15;
const HOLE_RADIUS = 10;
const CANVAS_W = window.innerWidth > 1200 ? 1200 : window.innerWidth - 100;
const CANVAS_H = window.innerHeight > 800 ? 800 : window.innerHeight - 100;
const FRICTION = 0.96;
const MIN_SPEED = 0.2;

// Sound effects
const shootSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
const winSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');

const TIPS = [
  'Try using the Ghost Ball to pass through obstacles!',
  'Use the aiming line to plan your shot direction.',
  'Wind can help or hurt—watch the direction!',
  'Powerups can only be used once per level.',
  'Try to beat the par for a birdie!',
  'Change your ball color for extra style.',
  'Use the trail to see your shot history.',
  'You can pause the game anytime from the menu.',
];

const WORLDS = [
  { name: 'Forest', image: '/world-forest.jpg' },
  { name: 'Desert', image: '/world-desert.jpg' },
  { name: 'Space', image: '/world-space.jpg' },
  { name: 'Candy', image: '/world-candy.jpg' },
];

function getRandomColor() {
  const colors = ['#fff', '#f44336', '#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

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
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalPar, setFinalPar] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [strokeLimit, setStrokeLimit] = useState(LEVELS[0].par * 2);
  const [levelSelect, setLevelSelect] = useState(0);
  const [bestScores, setBestScores] = useState<number[]>(() => {
    const saved = localStorage.getItem('minigolf-best-scores');
    return saved ? JSON.parse(saved) : Array(LEVELS.length).fill(null);
  });
  const [soundOn, setSoundOn] = useState(true);
  const [confetti, setConfetti] = useState<{x:number,y:number,vx:number,vy:number,color:string}[]>([]);
  const [showHome, setShowHome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [showAimingLine, setShowAimingLine] = useState(true);
  const [ballColor, setBallColor] = useState('#fff');
  const [trail, setTrail] = useState<{x:number,y:number,color:string}[]>([]);
  const [wind, setWind] = useState({x:0, y:0});
  const [ghostBall, setGhostBall] = useState(false);
  const [tip, setTip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [showWorlds, setShowWorlds] = useState(true);
  const [selectedWorld, setSelectedWorld] = useState(0);
  const [unlockedWorlds, setUnlockedWorlds] = useState(0);

  // Draw course, obstacles, aiming line, and animated flag
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#a7ffeb');
    grad.addColorStop(1, '#4caf50');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // Obstacles
    ctx.fillStyle = '#607d8b';
    obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
    // Draw trail
    trail.forEach((t,i)=>{
      ctx.globalAlpha = (i+1)/trail.length;
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(t.x,t.y,BALL_RADIUS-6,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    // Ball
    ctx.fillStyle = ballColor;
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
    // Animated flag
    const flagHeight = 40 + 10 * Math.sin(Date.now() / 300);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - hole.r);
    ctx.lineTo(hole.x, hole.y - flagHeight);
    ctx.stroke();
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - flagHeight);
    ctx.lineTo(hole.x + 18, hole.y - flagHeight + 10);
    ctx.lineTo(hole.x, hole.y - flagHeight + 20);
    ctx.closePath();
    ctx.fill();
    // Aiming line
    if (aiming && aimStart && aimEnd && showAimingLine) {
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
  }, [ball, aiming, aimStart, aimEnd, obstacles, hole, showAimingLine, ballColor, trail]);

  // Ball movement animation with improved obstacle collision
  useEffect(() => {
    if (!moving) return;
    let animId: number;
    function animate() {
      setBall(prev => {
        let next = { x: prev.x + velocity.x + wind.x, y: prev.y + velocity.y + wind.y };
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
          winSound.currentTime = 0; winSound.play();
          setMessage('Level Complete!');
          setShowSnackbar(true);
          setMoving(false);
          setVelocity({ x: 0, y: 0 });
          setSuperShotActive(false);
          // If last level, show game over after short delay
          if (level === LEVELS.length - 1) {
            setTimeout(() => {
              setGameOver(true);
              setFinalScore(sc => sc + strokeCount);
              setFinalPar(p => p + LEVELS[level].par);
            }, 1200);
          }
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
  }, [moving, velocity, obstacles, hole, superShotActive, level, strokeCount, wind]);

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
    const power = Math.min(Math.hypot(dx, dy) / 14, 10);
    if (power > 0.5) {
      shootSound.currentTime = 0; shootSound.play();
      setVelocity({ x: dx / 18, y: dy / 18 });
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
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  };

  const handleNextLevel = () => {
    if (level === LEVELS.length - 1) {
      setGameOver(true);
      setFinalScore(sc => sc + strokeCount);
      setFinalPar(p => p + LEVELS[level].par);
      return;
    }
    setLevel(lvl => lvl + 1);
    setBall({ ...LEVELS[level + 1].ball });
    setHole({ ...LEVELS[level + 1].hole });
    setObstacles(LEVELS[level + 1].obstacles);
    setPowerups(LEVELS[level + 1].powerups.map(p => ({ ...p })));
    setVelocity({ x: 0, y: 0 });
    setMessage('');
    setMoving(false);
    setStrokeCount(0);
    setAiming(false);
    setAimStart(null);
    setAimEnd(null);
    setShowSnackbar(false);
    setSuperShotActive(false);
    setGhostBall(false);
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  };

  const handleRestartGame = () => {
    setLevel(0);
    setBall({ ...LEVELS[0].ball });
    setHole({ ...LEVELS[0].hole });
    setObstacles(LEVELS[0].obstacles);
    setPowerups(LEVELS[0].powerups.map(p => ({ ...p })));
    setVelocity({ x: 0, y: 0 });
    setMessage('');
    setMoving(false);
    setStrokeCount(0);
    setAiming(false);
    setAimStart(null);
    setAimEnd(null);
    setShowSnackbar(false);
    setSuperShotActive(false);
    setGameOver(false);
    setFinalScore(0);
    setFinalPar(0);
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  };

  // Powerup logic
  const usePowerup = (type: Powerup['type']) => {
    if (moving) return;
    if (type === 'superShot') {
      setSuperShotActive(true);
      setPowerups(p => p.map(pp => pp.type === 'superShot' && !pp.used ? { ...pp, used: true } : pp));
    } else if (type === 'teleport') {
      setBall(prev => ({ x: hole.x - 2 * BALL_RADIUS, y: hole.y }));
      setPowerups(p => p.map(pp => pp.type === 'teleport' && !pp.used ? { ...pp, used: true } : pp));
    }
  };

  // Par feedback
  const par = LEVELS[level].par;
  let parFeedback = '';
  if (!moving && !aiming && !gameOver && message && message.includes('Level Complete')) {
    if (strokeCount < par) parFeedback = 'Birdie! You beat par!';
    else if (strokeCount === par) parFeedback = 'Par!';
    else parFeedback = 'Over par! Try again!';
  }

  // Confetti animation
  useEffect(() => {
    if (!confetti.length) return;
    let animId: number;
    function animate() {
      setConfetti(prev => prev.map(c => ({ ...c, x: c.x + c.vx, y: c.y + c.vy + 1, vy: c.vy + 0.2 }))
        .filter(c => c.y < CANVAS_H));
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [confetti]);

  // Draw confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // ... existing drawing code ...
    // Draw confetti
    confetti.forEach(c => {
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, 6, 12);
    });
  }, [ball, aiming, aimStart, aimEnd, obstacles, hole, confetti]);

  // Play sounds only if soundOn
  useEffect(() => {
    shootSound.muted = !soundOn;
    winSound.muted = !soundOn;
  }, [soundOn]);

  // When win, trigger confetti
  useEffect(() => {
    if (showSnackbar && message.includes('Level Complete')) {
      setConfetti(Array.from({length: 60}, () => ({
        x: Math.random() * CANVAS_W,
        y: 0,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 2,
        color: getRandomColor()
      })));
      const timeout = setTimeout(() => setConfetti([]), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showSnackbar, message]);

  // Trail effect
  useEffect(()=>{
    if(moving) setTrail(t=>[...t,{x:ball.x,y:ball.y,color:ballColor}].slice(-30));
    else setTrail([]);
  },[ball,moving,ballColor]);

  // Wind effect
  useEffect(()=>{
    setWind({x:(Math.random()-0.5)*2,y:(Math.random()-0.5)*2});
  },[level]);

  // Show a new tip on level load or reset
  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, [level]);

  // When all levels in a world are completed, unlock next world
  useEffect(() => {
    if (level === LEVELS.length - 1 && message.includes('Level Complete') && selectedWorld === unlockedWorlds && unlockedWorlds < WORLDS.length - 1) {
      setTimeout(() => setUnlockedWorlds(u => u + 1), 1500);
    }
  }, [level, message, selectedWorld, unlockedWorlds]);

  // On startup, show WorldsHomeScreen
  if (showWorlds) {
    return <WorldsHomeScreen worlds={WORLDS} unlockedWorlds={unlockedWorlds} onSelectWorld={i => { setSelectedWorld(i); setShowWorlds(false); }} />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: theme==='light'?'#e0f2f1':'#222' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: theme==='light'?'#e0f2f1':'#222', minHeight: '100vh', position: 'relative' }}>
        <SettingsModal
          open={showSettings}
          onClose={()=>setShowSettings(false)}
          theme={theme}
          setTheme={setTheme}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          showAimingLine={showAimingLine}
          setShowAimingLine={setShowAimingLine}
        />
        <Typography variant="h3" gutterBottom>MiniGolf Game <SportsGolfIcon fontSize="large" /></Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>Level {level + 1} / {LEVELS.length}</Typography>
        <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>Par: {par}</Typography>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            border: '2px solid #333',
            background: '#4caf50',
            borderRadius: 8,
            cursor: moving ? 'not-allowed' : 'crosshair',
            width: '100%',
            height: '70vh',
            maxWidth: 1200,
            maxHeight: 800,
            display: 'block',
            margin: '0 auto',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <Snackbar open={showSnackbar} autoHideDuration={4000} onClose={() => setShowSnackbar(false)}>
          <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%' }}>
            {message} <Button color="inherit" size="small" onClick={handleNextLevel}>{level === LEVELS.length - 1 ? 'Finish Game' : 'Next Level'}</Button>
            <br />{parFeedback}
          </MuiAlert>
        </Snackbar>
        {/* Game Over Dialog */}
        {gameOver && (
          <Paper elevation={6} sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: '#fffde7' }}>
            <Typography variant="h4" color="success.main" gutterBottom>Congratulations! <CelebrationIcon fontSize="large" /></Typography>
            <Typography variant="h5">Game Over</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Total Strokes: {finalScore}</Typography>
            <Typography variant="h6">Total Par: {finalPar}</Typography>
            <Button variant="contained" color="primary" startIcon={<RestartAltIcon />} sx={{ mt: 2 }} onClick={handleRestartGame}>Restart Game</Button>
          </Paper>
        )}
      </Box>
      <Sidebar
        strokeCount={strokeCount}
        handleReset={handleReset}
        moving={moving}
        message={message}
        powerups={powerups}
        usePowerup={usePowerup}
        tip={tip}
      />
    </Box>
  );
}

export default App;