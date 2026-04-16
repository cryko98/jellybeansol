import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Copy, Check, Wallet, ShoppingCart, Repeat, CheckCircle2, X as LucideX, Instagram, Send, Globe, Gamepad2, Info, LayoutDashboard, ChevronDown } from 'lucide-react';
import JellybeanGame from './components/JellybeanGame';

const CONTRACT_ADDRESS = '412zDygnwP9DzitnQVgRKUFFTDmrYScFch6P2k39pump';
const DONATION_WALLET = '4zSqvAxtpZTPeN8vJzZAFm1UUaCQhf1HtEsRVVqWqMxF';

const MEME_IMAGES = [
  "https://pbs.twimg.com/media/HEhpo89WoAAFSM4?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HEf847yW4AAHef1?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HEcC5dXaMAAMJWd?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HEa6Oh0aAAALpH2?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HEYzAj1XAAAR0gd?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HEV7HazaUAAPDhK?format=jpg&name=360x360",
  "https://pbs.twimg.com/media/HERxCtmbsAA44MD?format=jpg&name=360x360",
  "https://pbs.twimg.com/media/HEDbFUcWoAAGQaN?format=jpg&name=360x360",
  "https://pbs.twimg.com/media/HD-utXUaYAAWGbd?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HD6zSYrXQAA7lfh?format=jpg&name=360x360",
  "https://pbs.twimg.com/media/HD3F2aGboAIhA2O?format=jpg&name=240x240",
  "https://pbs.twimg.com/media/HDyvD-bW4AEdTbl?format=jpg&name=360x360",
  "https://pbs.twimg.com/media/HDwPUiFakAAE5jo?format=jpg&name=360x360",
  "https://pbs.twimg.com/media/HDsApuBWoAAwFtz?format=jpg&name=360x360"
];

export default function App() {
  const [copied, setCopied] = useState(false);
  const [donationCopied, setDonationCopied] = useState(false);
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDonationToClipboard = () => {
    navigator.clipboard.writeText(DONATION_WALLET);
    setDonationCopied(true);
    setTimeout(() => setDonationCopied(false), 2000);
  };

  const imageHover = {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen overflow-x-hidden relative bg-[#0a0510]" ref={containerRef}>
      {/* Background Overlay to ensure visibility */}
      <div className="fixed inset-0 bg-black/40 z-0 pointer-events-none" />
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="https://pbs.twimg.com/profile_images/2044414764231868416/oVL2TxK1_400x400.jpg" 
                alt="Logo" 
                className="h-8 md:h-10 rounded-full border border-white/20"
                referrerPolicy="no-referrer"
              />
              <span className="hidden lg:block font-museo font-black text-white italic text-xl tracking-tighter">JELLYBEAN</span>
            </motion.div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-6 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            {[
              { name: 'Home', id: 'home', icon: <Globe size={14} /> },
              { name: 'About', id: 'about', icon: <Info size={14} /> },
              { name: 'Game', id: 'game', icon: <Gamepad2 size={14} /> },
              { name: 'Buy', id: 'buy', icon: <ShoppingCart size={14} /> },
              { name: 'Roadmap', id: 'roadmap', icon: <LayoutDashboard size={14} /> }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-[10px] lg:text-xs font-black text-white/70 hover:text-pink-400 uppercase tracking-widest px-2 py-1 transition-all whitespace-nowrap"
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 gap-2 group cursor-pointer hover:bg-white/10 transition-all mr-2" onClick={copyToClipboard}>
              <span className="text-[8px] md:text-[10px] text-white/50 font-black uppercase tracking-widest">CA:</span>
              <code className="text-[10px] text-white/90 font-mono font-bold truncate max-w-[120px]">
                {CONTRACT_ADDRESS}
              </code>
              <div className="text-yellow-400">
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </div>
            </div>
            <motion.a 
              href="https://dexscreener.com/solana/2jbxebefzmnzgmp8frhsujjqqzudlhjzwbjvh7vbw7df"
              target="_blank"
              className="bg-pink-500 hover:bg-pink-400 text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.3)]"
              whileTap={{ scale: 0.95 }}
            >
              Buy Now
            </motion.a>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-pink-400 transition-colors"
            >
              {isMenuOpen ? <LucideX size={24} /> : (
                <div className="space-y-1.5 flex flex-col items-end">
                  <div className="w-6 h-0.5 bg-current" />
                  <div className="w-4 h-0.5 bg-current" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-2xl border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {[
                  { name: 'Home', id: 'home' },
                  { name: 'About', id: 'about' },
                  { name: 'Game', id: 'game' },
                  { name: 'Buy', id: 'buy' },
                  { name: 'Roadmap', id: 'roadmap' }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-lg font-black text-white hover:text-pink-400 uppercase tracking-[0.2em] py-4 border-b border-white/5 flex items-center justify-between group"
                  >
                    {link.name}
                    <ChevronDown size={20} className="-rotate-90 text-white/20 group-hover:text-pink-500" />
                  </button>
                ))}
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-white/90 font-black uppercase tracking-widest ml-2">Contract Address</label>
                    <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10" onClick={copyToClipboard}>
                      <code className="text-[10px] text-white font-mono truncate mr-4">{CONTRACT_ADDRESS}</code>
                      <div className="text-yellow-400">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-white/90 font-black uppercase tracking-widest ml-2">Support the Zoo (USDC)</label>
                    <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10" onClick={copyDonationToClipboard}>
                      <code className="text-[10px] text-white font-mono truncate mr-4">{DONATION_WALLET}</code>
                      <div className="text-yellow-400">
                        {donationCopied ? <Check size={16} /> : <Copy size={16} />}
                      </div>
                    </div>
                  </div>
                  <a 
                    href="https://dexscreener.com/solana/2jbxebefzmnzgmp8frhsujjqqzudlhjzwbjvh7vbw7df"
                    target="_blank"
                    className="bg-yellow-400 text-black text-center font-black py-4 rounded-2xl uppercase tracking-widest"
                  >
                    Buy $JELLYBEAN
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core floating beans */}
        <img src="https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png" className="absolute top-[10%] left-[5%] w-12 md:w-24 floating opacity-40" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/yellow-jellybean-black-outline.png" className="absolute top-[30%] right-[10%] w-16 md:w-32 floating opacity-40 [animation-delay:1s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/purple-jellybean-black-outline.png" className="absolute bottom-[20%] left-[15%] w-10 md:w-20 floating opacity-40 [animation-delay:2s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/green-jellybean-black-outline.png" className="absolute top-[60%] right-[5%] w-14 md:w-28 floating opacity-40 [animation-delay:0.5s]" alt="" />
        
        {/* Extra scattered beans */}
        <img src="https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png" className="absolute top-[5%] right-[25%] w-8 md:w-16 floating opacity-20 [animation-delay:1.5s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/yellow-jellybean-black-outline.png" className="absolute top-[85%] left-[20%] w-12 md:w-24 floating opacity-30 [animation-delay:2.5s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/purple-jellybean-black-outline.png" className="absolute top-[50%] left-[60%] w-10 md:w-20 floating opacity-20 [animation-delay:4s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/green-jellybean-black-outline.png" className="absolute top-[15%] left-[30%] w-6 md:w-12 floating opacity-30 [animation-delay:1.2s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png" className="absolute top-[75%] right-[40%] w-8 md:w-14 floating opacity-25 [animation-delay:3.2s]" alt="" />
        <img src="https://content.mycutegraphics.com/graphics/jellybean/yellow-jellybean-black-outline.png" className="absolute bottom-[5%] right-[15%] w-14 md:w-22 floating opacity-20 [animation-delay:0.8s]" alt="" />
      </div>

      {/* 1. HEADER / HERO SECTION */}
      <section id="home" className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-4 z-10 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">Born in America • Raised on Solana</span>
            </div>

            <h1 className="font-museo text-5xl sm:text-7xl md:text-8xl xl:text-9xl text-white font-black leading-[0.9] uppercase italic tracking-tighter">
              The <span className="text-pink-500">Next Viral</span> <br /> Baby Hippo
            </h1>

            <p className="text-lg md:text-2xl text-white font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-lg">
              Meet $JELLYBEAN, the cutest hippo on the blockchain. Not just a token, but a stampede of joy taking over the timelines.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <motion.a 
                href="https://dexscreener.com/solana/2jbxebefzmnzgmp8frhsujjqqzudlhjzwbjvh7vbw7df"
                target="_blank"
                className="w-full sm:w-auto px-10 py-5 bg-pink-500 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(236,72,153,0.3)] border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={24} />
                Buy $JELLYBEAN
              </motion.a>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-xl uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
              <motion.a whileHover={{ y: -5 }} href="https://x.com/i/communities/2026237091508543653" target="_blank" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:text-blue-400 transition-all">
                <LucideX size={24} />
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href="https://www.instagram.com/wildlifeworldzoo/" target="_blank" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:text-pink-400 transition-all">
                <Instagram size={24} />
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href="https://www.tiktok.com/@wildlifeworldzoo" target="_blank" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:text-white transition-all">
                <Globe size={24} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-pink-500/20 blur-[120px] rounded-full animate-pulse" />
            <motion.img 
              style={{ y: springHippoY }}
              src="https://pbs.twimg.com/profile_images/2044414764231868416/oVL2TxK1_400x400.jpg" 
              alt="Jellybean Character" 
              className="w-full max-w-[500px] xl:max-w-[700px] drop-shadow-[0_0_80px_rgba(255,100,255,0.4)] relative z-10 rounded-[4rem] border-8 border-white/10"
              whileHover={{ scale: 1.05, rotate: 2 }}
              referrerPolicy="no-referrer"
            />
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-yellow-400 text-black px-6 py-4 rounded-3xl font-black italic shadow-2xl border-4 border-white rotate-12 z-20"
            >
              CUTE VIBES ONLY!
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bento Section */}
      <section className="w-full py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col gap-4 text-center lg:text-left shadow-2xl"
          >
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 shadow-lg shadow-pink-500/20">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <div>
              <h4 className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Status</h4>
              <p className="text-2xl text-white font-black uppercase italic">Solana Verified</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col gap-4 text-center lg:text-left shadow-2xl"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 shadow-lg shadow-purple-500/20">
              <Wallet className="text-white" size={24} />
            </div>
            <div>
              <h4 className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Support</h4>
              <p className="text-2xl text-white font-black uppercase italic">Zoo Funded</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 p-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-[2.5rem] border border-white/20 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-white/70 text-sm font-black uppercase tracking-widest mb-2">Join the Community</h4>
              <p className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4">Timelines are ours</p>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <a href="https://x.com/i/communities/2026237091508543653" target="_blank" className="bg-white text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-pink-100 transition-colors">Join X</a>
                <a href="https://www.instagram.com/wildlifeworldzoo/" target="_blank" className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-colors">Follow IG</a>
              </div>
            </div>
            <img 
              src="https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png" 
              className="w-24 h-24 hidden md:block animate-bounce drop-shadow-glow" 
              alt="" 
            />
          </motion.div>
        </div>
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
              <img src="https://content.mycutegraphics.com/graphics/jellybean/yellow-jellybean-black-outline.png" className="w-16 h-16 drop-shadow-md flex-shrink-0" alt="" />
              <span className="font-museo text-2xl md:text-5xl text-yellow-300 font-black uppercase italic tracking-tighter px-12">
                BORN IN AMERICA
              </span>
              <img src="https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png" className="w-16 h-16 drop-shadow-md flex-shrink-0" alt="" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Meme Section (Replaced Generator & Wall with Content Cards) */}
      <section id="memes" className="w-full py-16 md:py-32 px-4 relative scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="text-center md:text-left">
              <h2 className="font-museo text-5xl sm:text-7xl md:text-8xl text-white font-black uppercase italic tracking-tighter mb-4 text-shadow-bubbly">Meme Lab</h2>
              <p className="text-xl text-yellow-300 font-black uppercase tracking-widest drop-shadow-md">The herd is creating art...</p>
            </div>
            <motion.a 
              href="https://x.com/i/communities/2026237091508543653"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl flex items-center gap-3"
            >
              <span className="font-sans font-black text-2xl italic">X</span>
              Join the Stampede
            </motion.a>
          </div>

          <div className="relative w-full overflow-hidden py-10 bg-black/40 backdrop-blur-md rounded-[3rem] border border-white/10 group">
            <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
              {[...MEME_IMAGES, ...MEME_IMAGES].map((src, i) => (
                <div key={i} className="inline-block px-2 md:px-4">
                  <div className="w-40 md:w-64 h-40 md:h-64 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 md:border-4 border-white/10 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-pink-500/50">
                    <img 
                      src={src} 
                      className="w-full h-full object-cover" 
                      alt={`Meme ${i}`} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Gradient Overlays for smooth edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/60 to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. MANIFESTO SECTION (Redesigned) */}
      <section id="about" className="w-full py-16 md:py-32 px-4 flex flex-col items-center z-10 relative bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h2 className="font-museo text-5xl sm:text-7xl md:text-8xl text-white font-black uppercase tracking-tighter leading-none italic">
              EVOLUTION <br /><span className="text-yellow-400">IS INEVITABLE</span>
            </h2>
            <div className="space-y-6 text-lg md:text-2xl font-bold text-white leading-relaxed">
              <p>Because the world doesn't need another serious coin. It needs a baby hippo.</p>
              <p className="text-pink-400 drop-shadow-md">Born in America. Raised on the Blockchain.</p>
              <p>Cute enough to go viral. Strong enough to stampede. $JELLYBEAN isn't here to explain itself.</p>
              <p className="text-3xl md:text-5xl text-yellow-400 font-black uppercase italic tracking-tighter drop-shadow-lg">It's here to take over timelines.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-8">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-white text-3xl font-black italic">100%</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Herd Driven</p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-white text-3xl font-black italic">SOL</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Network</p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-white text-3xl font-black italic">ZOO</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Supported</p>
              </div>
            </div>
          </div>

          <motion.div 
            className="flex-1 relative"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-pink-500/30 blur-[100px] rounded-full" />
            <img 
              src={MEME_IMAGES[0]} 
              className="w-full h-auto rounded-[3rem] border-8 border-white/10 shadow-2xl relative z-10" 
              alt="Jellybean Evolution" 
            />
          </motion.div>
        </div>
      </section>

      {/* Mini Game Section */}
      <section id="game" className="w-full py-20 z-10 relative scroll-mt-20">
        <JellybeanGame />
      </section>

      {/* 4. HOW TO BUY SECTION */}
      <section id="buy" className="w-full py-16 md:py-32 px-4 flex flex-col items-center z-10 scroll-mt-20">
        <motion.h2 
          className="font-museo text-4xl sm:text-6xl md:text-9xl text-white mb-12 md:mb-20 text-center drop-shadow-2xl font-black italic"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          How To Buy
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mb-16 md:mb-24">
          {[
            { step: 1, title: "Get a Wallet", icon: <Wallet size={48} />, color: "bg-purple-400", desc: "Download Phantom or Solflare" },
            { step: 2, title: "Get Some SOL", icon: <ShoppingCart size={48} />, color: "bg-pink-400", desc: "Buy SOL on an exchange" },
            { step: 3, title: "Swap For $JELLYBEAN", icon: <Repeat size={48} />, color: "bg-yellow-400", desc: "Swap SOL on pump.fun" },
            { step: 4, title: "Welcome to the Herd", icon: <CheckCircle2 size={48} />, color: "bg-blue-400", desc: "You are now a hippo!" }
          ].map((item, i) => (
            <motion.div 
              key={item.step} 
              className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col items-center text-center shadow-2xl relative group border border-white/20"
              whileHover={{ y: -15, scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
            >
              <div className={`absolute -top-4 -left-4 md:-top-6 md:-left-6 w-12 h-12 md:w-16 md:h-16 ${item.color} text-white rounded-full flex items-center justify-center font-museo text-2xl md:text-3xl shadow-xl border-4 border-white z-20`}>
                {item.step}
              </div>
              <div className="text-white/90 mb-6 md:mb-8 group-hover:text-yellow-400 transition-colors duration-300 scale-110 md:scale-125 relative z-10">
                {item.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 leading-tight relative z-10">{item.title}</h3>
              <p className="text-sm md:text-base text-white font-bold mb-6 relative z-10">{item.desc}</p>
              <img src="https://content.mycutegraphics.com/graphics/jellybean/pink-jellybean-black-outline.png" className="w-16 md:w-20 mt-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500 relative z-10" alt="" />
              
              {/* Hover Glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity rounded-[2.5rem] md:rounded-[3rem] blur-2xl ${item.color}`} />
            </motion.div>
          ))}
        </div>

        {/* Official Contract Box */}
        <motion.div 
          className="w-full max-w-5xl bg-purple-600/90 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-2 md:border-4 border-white/20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">Official Contract</h3>
          <p className="text-pink-200 font-black text-sm md:text-xl mb-6 md:mb-10 flex items-center gap-3 uppercase tracking-widest">
            <CheckCircle2 size={20} className="text-green-400" /> Solana Verified & Audited
          </p>
          
          <div 
            onClick={copyToClipboard}
            className="w-full bg-black/30 border-2 border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 flex items-center justify-between cursor-pointer hover:bg-black/40 transition-all group overflow-hidden shadow-inner"
          >
            <code className="font-mono text-[10px] sm:text-sm md:text-2xl text-white/90 break-all text-left font-bold">
              {CONTRACT_ADDRESS}
            </code>
            <div className="flex-shrink-0 ml-4 md:ml-6 bg-yellow-400 text-black p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg group-hover:scale-110 transition-transform group-active:scale-95">
              {copied ? <Check size={20} className="md:w-8 md:h-8" /> : <Copy size={20} className="md:w-8 md:h-8" />}
            </div>
          </div>
          {copied && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 md:mt-6 text-green-400 font-black text-base md:text-xl uppercase tracking-widest"
            >
              Copied to clipboard!
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* 5. ROADMAP SECTION (THE STAMPEDE) */}
      <section id="roadmap" className="w-full py-16 md:py-32 px-4 flex flex-col items-center z-10 relative scroll-mt-20">
        <motion.div 
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-museo text-5xl sm:text-7xl md:text-9xl text-white font-black uppercase tracking-tighter mb-2 drop-shadow-2xl italic">
            THE STAMPEDE
          </h2>
          <p className="font-museo text-xl sm:text-2xl md:text-4xl text-yellow-300 uppercase font-black tracking-widest drop-shadow-glow">OUR PATH TO GLORY</p>
        </motion.div>

        <div className="w-full max-w-5xl space-y-8 md:space-y-12 relative">
          {/* Connecting Line */}
          <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-yellow-400 opacity-40 hidden md:block" />

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
              className={`bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col md:flex-row items-center gap-6 md:gap-8 group hover:bg-white/20 transition-all relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className={`w-16 h-16 md:w-24 md:h-24 ${item.color} rounded-full flex items-center justify-center font-museo text-2xl md:text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform relative z-10 border-4 border-white`}>
                {i + 1}
              </div>
              <div className={`flex-1 text-center ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <h3 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 italic uppercase tracking-tighter drop-shadow-md">{item.phase}</h3>
                <div className={`flex flex-wrap justify-center ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} gap-2 md:gap-3`}>
                  {item.items.map((li, j) => (
                    <span key={j} className="px-4 md:px-6 py-2 md:py-3 bg-black/60 rounded-full text-white font-black text-[10px] md:text-sm uppercase tracking-widest border border-white/20 hover:bg-black/80 transition-colors shadow-lg">
                      {li}
                    </span>
                  ))}
                </div>
              </div>
              <img src="https://content.mycutegraphics.com/graphics/jellybean/purple-jellybean-black-outline.png" className={`w-24 md:w-32 opacity-40 group-hover:opacity-100 transition-opacity hidden md:block ${i % 2 === 0 ? 'rotate-12' : '-rotate-12'}`} alt="" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="w-full py-16 md:py-32 px-4 flex flex-col items-center text-center z-10 bg-black/40 border-t border-white/10">
        <motion.div 
          className="flex flex-col items-center mb-16"
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src="https://pbs.twimg.com/profile_images/2044414764231868416/oVL2TxK1_400x400.jpg" 
            alt="Jellybean Logo" 
            className="w-32 md:w-48 mb-6 drop-shadow-glow rounded-full border-4 border-white/10"
            referrerPolicy="no-referrer"
          />
          <h2 className="font-museo text-4xl md:text-6xl text-white font-black italic uppercase tracking-tighter">$JELLYBEAN</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-16">
          <motion.a 
            href="https://x.com/i/communities/2026237091508543653" 
            target="_blank"
            className="flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-black text-white uppercase tracking-widest text-sm"
          >
            <span className="font-sans font-black text-xl italic">X</span> Community
          </motion.a>
          <motion.a 
            href="https://www.tiktok.com/@wildlifeworldzoo" 
            target="_blank"
            className="flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-black text-white uppercase tracking-widest text-sm"
          >
            <Globe className="text-white" /> TikTok Official
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/wildlifeworldzoo/" 
            target="_blank"
            className="flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-black text-white uppercase tracking-widest text-sm"
          >
            <Instagram className="text-pink-500" /> Instagram Zoo
          </motion.a>
          <motion.a 
            href="https://dexscreener.com/solana/2jbxebefzmnzgmp8frhsujjqqzudlhjzwbjvh7vbw7df" 
            target="_blank"
            className="flex items-center justify-center gap-3 p-5 bg-yellow-400 text-black rounded-2xl hover:bg-yellow-300 transition-all font-black uppercase tracking-widest text-sm"
          >
            <LayoutDashboard /> Dexscreener
          </motion.a>
        </div>

        <motion.div 
          className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] max-w-3xl w-full mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-yellow-300 justify-center mb-4">
            <Wallet size={20} />
            <h3 className="font-museo text-lg font-black uppercase tracking-widest italic">Support the Zoo (USDC)</h3>
          </div>
          <div 
            onClick={copyDonationToClipboard}
            className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-black/60 transition-all"
          >
            <code className="text-[10px] md:text-sm text-white/70 font-mono truncate mr-4">{DONATION_WALLET}</code>
            <div className="text-yellow-400">
              {donationCopied ? <Check size={18} /> : <Copy size={18} />}
            </div>
          </div>
        </motion.div>

        <p className="text-white/60 mb-8 font-bold uppercase tracking-[0.4em] text-[10px]">©2026 Jellybean World • Built for the herd</p>
        
        <div className="max-w-4xl p-8 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
          <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-[0.2em] leading-relaxed font-bold">
            Disclaimer: $JELLYBEAN is a memecoin with no intrinsic value or expectation of financial return. It's for entertainment and community purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
