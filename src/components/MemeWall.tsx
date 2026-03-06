import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, X, Loader2, Heart, MessageCircle, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Meme {
  id: string;
  url: string;
  caption: string;
  author: string;
  created_at: string;
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

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemes(data || []);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
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
            author: author || 'Anonymous' 
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
    <section className="w-full py-32 px-4 flex flex-col items-center z-10 relative bg-black/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        className="text-center mb-16 relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-museo text-6xl md:text-8xl text-white font-black uppercase tracking-tighter mb-4 drop-shadow-glow italic">
          COMMUNITY WALL
        </h2>
        <p className="font-museo text-xl md:text-3xl text-yellow-300 uppercase font-black tracking-widest">SHOW US YOUR JELLYBEANS</p>
        
        <motion.button
          onClick={() => setShowUploadModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-12 py-5 bg-pink-500 text-white rounded-full font-black text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(236,72,153,0.5)] border-4 border-white flex items-center gap-4 group"
        >
          <Upload className="group-hover:animate-bounce" />
          Upload Meme
        </motion.button>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
          <p className="text-white/60 font-bold uppercase tracking-widest">Loading the stampede...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
          <AnimatePresence mode="popLayout">
            {memes.map((meme, i) => (
              <motion.div
                key={meme.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:bg-white/10 transition-all shadow-2xl"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={meme.url} 
                    alt={meme.caption} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex gap-4">
                        <Heart className="w-6 h-6 hover:text-pink-500 cursor-pointer transition-colors" />
                        <MessageCircle className="w-6 h-6 hover:text-blue-500 cursor-pointer transition-colors" />
                        <Share2 className="w-6 h-6 hover:text-green-500 cursor-pointer transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {meme.caption && (
                    <p className="text-white font-bold text-lg mb-2 line-clamp-2 italic">"{meme.caption}"</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-black text-sm uppercase tracking-widest">@{meme.author}</span>
                    <span className="text-white/30 text-xs font-bold">{new Date(meme.created_at).toLocaleDateString()}</span>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border-4 border-pink-500 rounded-[3rem] w-full max-w-2xl p-8 md:p-12 relative z-10 shadow-[0_0_100px_rgba(236,72,153,0.3)]"
            >
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>

              <h3 className="font-museo text-4xl text-white font-black mb-8 italic uppercase tracking-tighter">Upload Your Meme</h3>

              <div className="space-y-8">
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
                    className={`w-full aspect-video rounded-3xl border-4 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 transition-all overflow-hidden relative group ${previewUrl ? 'border-solid' : ''}`}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-black uppercase tracking-widest">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-16 h-16 text-white/20 mb-4" />
                        <p className="text-white/40 font-bold uppercase tracking-widest">Click to select image</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/60 font-black text-xs uppercase tracking-widest ml-4">Your Name</label>
                    <input 
                      type="text"
                      placeholder="Anonymous"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/60 font-black text-xs uppercase tracking-widest ml-4">Caption</label>
                    <input 
                      type="text"
                      placeholder="Funny caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || isUploading}
                  className="w-full py-6 bg-pink-500 text-white rounded-2xl font-black text-2xl uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" />
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
