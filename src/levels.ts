export interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Powerup {
  type: 'superShot' | 'teleport' | 'ghostBall';
  used?: boolean;
}

export interface LevelConfig {
  ball: { x: number; y: number };
  hole: { x: number; y: number; r: number };
  obstacles: Obstacle[];
  powerups: Powerup[];
  par: number;
}

export const LEVELS: LevelConfig[] = [
  {
    ball: { x: 100, y: 400 },
    hole: { x: 1100, y: 400, r: 10 },
    obstacles: [],
    powerups: [{ type: 'superShot' }, { type: 'ghostBall' }],
    par: 2,
  },
  {
    ball: { x: 100, y: 100 },
    hole: { x: 1100, y: 700, r: 10 },
    obstacles: [
      { x: 600, y: 0, w: 30, h: 600 },
    ],
    powerups: [{ type: 'teleport' }, { type: 'ghostBall' }],
    par: 3,
  },
  {
    ball: { x: 600, y: 100 },
    hole: { x: 600, y: 700, r: 10 },
    obstacles: [
      { x: 200, y: 400, w: 800, h: 30 },
      { x: 900, y: 500, w: 30, h: 200 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'teleport' }, { type: 'ghostBall' }],
    par: 4,
  },
  {
    ball: { x: 100, y: 700 },
    hole: { x: 1100, y: 100, r: 10 },
    obstacles: [
      { x: 300, y: 300, w: 700, h: 30 },
      { x: 800, y: 100, w: 30, h: 600 },
      { x: 900, y: 0, w: 30, h: 300 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'ghostBall' }],
    par: 4,
  },
  {
    ball: { x: 1100, y: 700 },
    hole: { x: 100, y: 100, r: 10 },
    obstacles: [
      { x: 300, y: 300, w: 700, h: 30 },
      { x: 300, y: 500, w: 30, h: 200 },
      { x: 800, y: 0, w: 30, h: 400 },
      { x: 900, y: 400, w: 200, h: 30 },
    ],
    powerups: [{ type: 'teleport' }, { type: 'superShot' }, { type: 'ghostBall' }],
    par: 5,
  },
]; 