"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { 
  Download, Image as ImageIcon, Heart, Copy, RefreshCw, Wand2, Search, Maximize2, PenTool 
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const signatureStyles = [
  { id: 1, family: "'Caveat', cursive", label: "Casual Marker" },
  { id: 2, family: "'Dancing Script', cursive", label: "Elegant Cursive" },
  { id: 3, family: "'Pacifico', cursive", label: "Retro Brush" },
  { id: 4, family: "'Satisfy', cursive", label: "Smooth Flow" },
  { id: 5, family: "'Sacramento', cursive", label: "Monoline Script" },
  { id: 6, family: "'Great Vibes', cursive", label: "Formal Calligraphy" },
  { id: 7, family: "'Allura', cursive", label: "Delicate Pen" },
  { id: 8, family: "'Parisienne', cursive", label: "French Vintage" },
  { id: 9, family: "'Yellowtail', cursive", label: "Bold Marker" },
  { id: 10, family: "'Alex Brush', cursive", label: "Classic Brush" },
];

export default function SignatureDashboard() {
  const [name, setName] = useState("Alex Designer");
  const [color, setColor] = useState("#0f172a");
  const [isGenerating, setIsGenerating] = useState(false);
  interface SignatureAnalysis {
    id: number;
    description: string;
    professionalismScore: number;
    uniquenessScore: number;
    recommendation: string;
  }

  const [generatedSigs, setGeneratedSigs] = useState<{name: string, color: string, analysis: SignatureAnalysis[]} | null>(null);
  
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Refs for cards to download
  const cardRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedSigs(null);
    try {
      const response = await fetch('/api/gemini/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          fonts: signatureStyles.map(s => ({ id: s.id, fontName: s.family, label: s.label })) 
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate styles');
      }

      const data = await response.json();
      setGeneratedSigs({ name, color, analysis: data.results });
      toast.success("Generated 10 unique signature styles!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate styles with AI. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (id: number) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  const downloadImage = async (id: number, format: 'png' | 'svg') => {
    const node = cardRefs.current[id];
    if (!node) return;
    
    try {
      toast.info(`Generating ${format.toUpperCase()}...`);
      let dataUrl = '';
      
      const options = {
        backgroundColor: 'rgba(0,0,0,0)',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      };

      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(node, { ...options, pixelRatio: 3 });
      } else {
        dataUrl = await htmlToImage.toSvg(node, options);
      }

      const link = document.createElement('a');
      link.download = `signature-${id}.${format}`;
      link.href = dataUrl;
      link.click();
      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image.");
    }
  };

  const copyToClipboard = async (id: number) => {
    const node = cardRefs.current[id];
    if (!node) return;
    try {
      const dataUrl = await htmlToImage.toBlob(node);
      if (dataUrl) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': dataUrl })
        ]);
        toast.success("Signature image copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Clipboard copy failed. Try downloading instead.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="mb-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">
            AI Signature Generator
          </h1>
          <p className="text-slate-500">Create beautiful handwritten digital signatures instantly.</p>
        </div>

        <Card className="p-2 border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5 items-center inline-flex w-full md:w-auto">
          <div className="flex flex-col md:flex-row gap-3 w-full p-2">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PenTool className="h-4 w-4 text-slate-400" />
              </div>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="pl-10 h-11 border-none shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 bg-slate-50"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md">
                <Label htmlFor="color-picker" className="sr-only">Color</Label>
                <input 
                  id="color-picker"
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto"
              >
                {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Signatures
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid of Results */}
      {isGenerating ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-slate-200 shadow-sm flex flex-col h-[280px]">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex items-center justify-center h-40 p-8 border-b border-slate-100">
                  <Skeleton className="h-8 w-3/4 rounded-full" />
                </div>
                <div className="p-4 flex-1 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 p-4 border-t flex justify-between h-14">
                <Skeleton className="h-6 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : generatedSigs ? (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {signatureStyles.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group bg-white">
                  
                  <CardContent className="p-0 relative flex flex-col h-full">
                    <div className="absolute inset-x-0 top-0 bottom-auto h-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                    
                    <button 
                      onClick={() => setPreviewId(style.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-md bg-white/80 backdrop-blur w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <div 
                      ref={(el) => { cardRefs.current[style.id] = el; }}
                      className="flex items-center justify-center h-40 p-6 lg:p-8 overflow-hidden bg-transparent w-full relative z-0"
                    >
                      <span 
                        style={{ 
                          fontFamily: style.family, 
                          color: generatedSigs.color,
                          fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                          lineHeight: 1.2
                        }}
                        className="whitespace-nowrap inline-block transform origin-center transition-transform hover:scale-105"
                      >
                        {generatedSigs.name}
                      </span>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-white flex-1 space-y-3">
                      {(() => {
                        const analysis = generatedSigs.analysis?.find((a) => a.id === style.id);
                        if (!analysis) return <div className="animate-pulse h-20 bg-slate-100 rounded-md"></div>;
                        return (
                          <>
                            <p className="text-sm text-slate-600 line-clamp-2" title={analysis.description}>
                              {analysis.description}
                            </p>
                            <div className="flex gap-4 text-xs font-medium text-slate-500">
                               <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  Prof: {analysis.professionalismScore}
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                                  Unique: {analysis.uniquenessScore}
                               </div>
                            </div>
                            <p className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-700">Best for:</span> {analysis.recommendation}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>

                  {/* Actions Area */}
                  <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                        {style.label}
                      </span>
                    </div>

                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${favorites.has(style.id) ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'}`}
                        onClick={() => toggleFavorite(style.id)}
                        title="Favorite"
                      >
                        <Heart className="w-4 h-4" fill={favorites.has(style.id) ? "currentColor" : "none"} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        onClick={() => copyToClipboard(style.id)}
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex rounded-md shadow-sm ml-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2.5 rounded-r-none border-r-0 text-xs text-slate-500 hover:text-indigo-600 bg-white"
                          onClick={() => downloadImage(style.id, 'png')}
                          title="Download PNG"
                        >
                          <ImageIcon className="w-3.5 h-3.5 mr-1" />
                          PNG
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2.5 rounded-l-none text-xs text-slate-500 hover:text-indigo-600 bg-white"
                          onClick={() => downloadImage(style.id, 'svg')}
                          title="Download SVG"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          SVG
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-slate-400"
        >
          <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 rounded-full bg-indigo-50 animate-ping opacity-20" />
             <Search className="w-10 h-10 text-indigo-300" />
          </div>
          <p className="text-xl font-medium text-slate-700">No signatures generated yet</p>
          <p className="text-base text-slate-500 mt-2">Enter your name above to see the magic happen.</p>
        </motion.div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewId} onOpenChange={(open) => !open && setPreviewId(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-slate-50 border-white/20">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle className="text-lg font-medium text-slate-700">Signature Preview</DialogTitle>
          </DialogHeader>
          
          {previewId && generatedSigs && (
            <div className="p-12 md:p-24 flex items-center justify-center min-h-[300px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
               <span 
                  style={{ 
                    fontFamily: signatureStyles.find(s => s.id === previewId)?.family, 
                    color: generatedSigs.color,
                    fontSize: '5rem',
                    lineHeight: 1.2
                  }}
                  className="whitespace-nowrap inline-block drop-shadow-sm"
                >
                  {generatedSigs.name}
                </span>
            </div>
          )}
          
          <div className="p-4 border-t bg-white flex justify-end gap-3">
             <Button variant="outline" onClick={() => setPreviewId(null)}>Close</Button>
             <Button 
                onClick={() => previewId && downloadImage(previewId, 'png')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download High-Res
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
