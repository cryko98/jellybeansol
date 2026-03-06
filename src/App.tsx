import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Copy, Check, Wallet, ShoppingCart, Repeat, CheckCircle2, ChevronDown } from 'lucide-react';
import MemeGenerator from './components/MemeGenerator';
import MemeWall from './components/MemeWall';
import JellybeanGame from './components/JellybeanGame';

const CONTRACT_ADDRESS = '412zDygnwP9DzitnQVgRKUFFTDmrYScFch6P2k39pump';

export default function App() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const hippoY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const hippoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const hippoRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const springHippoY = useSpring(hippoY, { stiffness: 100, damping: 30 });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imageHover = {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen overflow-x-hidden relative" ref={containerRef}>
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.img 
              src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jb-u2ER0qtvUZv5BNsu.png" 
              alt="Logo" 
              className="h-8 md:h-10 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.1 }}
              referrerPolicy="no-referrer"
            />
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-3 group cursor-pointer hover:bg-white/10 transition-all" onClick={copyToClipboard}>
              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">CA:</span>
              <code className="text-xs text-white/80 font-mono font-bold truncate max-w-[120px] md:max-w-none">
                {CONTRACT_ADDRESS}
              </code>
              <div className="text-yellow-400 group-hover:scale-110 transition-transform">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 md:gap-6 overflow-x-auto no-scrollbar w-full md:w-auto justify-center">
            {[
              { name: 'Home', id: 'home' },
              { name: 'About', id: 'about' },
              { name: 'Memes', id: 'memes' },
              { name: 'Game', id: 'game' },
              { name: 'Buy', id: 'buy' },
              { name: 'Roadmap', id: 'roadmap' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[10px] md:text-xs font-black text-white/60 hover:text-white uppercase tracking-widest px-3 py-2 rounded-full hover:bg-white/5 transition-all whitespace-nowrap"
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <motion.a 
              href="https://dexscreener.com/solana/2jbxebefzmnzgmp8frhsujjqqzudlhjzwbjvh7vbw7df"
              target="_blank"
              className="bg-yellow-400 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:scale-105 transition-transform"
              whileTap={{ scale: 0.95 }}
            >
              Buy Now
            </motion.a>
          </div>
        </div>
      </header>

      {/* Floating Decorative Jellybeans - Enhanced Rain Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute top-[10%] left-[5%] w-24 floating opacity-40" alt="" />
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute top-[30%] right-[10%] w-32 floating opacity-40 [animation-delay:1s]" alt="" />
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute bottom-[20%] left-[15%] w-20 floating opacity-40 [animation-delay:2s]" alt="" />
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute top-[60%] right-[5%] w-28 floating opacity-40 [animation-delay:0.5s]" alt="" />
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute top-[45%] left-[40%] w-16 floating opacity-20 [animation-delay:3s]" alt="" />
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute bottom-[10%] right-[30%] w-24 floating opacity-30 [animation-delay:1.5s]" alt="" />
        <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute top-[80%] left-[60%] w-20 floating opacity-20 [animation-delay:4s]" alt="" />
      </div>

      {/* 1. HEADER / HERO SECTION */}
      <section id="home" className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-24 px-4 z-10 overflow-hidden">
        {/* Complex Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,182,193,0.15)_0%,transparent_50%)]"
          />
          <motion.div 
            animate={{ 
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.15)_0%,transparent_50%)]"
          />
          
          {/* Large Background Text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <h2 className="font-museo text-[30vw] font-black italic uppercase tracking-tighter leading-none">
              JELLYBEAN
            </h2>
          </div>
        </div>

        <motion.div 
          style={{ opacity }}
          className="w-full max-w-7xl flex flex-col items-center text-center relative"
        >
          {/* Logo with enhanced effects */}
          <div className="relative mb-12">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="relative z-20"
            >
              <motion.img 
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jb-u2ER0qtvUZv5BNsu.png" 
                alt="Jellybean Logo" 
                className="w-full max-w-4xl drop-shadow-[0_0_60px_rgba(255,255,255,0.5)]"
                initial={{ opacity: 0, y: -100, scale: 0.5, rotate: -15 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.03, rotate: 2 }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-pink-500/20 blur-[100px] rounded-full z-10 scale-110" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-6 mb-20 relative z-30"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full mb-6 shadow-2xl"
            >
              <span className="text-white font-black tracking-[0.4em] uppercase text-xs md:text-sm">The Next Generation of Memes</span>
            </motion.div>
            <h1 className="font-museo text-5xl md:text-8xl text-white font-black tracking-tighter leading-none uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              The next viral <br className="hidden md:block" /> baby hippo
            </h1>
            <p className="font-museo text-2xl md:text-4xl text-yellow-300 font-black tracking-widest uppercase drop-shadow-lg">
              Born in America. Raised on the Blockchain.
            </p>
          </motion.div>

          {/* Character Section with more layers */}
          <div className="relative w-full max-w-5xl flex justify-center items-center mb-24">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 blur-[180px] rounded-full scale-110 animate-pulse" />
            
            <motion.div
              className="relative z-20"
              initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1.2, type: "spring", bounce: 0.3 }}
            >
              <motion.img 
                style={{ y: springHippoY, scale: hippoScale, rotate: hippoRotate }}
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jellybean-4VcIIo9lkb3iyhLx.webp" 
                alt="Jellybean Character" 
                className="w-80 md:w-[750px] drop-shadow-[0_0_120px_rgba(255,255,255,0.6)]"
                whileHover={{ scale: 1.08, rotate: 3 }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Hero Buttons with extra polish */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-24 relative z-40"
          >
            <motion.a 
              href="https://dexscreener.com/solana/2jbxebefzmnzgmp8frhsujjqqzudlhjzwbjvh7vbw7df"
              target="_blank"
              className="block w-80 md:w-[450px] relative group"
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <img 
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/dxs-6nCRx7ATo5K0ArJx.png" 
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative z-10" 
                alt="Dexscreener Chart" 
                referrerPolicy="no-referrer"
              />
            </motion.a>

            <motion.a 
              href="https://x.com/i/communities/2026237091508543653"
              target="_blank"
              className="block w-80 md:w-[450px] relative group"
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-purple-500/50 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <img 
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/chatgpt-image-feb-17-2026-03_04_48-am-efGETjOsrf2Xc3da(2).png" 
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative z-10" 
                alt="X Community" 
                referrerPolicy="no-referrer"
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Ticker Bar */}
      <div className="w-full bg-pink-500 py-6 overflow-hidden border-y-4 border-black z-20 relative shadow-[0_0_30px_rgba(236,72,153,0.5)]">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="font-museo text-2xl md:text-5xl text-white font-black uppercase italic tracking-tighter px-12">
                $JELLYBEAN TO THE MOON
              </span>
              <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jellybean-4VcIIo9lkb3iyhLx.webp" className="w-16 h-16 drop-shadow-md flex-shrink-0" alt="" />
              <span className="font-museo text-2xl md:text-5xl text-yellow-300 font-black uppercase italic tracking-tighter px-12">
                BORN IN AMERICA
              </span>
              <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jellybean-4VcIIo9lkb3iyhLx.webp" className="w-16 h-16 drop-shadow-md flex-shrink-0" alt="" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. MANIFESTO SECTION */}
      <section id="about" className="w-full py-32 px-4 flex flex-col items-center z-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="font-museo text-6xl md:text-9xl text-white font-black uppercase tracking-tighter mb-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
            EVOLUTION
          </h2>
          <p className="font-museo text-2xl md:text-5xl text-yellow-300 uppercase font-black tracking-[0.2em] drop-shadow-glow">IS INEVITABLE</p>
        </motion.div>

        <motion.div 
          className="pink-box w-full max-w-6xl p-12 md:p-20 relative overflow-hidden group"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Animated Background Blobs inside box */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"
          />
          
          <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute -bottom-10 -left-10 w-72 opacity-10 rotate-12 pointer-events-none group-hover:rotate-45 transition-transform duration-1000" alt="" />
          <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="absolute -top-10 -right-10 w-72 opacity-10 -rotate-12 pointer-events-none group-hover:-rotate-45 transition-transform duration-1000" alt="" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-museo text-6xl md:text-8xl text-white mb-12 drop-shadow-2xl font-black italic tracking-tighter">WHY JELLYBEAN?</h3>
            
            <div className="space-y-8 text-2xl md:text-3xl font-bold text-white leading-relaxed">
              <p className="hover:text-yellow-200 transition-all hover:scale-105 cursor-default">Because the world doesn't need another serious coin.</p>
              <p className="hover:text-yellow-200 transition-all hover:scale-105 cursor-default">It needs a baby hippo.</p>
              <p className="hover:text-yellow-200 transition-all hover:scale-105 cursor-default">Cute enough to go viral.</p>
              <p className="hover:text-yellow-200 transition-all hover:scale-105 cursor-default">Strong enough to stampede.</p>
              <div className="py-12">
                <motion.p 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl md:text-8xl font-museo text-yellow-300 drop-shadow-glow italic font-black"
                >
                  $JELLYBEAN
                </motion.p>
                <p className="text-3xl md:text-4xl font-museo opacity-80 mt-4 italic">isn't here to explain itself.</p>
              </div>
              <p className="text-4xl md:text-6xl font-museo text-white drop-shadow-2xl italic font-black">It's here to take over timelines.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20 px-4 gap-8">
              <motion.img 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" 
                className="w-40 md:w-64 drop-shadow-2xl" 
                alt="" 
              />
              <motion.img 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jbb-hNum98ZkRGwl7FAw.gif" 
                className="w-48 md:w-80 drop-shadow-2xl rounded-3xl" 
                alt="Jellybean Evolution GIF" 
              />
              <motion.img 
                animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
                src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" 
                className="w-40 md:w-64 scale-x-[-1] drop-shadow-2xl" 
                alt="" 
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Meme Generator Section */}
      <div id="memes" className="scroll-mt-20">
        <MemeGenerator />
        <MemeWall />
      </div>

      {/* Transition Image */}
      <div className="w-full flex flex-col items-center py-20 z-10 relative">
        <motion.img 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-7-8gCvdJHz8PXwiRoY(1).png" 
          className="w-full max-w-xl px-4 drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] mb-20"
          alt="Large Jellybean Character"
          referrerPolicy="no-referrer"
        />
        
        <motion.img 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/untitled-design-39-dDf39Jft8MQ2jVk8.png" 
          className="w-full max-w-5xl px-4 drop-shadow-2xl"
          alt="How to Buy Banner"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Mini Game Section */}
      <section id="game" className="w-full py-20 z-10 relative scroll-mt-20">
        <JellybeanGame />
      </section>

      {/* 4. HOW TO BUY SECTION */}
      <section id="buy" className="w-full py-32 px-4 flex flex-col items-center z-10 scroll-mt-20">
        <motion.h2 
          className="font-museo text-6xl md:text-9xl text-white mb-20 text-center drop-shadow-2xl font-black italic"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          How To Buy
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mb-24">
          {[
            { step: 1, title: "Get a Wallet", icon: <Wallet size={48} />, color: "bg-purple-400", desc: "Download Phantom or Solflare" },
            { step: 2, title: "Get Some SOL", icon: <ShoppingCart size={48} />, color: "bg-pink-400", desc: "Buy SOL on an exchange" },
            { step: 3, title: "Swap For $JELLYBEAN", icon: <Repeat size={48} />, color: "bg-yellow-400", desc: "Swap SOL on pump.fun" },
            { step: 4, title: "Welcome to the Herd", icon: <CheckCircle2 size={48} />, color: "bg-blue-400", desc: "You are now a hippo!" }
          ].map((item, i) => (
            <motion.div 
              key={item.step} 
              className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl relative group border border-white/20"
              whileHover={{ y: -15, scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
            >
              <div className={`absolute -top-6 -left-6 w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center font-museo text-3xl shadow-xl border-4 border-white z-20`}>
                {item.step}
              </div>
              <div className="text-white/40 mb-8 group-hover:text-yellow-400 transition-colors duration-300 scale-125 relative z-10">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 leading-tight relative z-10">{item.title}</h3>
              <p className="text-white/60 font-bold mb-6 relative z-10">{item.desc}</p>
              <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className="w-20 mt-auto opacity-20 group-hover:opacity-100 transition-opacity duration-500 relative z-10" alt="" />
              
              {/* Hover Glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity rounded-[3rem] blur-2xl ${item.color}`} />
            </motion.div>
          ))}
        </div>

        {/* Official Contract Box */}
        <motion.div 
          className="w-full max-w-5xl bg-purple-600/90 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-white/20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">Official Contract</h3>
          <p className="text-pink-200 font-black text-xl mb-10 flex items-center gap-3 uppercase tracking-widest">
            <CheckCircle2 size={24} className="text-green-400" /> Solana Verified & Audited
          </p>
          
          <div 
            onClick={copyToClipboard}
            className="w-full bg-black/30 border-2 border-white/10 rounded-3xl p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-black/40 transition-all group overflow-hidden shadow-inner"
          >
            <code className="font-mono text-sm md:text-2xl text-white/90 break-all text-left font-bold">
              {CONTRACT_ADDRESS}
            </code>
            <div className="flex-shrink-0 ml-6 bg-yellow-400 text-black p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform group-active:scale-95">
              {copied ? <Check size={32} /> : <Copy size={32} />}
            </div>
          </div>
          {copied && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-green-400 font-black text-xl uppercase tracking-widest"
            >
              Copied to clipboard!
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* 5. ROADMAP SECTION (THE STAMPEDE) */}
      <section id="roadmap" className="w-full py-32 px-4 flex flex-col items-center z-10 relative scroll-mt-20">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-museo text-6xl md:text-9xl text-white font-black uppercase tracking-tighter mb-2 drop-shadow-2xl italic">
            THE STAMPEDE
          </h2>
          <p className="font-museo text-2xl md:text-4xl text-yellow-300 uppercase font-black tracking-widest drop-shadow-glow">OUR PATH TO GLORY</p>
        </motion.div>

        <div className="w-full max-w-5xl space-y-12 relative">
          {/* Connecting Line */}
          <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-yellow-400 opacity-20 hidden md:block" />

          {[
            { phase: "Phase 1: The Birth", items: ["First Wiggle", "Snack Time", "Viral Hippo Noises", "1,000 Hippo Friends"], color: "bg-pink-500" },
            { phase: "Phase 2: The Growth", items: ["Big Splashes", "Watermelon Party", "Global Cuteness", "10,000 Hippo Friends"], color: "bg-purple-500" },
            { phase: "Phase 3: The Takeover", items: ["Hippo Kingdom", "Moon Bouncing", "Infinite Jellybeans", "Timeline Domination"], color: "bg-yellow-400" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className={`bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 group hover:bg-white/20 transition-all relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className={`w-24 h-24 ${item.color} rounded-full flex items-center justify-center font-museo text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform relative z-10 border-4 border-white`}>
                {i + 1}
              </div>
              <div className={`flex-1 text-center ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 italic uppercase tracking-tighter drop-shadow-md">{item.phase}</h3>
                <div className={`flex flex-wrap justify-center ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} gap-3`}>
                  {item.items.map((li, j) => (
                    <span key={j} className="px-6 py-3 bg-black/30 rounded-full text-white font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-black/50 transition-colors shadow-lg">
                      {li}
                    </span>
                  ))}
                </div>
              </div>
              <img src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/jellybean-1-0ni0BiSWV1vCVkaU.png" className={`w-32 opacity-20 group-hover:opacity-100 transition-opacity hidden md:block ${i % 2 === 0 ? 'rotate-12' : '-rotate-12'}`} alt="" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="w-full py-32 px-4 flex flex-col items-center text-center z-10 bg-black/20 backdrop-blur-md">
        <motion.img 
          src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jb-u2ER0qtvUZv5BNsu.png" 
          alt="Jellybean Logo" 
          className="w-64 md:w-[500px] mb-12 drop-shadow-glow"
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
          <motion.a 
            whileHover={{ scale: 1.05, y: -5 }} 
            href="https://x.com/i/communities/2026237091508543653" 
            target="_blank"
            className="w-48 md:w-64"
          >
            <img 
              src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/chatgpt-image-feb-17-2026-03_04_48-am-efGETjOsrf2Xc3da(2).png" 
              alt="X Community" 
              className="w-full h-auto drop-shadow-lg" 
              referrerPolicy="no-referrer"
            />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, y: -5 }} 
            href="https://www.tiktok.com/@wildlifeworldzoo" 
            target="_blank"
            className="w-48 md:w-64"
          >
            <img 
              src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/chatgpt-image-feb-17-2026-03_06_19-am-jBA71RT0BVNEcD9w(1).png" 
              alt="TikTok" 
              className="w-full h-auto drop-shadow-lg" 
              referrerPolicy="no-referrer"
            />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, y: -5 }} 
            href="https://www.instagram.com/wildlifeworldzoo/" 
            target="_blank"
            className="w-48 md:w-64"
          >
            <img 
              src="https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jellybean/insta-h8tbII9WDpiQH25K(1).png" 
              alt="Instagram" 
              className="w-full h-auto drop-shadow-lg" 
              referrerPolicy="no-referrer"
            />
          </motion.a>
        </div>
        <p className="text-white/40 mb-12 font-bold uppercase tracking-[0.5em]">©2026 Jellybean World</p>
        <div className="max-w-4xl p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
          <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.2em] leading-relaxed font-bold">
            Disclaimer $ JELLYBEAN is a memecoin with no intrinsic value
          </p>
        </div>
      </footer>
    </div>
  );
}
