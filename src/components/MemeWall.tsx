import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, X, Loader2, Heart, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Meme {
  id: string;
  url: string;
  caption: string;
  author: string;
  created_at: string;
  likes: number;
}

export default function MemeWall() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const [visitorId] = useState(() => {
    let id = localStorage.getItem('jellybean_visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('jellybean_visitor_id', id);
    }
    return id;
  });

  // Fetch liked memes from Supabase
  const fetchUserLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('meme_likes')
        .select('meme_id')
        .eq('visitor_id', visitorId);

      if (error) {
        // If table doesn't exist yet, we'll just use empty array
        if (error.code === 'PGRST116' || error.message.includes('relation "meme_likes" does not exist')) {
          console.warn('meme_likes table not found. Please create it in Supabase.');
          return;
        }
        throw error;
      }
      
      if (data) {
        setLikedMemes(data.map(item => item.meme_id));
      }
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  useEffect(() => {
    fetchUserLikes();
  }, [visitorId]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showUploadModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUploadModal]);

  useEffect(() => {
    fetchMemes();
  }, [sortBy]);

  const fetchMemes = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('memes').select('*');
      
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('likes', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setMemes(data || []);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (memeId: string, currentLikes: number) => {
    const isAlreadyLiked = likedMemes.includes(memeId);
    const newLikes = isAlreadyLiked ? Math.max(0, (currentLikes || 0) - 1) : (currentLikes || 0) + 1;

    // Optimistic UI update - do this immediately for better UX
    setLikedMemes(prev => isAlreadyLiked ? prev.filter(id => id !== memeId) : [...prev, memeId]);
    setMemes(prev => prev.map(m => m.id === memeId ? { ...m, likes: newLikes } : m));

    try {
      // 1. Update the likes count in the memes table
      const { error: updateError } = await supabase
        .from('memes')
        .update({ likes: newLikes })
        .eq('id', memeId);

      if (updateError) throw updateError;

      // 2. Update the meme_likes table to persist the user's choice
      if (isAlreadyLiked) {
        const { error: deleteError } = await supabase
          .from('meme_likes')
          .delete()
          .eq('meme_id', memeId)
          .eq('visitor_id', visitorId);
        
        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from('meme_likes')
          .insert([{ meme_id: memeId, visitor_id: visitorId }]);
        
        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error('Error liking meme:', error);
      
      // Revert optimistic update on error
      setLikedMemes(prev => isAlreadyLiked ? [...prev, memeId] : prev.filter(id => id !== memeId));
      setMemes(prev => prev.map(m => m.id === memeId ? { ...m, likes: currentLikes } : m));

      if (error.message?.includes('relation "meme_likes" does not exist')) {
        alert('Database setup incomplete! Please run the SQL script provided to create the "meme_likes" table.');
      } else if (error.message?.includes('new row violates row-level security policy')) {
        alert('Database permission error! Please ensure RLS policies are correctly set for anonymous users.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);

    try {
      // 1. Upload image to storage
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memes')
        .getPublicUrl(filePath);

      // 3. Save to database
      const { error: dbError } = await supabase
        .from('memes')
        .insert([
          { 
            url: publicUrl, 
            caption, 
            author: author || 'Anonymous',
            likes: 0
          }
        ]);

      if (dbError) throw dbError;

      // 4. Reset state and refresh
      setShowUploadModal(false);
      setUploadFile(null);
      setPreviewUrl(null);
      setCaption('');
      setAuthor('');
      fetchMemes();
    } catch (error) {
      console.error('Error uploading meme:', error);
      alert('Failed to upload meme. Please make sure your Supabase is configured correctly.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-32 px-4 flex flex-col items-center z-10 relative bg-black/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        className="text-center mb-12 md:mb-16 relative w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-museo text-4xl sm:text-6xl md:text-8xl text-white font-black uppercase tracking-tighter mb-4 drop-shadow-glow italic px-2">
          COMMUNITY WALL
        </h2>
        <p className="font-museo text-lg md:text-3xl text-yellow-300 uppercase font-black tracking-widest mb-8 md:mb-12">SHOW US YOUR JELLYBEANS</p>
        
        <div className="flex flex-col items-center justify-center gap-6 px-4">
          <motion.button
            onClick={() => setShowUploadModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-pink-500 text-white rounded-full font-black text-lg md:text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(236,72,153,0.5)] border-4 border-white flex items-center justify-center gap-4 group"
          >
            <Upload className="group-hover:animate-bounce" />
            Upload Meme
          </motion.button>

          <div className="flex bg-white/5 backdrop-blur-md p-1.5 md:p-2 rounded-full border border-white/10 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSortBy('newest')}
              className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${sortBy === 'newest' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              <Clock size={14} className="md:w-4 md:h-4" />
              Newest
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${sortBy === 'likes' ? 'bg-yellow-400 text-black' : 'text-white/70 hover:text-white'}`}
            >
              <TrendingUp size={14} className="md:w-4 md:h-4" />
              Most Liked
            </button>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-pink-500 animate-spin mb-4" />
          <p className="text-white/90 font-bold uppercase tracking-widest text-sm md:text-base">Loading the stampede...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 w-full max-w-7xl">
          <AnimatePresence mode="popLayout">
            {memes.map((meme, i) => (
              <motion.div
                key={meme.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group hover:bg-white/10 transition-all shadow-2xl"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={meme.url} 
                    alt={meme.caption} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Mobile-friendly like button overlay - visible on touch or hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                    <div className="flex items-center justify-between text-white">
                      <motion.button 
                        whileTap={{ scale: 1.5 }}
                        onClick={() => handleLike(meme.id, meme.likes)}
                        className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-black text-xs md:text-sm shadow-lg transition-colors ${likedMemes.includes(meme.id) ? 'bg-pink-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                      >
                        <Heart className={`w-4 h-4 md:w-5 md:h-5 ${likedMemes.includes(meme.id) ? "fill-white" : ""}`} />
                        {meme.likes || 0}
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {meme.caption && (
                    <p className="text-white font-bold text-base md:text-lg mb-2 line-clamp-2 italic">"{meme.caption}"</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-black text-xs md:text-sm uppercase tracking-widest truncate max-w-[120px]">@{meme.author}</span>
                    <div className="flex items-center gap-1 text-white/60">
                      <Heart size={10} className={likedMemes.includes(meme.id) ? "text-pink-500 fill-pink-500" : ""} />
                      <span className="text-[10px] md:text-xs font-bold">{meme.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border-2 md:border-4 border-pink-500 rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl p-6 md:p-12 relative z-10 shadow-[0_0_100px_rgba(236,72,153,0.3)] my-auto"
            >
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white transition-colors p-2"
              >
                <X size={24} className="md:w-8 md:h-8" />
              </button>

              <h3 className="font-museo text-2xl md:text-4xl text-white font-black mb-6 md:mb-8 italic uppercase tracking-tighter">Upload Your Meme</h3>

              <div className="space-y-6 md:space-y-8">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="meme-upload"
                  />
                  <label 
                    htmlFor="meme-upload"
                    className={`w-full aspect-video rounded-2xl md:rounded-3xl border-2 md:border-4 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 transition-all overflow-hidden relative group ${previewUrl ? 'border-solid' : ''}`}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-black uppercase tracking-widest text-sm">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 md:w-16 md:h-16 text-white/20 mb-2 md:mb-4" />
                        <p className="text-white/70 font-bold uppercase tracking-widest text-xs md:text-sm">Click to select image</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-white/90 font-black text-[10px] md:text-xs uppercase tracking-widest ml-2 md:ml-4">Your Name</label>
                    <input 
                      type="text"
                      placeholder="Anonymous"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-white font-bold text-sm md:text-base focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-white/90 font-black text-[10px] md:text-xs uppercase tracking-widest ml-2 md:ml-4">Caption</label>
                    <input 
                      type="text"
                      placeholder="Funny caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-white font-bold text-sm md:text-base focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || isUploading}
                  className="w-full py-4 md:py-6 bg-pink-500 text-white rounded-xl md:rounded-2xl font-black text-xl md:text-2xl uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
                      Uploading...
                    </>
                  ) : (
                    'Post to Wall'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
