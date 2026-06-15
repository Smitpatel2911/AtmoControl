import React, { useMemo } from 'react';
import { Particle, EffectConfig } from '../types';

interface ParticleCanvasProps {
  type: 'snowflake' | 'balloon';
  config: EffectConfig;
  triggerKey: number; // Used to re-initialize particles on button clicks
  key?: string;
}

// Premium muted colors for the balloons
const BALLOON_COLORS = [
  '#f43f5e', // rose-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#fa5838', // tangerine
];

export default function ParticleCanvas({ type, config, triggerKey }: ParticleCanvasProps) {
  // Generate particles based on config and type when parameters or triggerKey changes
  const particles = useMemo(() => {
    const spawned: Particle[] = [];
    
    // Determine the particle count
    let count = 0;
    if (type === 'snowflake') {
      if (config.density === 'low') count = 25;
      else if (config.density === 'medium') count = 55;
      else count = 95;
    } else {
      if (config.density === 'low') count = 12;
      else if (config.density === 'medium') count = 26;
      else count = 44;
    }

    // Determine speed multipliers
    let baseMinDuration = 3.5;
    let baseMaxDuration = 5.2;
    if (config.speed === 'slow') {
      baseMinDuration = 5.5;
      baseMaxDuration = 7.5;
    } else if (config.speed === 'fast') {
      baseMinDuration = 2.0;
      baseMaxDuration = 3.2;
    }

    // Determine sway settings
    let swayMultiplier = 1;
    if (config.windDirection === 'left') swayMultiplier = -1.5;
    if (config.windDirection === 'right') swayMultiplier = 1.5;

    for (let i = 0; i < count; i++) {
      const id = `${type}-${triggerKey}-${i}`;
      
      // Medium sizes as requested
      const sizeList = type === 'snowflake' 
        ? { min: 16, max: 22 } // Medium snowflakes
        : { min: 32, max: 42 }; // Medium balloons

      const size = Math.random() * (sizeList.max - sizeList.min) + sizeList.min;
      const left = Math.random() * 100;
      
      // Delay staggered inside the 5-second active window
      // Spawning looks more exciting if we spread them over 0 to 3.8s
      const delay = Math.random() * 3.8;
      
      const duration = Math.random() * (baseMaxDuration - baseMinDuration) + baseMinDuration;
      
      // Sway calculations based on wind configuration
      const baseSwayX = Math.random() * 40 + 20; // 20px to 60px sway
      const swayX = baseSwayX * swayMultiplier;
      
      const rotateDeg = (Math.random() * 120 + 60) * (Math.random() > 0.5 ? 1 : -1);
      const color = BALLOON_COLORS[i % BALLOON_COLORS.length];
      const opacity = Math.random() * 0.25 + 0.75; // 0.75 to 1.0

      // Split evenly between back and front layers (50/50)
      const zPosition = i % 2 === 0 ? 'back' : 'front';

      spawned.push({
        id,
        type,
        left,
        size,
        duration,
        delay,
        swayX,
        rotateDeg,
        color,
        opacity,
        zPosition,
      });
    }

    return spawned;
  }, [type, config, triggerKey]);

  // Render individual Snowflake SVG
  const renderSnowflake = (particle: Particle) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-blue-300/80 drop-shadow-[0_1.5px_2px_rgba(255,255,255,0.8)] filter transition-all dark:text-sky-100"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="5" y1="19" x2="19" y2="5" />
        <path d="M12 5l3 3M12 5l-3 3M12 19l3-3M12 19l-3-3" />
        <path d="M5 12l3 3M5 12l3-3M19 12l-3 3M19 12l-3-3" />
      </svg>
    );
  };

  // Render highly detailed 3D/realistic Balloon SVG
  const renderBalloon = (particle: Particle) => {
    return (
      <svg
        viewBox="0 0 40 60"
        fill="currentColor"
        style={{ color: particle.color }}
        className="w-full h-full drop-shadow-md select-none pointer-events-none"
      >
        {/* Main balloon capsule */}
        <ellipse cx="20" cy="24" rx="14" ry="18" />
        
        {/* Little triangle knot tie at the bottom of the balloon */}
        <polygon points="20,41 16,46 24,46" />
        
        {/* Curved string dangling below */}
        <path 
          d="M20,46 Q17,51 22,56 T19,61" 
          fill="none" 
          stroke="rgba(15, 23, 42, 0.45)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        
        {/* Realistic light highlight balloon reflection reflection */}
        <ellipse 
          cx="15" 
          cy="18" 
          rx="3.5" 
          ry="6.5" 
          fill="rgba(255, 255, 255, 0.42)" 
          transform="rotate(-15, 15, 18)" 
        />
      </svg>
    );
  };

  // Split particles into two lists
  const backParticles = particles.filter(p => p.zPosition === 'back');
  const frontParticles = particles.filter(p => p.zPosition === 'front');

  const renderParticlesList = (list: Particle[]) => {
    return list.map((p) => {
      const styles = {
        '--anim-duration': `${p.duration}s`,
        '--anim-delay': `${p.delay}s`,
        '--sway-x': `${p.swayX}px`,
        '--rot-deg': `${p.rotateDeg}deg`,
        '--p-opacity': p.opacity || 0.85,
        left: `${p.left}%`,
        width: `${p.size}px`,
        height: p.type === 'balloon' ? `${p.size * 1.5}px` : `${p.size}px`,
      } as React.CSSProperties;

      return (
        <div
          id={`particle-${p.id}`}
          key={p.id}
          style={styles}
          className={`absolute pointer-events-none rounded-full select-none ${
            p.type === 'snowflake' ? 'animate-fall' : 'animate-rise'
          }`}
        >
          {p.type === 'snowflake' ? renderSnowflake(p) : renderBalloon(p)}
        </div>
      );
    });
  };

  return (
    <>
      {/* Background layer: falls/rises behind the active card */}
      <div id="particles-bg-depth" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {renderParticlesList(backParticles)}
      </div>

      {/* Foreground layer: falls/rises in front of the active card */}
      <div id="particles-fg-depth" className="fixed inset-0 overflow-hidden pointer-events-none z-30">
        {renderParticlesList(frontParticles)}
      </div>
    </>
  );
}
