export interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Powerup {
  type: 'superShot' | 'teleport';
  used?: boolean;
}

export interface LevelConfig {
  ball: { x: number; y: number };
  hole: { x: number; y: number; r: number };
  obstacles: Obstacle[];
  powerups: Powerup[];
}

export const LEVELS: LevelConfig[] = [
  {
    ball: { x: 100, y: 150 },
    hole: { x: 365, y: 150, r: 10 },
    obstacles: [],
    powerups: [{ type: 'superShot' }],
  },
  {
    ball: { x: 60, y: 60 },
    hole: { x: 340, y: 240, r: 10 },
    obstacles: [
      { x: 200, y: 0, w: 20, h: 200 },
    ],
    powerups: [{ type: 'teleport' }],
  },
  {
    ball: { x: 200, y: 50 },
    hole: { x: 200, y: 250, r: 10 },
    obstacles: [
      { x: 100, y: 120, w: 200, h: 20 },
      { x: 300, y: 180, w: 20, h: 80 },
    ],
    powerups: [{ type: 'superShot' }, { type: 'teleport' }],
  },
]; 