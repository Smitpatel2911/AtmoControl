import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Snowflake, 
  Wind, 
  Sliders, 
  Clock, 
  Square,
  Palette,
  Terminal,
  Activity,
  Maximize2,
  Info,
  CircleDot
} from 'lucide-react';
import { EffectType, EffectConfig } from './types';
import ParticleCanvas from './components/ParticleCanvas';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'system';
}

export default function App() {
  const [activeEffect, setActiveEffect] = useState<EffectType>('none');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [triggerKey, setTriggerKey] = useState<number>(0);
  const [theme, setTheme] = useState<'slate' | 'navy' | 'ivory'>('slate');
  
  // Simulation configurations
  const [density, setDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [windDirection, setWindDirection] = useState<'none' | 'left' | 'right'>('none');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '14:22:01', message: 'Atmospheric Kernel handshake completed', type: 'system' },
    { timestamp: '14:22:05', message: 'Dual layer particle emitters compiled dynamically', type: 'success' },
    { timestamp: '14:23:10', message: 'Awaiting trigger stimulus command...', type: 'info' }
  ]);

  // Track system start-time for precise uptime
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(142 * 3600 + 12 * 60 + 4);

  // Increment uptime
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addLogMessage = (message: string, type: 'info' | 'success' | 'warn' | 'system') => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 8));
  };

  // Trigger effect safely
  const handleTrigger = (effect: 'snowflakes' | 'balloons') => {
    setActiveEffect(effect);
    setTimeLeft(5.0);
    setTriggerKey((prev) => prev + 1);
    
    addLogMessage(
      `Triggered ${effect === 'snowflakes' ? '❄️ Snowflake fall' : '🎈 Balloon ascent'} sequence with density=${density}, speed=${speed}, wind=${windDirection}`, 
      'success'
    );
  };

  // Stop current active simulation
  const handleStop = () => {
    if (activeEffect !== 'none') {
      addLogMessage(`Active simulation terminated by manual override`, 'warn');
    }
    setActiveEffect('none');
    setTimeLeft(0);
  };

  // Elegant Countdown ticking logic (100ms resolution)
  useEffect(() => {
    if (activeEffect === 'none') return;

    const tick = 100;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          addLogMessage(`Completed 5.0s transient sequence cycle`, 'info');
          setActiveEffect('none');
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, tick);

    return () => clearInterval(interval);
  }, [activeEffect, triggerKey]);

  // Theme-specific colors
  const pageBgClass = useMemo(() => {
    switch (theme) {
      case 'navy':
        return 'bg-slate-950 text-slate-100';
      case 'ivory':
        return 'bg-stone-50 text-stone-900';
      case 'slate':
      default:
        return 'bg-slate-50 text-slate-800';
    }
  }, [theme]);

  const headerBgClass = useMemo(() => {
    switch (theme) {
      case 'navy':
        return 'bg-slate-900 border-slate-800';
      case 'ivory':
        return 'bg-white border-stone-200';
      case 'slate':
      default:
        return 'bg-white border-slate-200';
    }
  }, [theme]);

  const cardClass = useMemo(() => {
    switch (theme) {
      case 'navy':
        return 'bg-slate-900 border-slate-800 shadow-xl shadow-slate-950/20';
      case 'ivory':
        return 'bg-white border-stone-200 shadow-sm';
      case 'slate':
      default:
        return 'bg-white border-slate-200 shadow-md';
    }
  }, [theme]);

  const textMutedClass = useMemo(() => {
    return theme === 'navy' ? 'text-slate-400' : 'text-slate-500';
  }, [theme]);

  const activeProgressPercentage = (timeLeft / 5) * 100;

  return (
    <div id="atmo-control-container" className={`w-full min-h-screen flex flex-col transition-colors duration-500 ease-in-out font-sans ${pageBgClass}`}>
      
      {/* 5-second dynamic particle emitters */}
      {activeEffect !== 'none' && (
        <ParticleCanvas 
          key={`${activeEffect}-${triggerKey}`}
          type={activeEffect === 'snowflakes' ? 'snowflake' : 'balloon'}
          config={{ density, windDirection, speed }}
          triggerKey={triggerKey}
        />
      )}

      {/* Styled Theme Header */}
      <header id="atmo-app-header" className={`h-16 border-b flex items-center justify-between px-8 shrink-0 relative z-40 ${headerBgClass}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tighter select-none shadow-sm shadow-blue-500/20">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight">AtmoControl Pro v2.4</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className={textMutedClass}>Kernel Status:</span>
            <span className="font-semibold text-emerald-500">System Ready</span>
          </span>
          <span className="hidden sm:inline-block h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <span className={`hidden sm:flex items-center gap-1.5 ${textMutedClass}`}>
            <Clock className="w-3.5 h-3.5" />
            Uptime: <span className="font-semibold">{formatUptime(uptimeSeconds)}</span>
          </span>
        </div>
      </header>

      {/* Main Two-Column Structure */}
      <main id="atmo-main-content" className="flex-grow flex flex-col md:flex-row p-6 md:p-8 gap-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Aside Sidebar Controls */}
        <aside id="aside-parameters" className="w-full md:w-72 shrink-0 flex flex-col gap-5 z-20">
          
          {/* Active Configuration Info */}
          <div className={`border rounded-xl p-5 ${cardClass}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              System Parameters
            </h3>
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className={textMutedClass}>Density</span>
                  <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">{density}</span>
                </div>
                <div className="flex rounded bg-slate-100 dark:bg-slate-950 p-0.5 border border-slate-200/50 dark:border-slate-800/50">
                  {['low', 'medium', 'high'].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDensity(d as any);
                        addLogMessage(`Adjusted emission density profile to ${d}`, 'info');
                      }}
                      className={`flex-1 text-[10px] font-semibold py-1 rounded capitalize transition-all ${
                        density === d
                          ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className={textMutedClass}>Velocity / Speed</span>
                  <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">{speed}</span>
                </div>
                <div className="flex rounded bg-slate-100 dark:bg-slate-950 p-0.5 border border-slate-200/50 dark:border-slate-800/50">
                  {['slow', 'normal', 'fast'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeed(s as any);
                        addLogMessage(`Adjusted sequence velocity scaling to ${s}`, 'info');
                      }}
                      className={`flex-1 text-[10px] font-semibold py-1 rounded capitalize transition-all ${
                        speed === s
                          ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className={`${textMutedClass} flex items-center gap-1`}>
                    <Wind className="w-3 h-3 text-slate-400" />
                    Wind Vector
                  </span>
                  <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">
                    {windDirection === 'none' ? 'Centered' : `${windDirection} Sway`}
                  </span>
                </div>
                <div className="flex rounded bg-slate-100 dark:bg-slate-950 p-0.5 border border-slate-200/50 dark:border-slate-800/50">
                  {['left', 'none', 'right'].map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setWindDirection(w as any);
                        addLogMessage(`Realigned wind lateral sway direction: ${w}`, 'info');
                      }}
                      className={`flex-1 text-[10px] font-semibold py-1 rounded capitalize transition-all ${
                        windDirection === w
                          ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {w === 'none' ? 'None' : w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clean Terminal Live Output panel */}
          <div className={`border rounded-xl p-5 flex-grow flex flex-col ${cardClass}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Event Console Logs
            </h3>
            <div className="flex-grow font-mono text-[10px] space-y-2.5 overflow-hidden max-h-[160px] md:max-h-full">
              {logs.map((log, index) => {
                let color = 'text-slate-500';
                if (log.type === 'success') color = 'text-blue-600 dark:text-blue-400';
                if (log.type === 'warn') color = 'text-rose-500';
                if (log.type === 'system') color = 'text-emerald-500';

                return (
                  <div key={index} className="leading-relaxed border-b border-slate-100 dark:border-slate-950 pb-1.5 last:border-0">
                    <span className="text-slate-400 dark:text-slate-600">[{log.timestamp}]</span>{' '}
                    <span className={color}>{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Central Display / Sequence Console stage */}
        <section id="sequence-stage" className={`flex-grow border rounded-2xl flex flex-col justify-between p-8 md:p-12 relative z-20 ${cardClass}`}>
          
          {/* Subtle decoration lines */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Title description */}
          <div className="max-w-xl mx-auto text-center my-auto space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-sans text-slate-900 dark:text-white">
              Atmospheric Trigger Console
            </h1>
            <p className={`text-sm md:text-base leading-relaxed ${textMutedClass}`}>
              Initiate transient environmental micro-climate sequences below. Selecting any module triggers a premium, localized, 5-second medium-scale physical representation.
            </p>
          </div>

          {/* Center countdown monitor / transient sequence feedback block */}
          <div className="max-w-md w-full mx-auto my-6">
            <AnimatePresence mode="wait">
              {activeEffect !== 'none' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-5 rounded-xl border border-blue-500/20 bg-blue-50/40 dark:bg-slate-950/40"
                >
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative sidebar-dot rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        Module Cycle: <span className="capitalize text-blue-600 dark:text-blue-400">{activeEffect}</span>
                      </p>
                    </div>
                    <span className="font-mono bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-800 text-xs">
                      {timeLeft.toFixed(1)}s active
                    </span>
                  </div>

                  {/* Progress layout */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        activeEffect === 'snowflakes'
                          ? 'bg-gradient-to-r from-teal-400 to-blue-500'
                          : 'bg-gradient-to-r from-rose-400 to-pink-500'
                      }`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${activeProgressPercentage}%` }}
                      transition={{ duration: 0.1, ease: 'linear' }}
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/10">
                  Select a certified sequence trigger modules to start simulation.
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Primary triggers block */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg w-full mx-auto mb-4">
            <button
              id="snowflakes-trigger-sequence"
              onClick={() => handleTrigger('snowflakes')}
              style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              className={`w-full sm:w-auto px-10 py-4 rounded-lg font-semibold text-[15px] select-none text-center shadow-lg hover:shadow-xl hover:translate-y-[-1px] ${
                activeEffect === 'snowflakes'
                  ? 'bg-blue-600 text-white border-2 border-transparent scale-[1.03]'
                  : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-50 border-2 border-transparent'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Snowflake className={`w-4 h-4 ${activeEffect === 'snowflakes' ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                Snowflakes
              </span>
            </button>

            <button
              id="balloons-trigger-sequence"
              onClick={() => handleTrigger('balloons')}
              style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              className={`w-full sm:w-auto px-10 py-4 rounded-lg font-semibold text-[15px] select-none text-center shadow-md hover:shadow-lg hover:translate-y-[-1px] ${
                activeEffect === 'balloons'
                  ? 'bg-pink-600 text-white border-2 border-transparent scale-[1.03]'
                  : 'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <CircleDot className="w-4 h-4" />
                Balloons
              </span>
            </button>
          </div>

          {/* Footer of the stage containing control overrides & themes */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6 shrink-0 text-xs">
            
            {/* Custom Canvas Color Profile Palette switcher */}
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span className={textMutedClass}>Console Profile:</span>
              <div className="flex gap-1.5 ml-1">
                {(['slate', 'navy', 'ivory'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      addLogMessage(`Realigned canvas profile to ${t}`, 'info');
                    }}
                    title={`${t} Theme Preset`}
                    className={`w-4.5 h-4.5 rounded-full border transition-all ${
                      t === 'slate' 
                        ? 'bg-slate-200 dark:bg-slate-800 border-slate-400' 
                        : t === 'navy' 
                        ? 'bg-slate-950 border-slate-700' 
                        : 'bg-stone-100 border-stone-300'
                    } ${theme === t ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'}`}
                  />
                ))}
              </div>
            </div>

            {/* Force shut sequence */}
            <button
              id="manual-override-button"
              disabled={activeEffect === 'none'}
              onClick={handleStop}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-[10px] tracking-wider uppercase font-semibold transition-all ${
                activeEffect !== 'none'
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'opacity-40 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-transparent cursor-not-allowed'
              }`}
            >
              <Square className="w-3 h-3 fill-current" />
              Terminate Activity
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}
