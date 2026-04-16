import { useState, useEffect, useRef, useCallback, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Heart } from 'lucide-react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 100;
const CANDY_SIZE = 50;
const INITIAL_SPEED = 3.5;
const SPEED_INCREMENT = 0.25; // Increased from 0.15 for faster challenge
const INITIAL_SPAWN_RATE = 1200; // Decreased from 1400
const MIN_SPAWN_RATE = 300; // Decreased from 350

interface Candy {
  id: number;
  x: number;
  y: number;
  image: string;
  speed: number;
  rotation: number;
}

const CANDY_IMAGES = [
  'https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png',
  'https://content.mycutegraphics.com/graphics/jellybean/yellow-jellybean-black-outline.png',
  'https://content.mycutegraphics.com/graphics/jellybean/purple-jellybean-black-outline.png',
  'https://content.mycutegraphics.com/graphics/jellybean/green-jellybean-black-outline.png'
];

export default function JellybeanGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [playerRotation, setPlayerRotation] = useState(0);
  const [candies, setCandies] = useState<Candy[]>([]);
  const [difficulty, setDifficulty] = useState(1);
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);
  const nextId = useRef<number>(0);
  const targetPlayerX = useRef<number>(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);

  const spawnCandy = useCallback(() => {
    const x = Math.random() * (GAME_WIDTH - CANDY_SIZE);
    const image = CANDY_IMAGES[Math.floor(Math.random() * CANDY_IMAGES.length)];
    const speed = INITIAL_SPEED + (difficulty * SPEED_INCREMENT);
    
    const newCandy: Candy = {
      id: nextId.current++,
      x,
      y: -CANDY_SIZE,
      image,
      speed,
      rotation: Math.random() * 360
    };
    
    setCandies(prev => [...prev, newCandy]);
  }, [difficulty]);

  const updateGame = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    // Smooth player movement (lerp)
    setPlayerX(prev => {
      const lerpFactor = 0.15; // Slightly lower for "smoother" feel
      const diff = targetPlayerX.current - prev;
      
      // Add a slight tilt based on movement speed
      setPlayerRotation(diff * 0.1);
      
      if (Math.abs(diff) < 0.1) return targetPlayerX.current;
      return prev + diff * lerpFactor;
    });

    // Spawning logic
    const spawnRate = Math.max(MIN_SPAWN_RATE, INITIAL_SPAWN_RATE - (difficulty * 80)); // More aggressive spawn reduction
    if (time - lastSpawnTime.current > spawnRate) {
      spawnCandy();
      lastSpawnTime.current = time;
      setDifficulty(prev => prev + 0.2); // Faster difficulty increase
    }

    setCandies(prevCandies => {
      const nextCandies: Candy[] = [];
      let newMissed = 0;
      let newScore = 0;

      for (const candy of prevCandies) {
        const nextY = candy.y + candy.speed;
        
        // Collision detection
        const hitPlayer = 
          nextY + CANDY_SIZE >= GAME_HEIGHT - PLAYER_HEIGHT + 20 &&
          nextY <= GAME_HEIGHT &&
          candy.x + CANDY_SIZE >= playerX + 15 &&
          candy.x <= playerX + PLAYER_WIDTH - 15;

        if (hitPlayer) {
          newScore++;
          continue;
        }

        if (nextY > GAME_HEIGHT) {
          newMissed++;
          continue;
        }

        nextCandies.push({ ...candy, y: nextY, rotation: candy.rotation + 2 });
      }

      if (newScore > 0) setScore(s => s + newScore);
      if (newMissed > 0) {
        setMissed(m => {
          const totalMissed = m + newMissed;
          if (totalMissed >= 3) {
            setGameState('gameover');
          }
          return totalMissed;
        });
      }

      return nextCandies;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, playerX, spawnCandy, difficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updateGame]);

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (gameState !== 'playing' || !gameContainerRef.current) return;
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
      clientX = (e as TouchEvent).touches[0].clientX;
    } else {
      clientX = (e as MouseEvent).clientX;
    }
    
    const relativeX = clientX - rect.left;
    // Scale relativeX to GAME_WIDTH
    const scale = GAME_WIDTH / rect.width;
    const scaledX = relativeX * scale;
    
    // Add margin to prevent clipping in rounded corners
    const margin = 20;
    const newX = Math.max(margin, Math.min(GAME_WIDTH - PLAYER_WIDTH - margin, scaledX - PLAYER_WIDTH / 2));
    targetPlayerX.current = newX;
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setMissed(0);
    setCandies([]);
    setDifficulty(1);
    lastSpawnTime.current = performance.now();
    targetPlayerX.current = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setPlayerRotation(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="font-museo text-3xl sm:text-4xl md:text-6xl text-white font-black uppercase italic tracking-tighter mb-2 md:mb-4">
          Catch the Jellybeans!
        </h2>
        <p className="text-yellow-300 font-bold uppercase tracking-widest text-xs md:text-sm">
          Don't let 3 candies drop or it's game over!
        </p>
      </div>

      <div 
        ref={gameContainerRef}
        className="relative w-full aspect-[16/10] bg-black/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border-2 md:border-4 border-white/20 overflow-hidden cursor-none touch-none shadow-2xl"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {/* Game UI Overlay */}
        <div className="absolute top-4 left-6 md:top-8 md:left-10 z-30 flex items-center gap-4 md:gap-8">
          <div className="bg-black/60 backdrop-blur-xl px-4 md:px-8 py-1.5 md:py-3 rounded-full border border-white/20 shadow-xl">
            <span className="text-white font-black text-xs md:text-3xl tracking-tighter">SCORE: {score}</span>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`${i < 3 - missed ? 'text-pink-500 fill-pink-500' : 'text-white/20'} transition-all scale-75 md:scale-125 md:w-8 md:h-8`} 
              />
            ))}
          </div>
        </div>

        {/* Start Screen */}
        <AnimatePresence>
          {gameState === 'start' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 bg-pink-500/20 rounded-full flex items-center justify-center text-6xl md:text-8xl mb-6 md:mb-8 shadow-2xl animate-bounce">
                🦛
              </div>
              <button 
                onClick={startGame}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl md:text-4xl px-8 md:px-16 py-3 md:py-6 rounded-full shadow-[0_6px_0_rgb(202,138,4)] md:shadow-[0_10px_0_rgb(202,138,4)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-tighter italic"
              >
                Start Game
              </button>
            </motion.div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <Trophy size={60} className="text-yellow-400 mb-4 md:mb-6 animate-bounce md:w-20 md:h-20" />
              <h3 className="font-museo text-4xl md:text-7xl text-white font-black uppercase italic mb-2 text-center">Game Over!</h3>
              <p className="text-xl md:text-4xl text-yellow-300 font-black mb-8 md:mb-16">FINAL SCORE: {score}</p>
              <button 
                onClick={startGame}
                className="flex items-center gap-3 md:gap-4 bg-pink-500 hover:bg-pink-400 text-white font-black text-xl md:text-4xl px-10 md:px-16 py-3 md:py-6 rounded-full shadow-[0_6px_0_rgb(190,24,93)] md:shadow-[0_10px_0_rgb(190,24,93)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-tighter italic"
              >
                <RotateCcw size={24} className="md:w-8 md:h-8" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Canvas / Elements */}
        {gameState === 'playing' && (
          <>
            {/* Player */}
            <div 
              className="absolute bottom-0 pointer-events-none transition-transform duration-75 flex items-center justify-center overflow-visible"
              style={{ 
                left: `${(playerX / GAME_WIDTH) * 100}%`,
                width: `${(PLAYER_WIDTH / GAME_WIDTH) * 100}%`,
                height: `${(PLAYER_HEIGHT / GAME_HEIGHT) * 100}%`,
                transform: `rotate(${playerRotation}deg)`
              }}
            >
              <span className="text-5xl sm:text-6xl md:text-8xl select-none leading-none translate-y-[-10%] md:translate-y-0">
                🦛
              </span>
            </div>

            {/* Candies */}
            {candies.map(candy => (
              <div 
                key={candy.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${(candy.x / GAME_WIDTH) * 100}%`,
                  top: `${(candy.y / GAME_HEIGHT) * 100}%`,
                  width: `${(CANDY_SIZE / GAME_WIDTH) * 100}%`,
                  height: `${(CANDY_SIZE / GAME_HEIGHT) * 100}%`,
                  transform: `rotate(${candy.rotation}deg)`
                }}
              >
                <img 
                  src={candy.image} 
                  className="w-full h-full object-contain drop-shadow-md"
                  alt="Jellybean"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </>
        )}
      </div>
      
      <div className="mt-8 flex justify-center">
        <div className="bg-white/5 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 text-white/90 text-sm font-bold uppercase tracking-widest text-center">
          Move your mouse or finger to catch the falling jellybeans!<br/>
          Watch out, they speed up fast!
        </div>
      </div>
    </div>
  );
}
