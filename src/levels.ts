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
    ball: { x: 100, y: 300 },
    hole: { x: 700, y: 300, r: 10 },
    obstacles: [
      { x: 300, y: 200, w: 30, h: 200 },
      { x: 500, y: 200, w: 30, h: 200 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'ghostBall' }],
    par: 3,
  },
  {
    ball: { x: 100, y: 100 },
    hole: { x: 700, y: 500, r: 10 },
    obstacles: [
      { x: 400, y: 0, w: 30, h: 300 },
      { x: 400, y: 300, w: 30, h: 300 },
      { x: 200, y: 250, w: 200, h: 30 },
      { x: 500, y: 150, w: 200, h: 30 },
    ],
    powerups: [{ type: 'teleport' }, { type: 'ghostBall' }],
    par: 4,
  },
  {
    ball: { x: 400, y: 100 },
    hole: { x: 400, y: 500, r: 10 },
    obstacles: [
      { x: 200, y: 200, w: 400, h: 30 },
      { x: 200, y: 400, w: 400, h: 30 },
      { x: 300, y: 200, w: 30, h: 200 },
      { x: 500, y: 200, w: 30, h: 200 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'teleport' }, { type: 'ghostBall' }],
    par: 5,
  },
  {
    ball: { x: 100, y: 500 },
    hole: { x: 700, y: 100, r: 10 },
    obstacles: [
      { x: 300, y: 100, w: 30, h: 400 },
      { x: 500, y: 100, w: 30, h: 400 },
      { x: 300, y: 100, w: 200, h: 30 },
      { x: 300, y: 470, w: 200, h: 30 },
      { x: 400, y: 250, w: 30, h: 100 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'ghostBall' }],
    par: 6,
  },
  {
    ball: { x: 700, y: 500 },
    hole: { x: 100, y: 100, r: 10 },
    obstacles: [
      { x: 200, y: 150, w: 400, h: 30 },
      { x: 200, y: 350, w: 400, h: 30 },
      { x: 200, y: 150, w: 30, h: 200 },
      { x: 600, y: 150, w: 30, h: 200 },
      { x: 350, y: 250, w: 100, h: 30 },
      { x: 400, y: 200, w: 30, h: 100 },
    ],
    powerups: [{ type: 'teleport' }, { type: 'superShot' }, { type: 'ghostBall' }],
    par: 7,
  },
  {
    ball: { x: 100, y: 100 },
    hole: { x: 700, y: 500, r: 10 },
    obstacles: [
      { x: 250, y: 0, w: 30, h: 300 },
      { x: 550, y: 300, w: 30, h: 300 },
      { x: 250, y: 0, w: 300, h: 30 },
      { x: 250, y: 570, w: 300, h: 30 },
      { x: 400, y: 200, w: 30, h: 200 },
      { x: 300, y: 300, w: 200, h: 30 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'ghostBall' }],
    par: 8,
  },
  {
    ball: { x: 400, y: 550 },
    hole: { x: 400, y: 50, r: 10 },
    obstacles: [
      { x: 150, y: 100, w: 30, h: 400 },
      { x: 650, y: 100, w: 30, h: 400 },
      { x: 150, y: 100, w: 500, h: 30 },
      { x: 150, y: 470, w: 500, h: 30 },
      { x: 300, y: 200, w: 30, h: 200 },
      { x: 500, y: 200, w: 30, h: 200 },
      { x: 350, y: 300, w: 100, h: 30 },
    ],
    powerups: [{ type: 'teleport' }, { type: 'superShot' }, { type: 'ghostBall' }],
    par: 9,
  },
  {
    ball: { x: 100, y: 100 },
    hole: { x: 700, y: 500, r: 10 },
    obstacles: [
      { x: 200, y: 0, w: 30, h: 600 },
      { x: 600, y: 0, w: 30, h: 600 },
      { x: 200, y: 0, w: 400, h: 30 },
      { x: 200, y: 570, w: 400, h: 30 },
      { x: 300, y: 150, w: 30, h: 300 },
      { x: 500, y: 150, w: 30, h: 300 },
      { x: 350, y: 250, w: 100, h: 30 },
      { x: 350, y: 350, w: 100, h: 30 },
      { x: 400, y: 200, w: 30, h: 200 },
    ],
    powerups: [{ type: 'teleport' }, { type: 'superShot' }, { type: 'ghostBall' }],
    par: 10,
  },
]; 