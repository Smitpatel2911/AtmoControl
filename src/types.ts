export type EffectType = 'none' | 'snowflakes' | 'balloons';

export interface Particle {
  id: string;
  type: 'snowflake' | 'balloon';
  left: number;       // Percentage (0 - 100)
  size: number;       // Size in pixels (e.g., 18-24 for snowflake, 32-44 for balloon)
  duration: number;   // Travel duration in seconds
  delay: number;      // Staggered trigger delay in seconds
  swayX: number;      // Max translation drift in pixels
  rotateDeg: number;  // Max rotation drift
  color?: string;     // Color for balloons
  opacity?: number;   // Subtle opacity variations
  zPosition: 'back' | 'front'; // Whether it layers behind or in front of the controller glass card
}

export interface EffectConfig {
  density: 'low' | 'medium' | 'high';
  windDirection: 'none' | 'left' | 'right';
  speed: 'slow' | 'normal' | 'fast';
}
