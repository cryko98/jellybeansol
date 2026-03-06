import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, Loader2, Image as ImageIcon, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const REFERENCE_IMAGE_URL = "https://lcaryepoaiuzuppladzq.supabase.co/storage/v1/object/public/jelly/jellybean-4VcIIo9lkb3iyhLx.webp";

const MemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<'cartoon' | 'realistic'>('cartoon');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data:image/webp;base64, prefix
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateMeme = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: (process as any).env.GEMINI_API_KEY });
      const base64Data = await getBase64FromUrl(REFERENCE_IMAGE_URL);
      
      const styleInstruction = style === 'cartoon' 
        ? "Maintain a vibrant, 3D animated cartoon style similar to the reference image. Keep the character's signature look: pink body, jellybean shape, and cute expression."
        : "Create a highly detailed, realistic version of the character. Imagine it as a real-life physical object with realistic textures and lighting, while keeping its iconic pink jellybean form.";

      const fullPrompt = `Based on the provided reference image of the Jellybean character, generate a new image where the character is: ${prompt}. ${styleInstruction}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/webp",
              },
            },
            {
              text: fullPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image was generated. Please try a different prompt.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `jellybean-meme-${Date.now()}.png`;
    link.click();
  };

  return (
    <section id="meme-generator" className="py-24 px-4 relative overflow-hidden bg-black/40">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-4 italic uppercase tracking-tighter"
          >
            Jellybean <span className="text-pink-500">Meme</span> Lab
          </motion.h2>
          <p className="text-xl text-white/60 font-medium">Create your own Jellybean adventures with AI!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
                  What's Jellybean doing?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. eating a giant watermelon, surfing on a pink cloud, playing video games..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
                  Select Style
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStyle('cartoon')}
                    className={`py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      style === 'cartoon' 
                        ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <ImageIcon size={18} />
                    Cartoon
                  </button>
                  <button
                    onClick={() => setStyle('realistic')}
                    className={`py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      style === 'realistic' 
                        ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <Sparkles size={18} />
                    Realistic
                  </button>
                </div>
              </div>

              <button
                onClick={generateMeme}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 />
                    Generate Meme
                  </>
                )}
              </button>

              {error && (
                <p className="text-red-400 text-sm font-medium text-center bg-red-400/10 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 group"
          >
            <AnimatePresence mode="wait">
              {generatedImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={generatedImage} 
                    alt="Generated Jellybean Meme" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={downloadImage}
                      className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl"
                      title="Download Meme"
                    >
                      <Download size={24} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center text-white/20 p-12 text-center"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ImageIcon size={48} />
                  </div>
                  <p className="text-lg font-bold uppercase tracking-widest">Your masterpiece will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-center items-center justify-center z-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
                  <p className="text-white font-bold animate-pulse">Mixing the jellybeans...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MemeGenerator;
