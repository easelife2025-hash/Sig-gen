"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Maximize2, FastForward, Minimize2, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SIGNATURES = [
  {
    id: 1, 
    name: "Classic Script", 
    author: "Alexander Doe",
    path: "M43 85 C 43 55, 62 43, 76 43 C 94 43, 98 62, 98 75 C 98 109, 61 113, 61 113 C 61 113, 109 105, 126 89 C 143 73, 150 63, 150 54 C 150 49, 143 51, 143 60 C 143 77, 169 77, 169 77 L 175 60 C 175 60, 172 76, 187 76 C 196 76, 200 66, 201 64 L 202 75 C 202 75, 219 75, 230 65 L 222 75 L 243 75 L 236 82 L 260 82",
    difficulty: "Medium"
  },
  {
    id: 2,
    name: "Executive Loop",
    author: "Sarah Jenkins",
    path: "M30 80 C 40 20, 100 20, 90 80 C 80 140, 40 140, 40 80 C 40 30, 140 40, 140 80 C 140 110, 110 110, 110 80 C 110 50, 170 50, 170 80 C 170 100, 200 100, 200 80",
    difficulty: "Hard"
  },
  {
    id: 3,
    name: "Minimalist Flow",
    author: "M. Cole",
    path: "M20 60 C 40 40, 60 20, 70 80 C 80 100, 100 40, 110 40 C 120 40, 130 60, 140 60 C 150 60, 160 30, 170 30 C 180 30, 190 70, 200 60",
    difficulty: "Easy"
  }
];

export default function LearnSignature() {
  const [activeSigId, setActiveSigId] = useState(SIGNATURES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [learningStep, setLearningStep] = useState(1);
  const [practiceProgress, setPracticeProgress] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSig = SIGNATURES.find(s => s.id === activeSigId)!;
  const controls = useAnimation();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      controls.stop();
    } else {
      controls.start("visible");
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      controls.start("visible");
    } else {
      controls.stop();
    }
  }, [animationKey, isPlaying, speed, controls]);

  // Handle auto-replay at end of animation to show how it should be used.
  const handleAnimationComplete = () => {
    setIsPlaying(false);
    if(practiceProgress < 100 && learningStep > 1) {
       setPracticeProgress(prev => Math.min(prev + 20, 100));
       if (practiceProgress + 20 >= 100) {
          toast.success("Practice complete! You've mastered this signature.");
       }
    }
  };

  const draw: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "tween", duration: 3 / speed, ease: "easeInOut" },
        opacity: { duration: 0.1 }
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
          Signature Masterclass
        </h1>
        <p className="text-slate-500">Learn to draw professional signatures with interactive step-by-step guidance.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Sidebar / Selection */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="text-base">Curated Styles</CardTitle>
              <CardDescription>Select a signature to start learning.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {SIGNATURES.map((sig) => (
                  <button
                    key={sig.id}
                    onClick={() => {
                      setActiveSigId(sig.id);
                      setAnimationKey(prev => prev + 1);
                      setIsPlaying(true);
                      setLearningStep(1);
                      setPracticeProgress(0);
                    }}
                    className={cn(
                      "text-left p-4 border-b last:border-0 hover:bg-slate-50 transition-colors flex items-center justify-between group",
                      activeSigId === sig.id && "bg-indigo-50/50 border-l-2 border-l-indigo-600 relative"
                    )}
                  >
                    <div>
                      <h4 className={cn("font-medium", activeSigId === sig.id ? "text-indigo-700" : "text-slate-700")}>
                        {sig.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">by {sig.author}</p>
                    </div>
                    <Badge variant={activeSigId === sig.id ? "default" : "secondary"} className={cn(
                      "opacity-80 group-hover:opacity-100",
                      activeSigId === sig.id ? "bg-indigo-600" : ""
                    )}>
                      {sig.difficulty}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Want a custom signature?</h3>
              <p className="text-indigo-100 text-sm mb-4">Generate your own personalized signature in the dashboard and add it to your learning queue.</p>
              <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm">
                Generate Custom Signature
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Interactive Canvas & Guide */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="learn" className="w-full">
            <TabsList className="grid w-[300px] grid-cols-2 bg-slate-100 p-1 mb-6">
              <TabsTrigger value="learn" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Watch & Learn</TabsTrigger>
              <TabsTrigger value="practice" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Practice Mode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="learn" className="space-y-6 mt-0">
              {/* Canvas Area */}
              <Card className="overflow-hidden border-slate-200">
                <div 
                  ref={containerRef}
                  className={cn(
                    "relative flex flex-col bg-white",
                    isFullscreen ? "fixed inset-0 z-50 h-screen w-screen p-8 justify-center items-center bg-slate-50" : "min-h-[400px]"
                  )}
                >
                  {/* Canvas Header / Controls Overlay */}
                  <div className={cn(
                      "flex items-center justify-between p-4 bg-slate-50/80 backdrop-blur-sm border-b",
                      isFullscreen && "absolute top-0 w-full left-0 right-0 bg-transparent border-0"
                    )}>
                    <div className="flex items-center gap-2">
                       <h3 className="font-medium text-slate-800">{activeSig.name}</h3>
                       <Badge variant="outline" className="bg-white">{speed}x Speed</Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-slate-500 hover:text-slate-900">
                      {isFullscreen ? <Minimize2 className="w-5 h-5"/> : <Maximize2 className="w-5 h-5" />}
                    </Button>
                  </div>

                  {/* SVG Canvas */}
                  <div className={cn(
                      "flex-1 flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat relative",
                      isFullscreen ? "w-full max-w-4xl" : "w-full"
                    )}>
                    <svg viewBox="0 0 300 150" className="w-full h-auto max-w-lg drop-shadow-md pb-12 pt-4">
                      {/* Guide Path (Faded) */}
                      <path
                        d={activeSig.path}
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Animated Drawing Path */}
                      <motion.path
                        key={`path-${animationKey}`}
                        d={activeSig.path}
                        fill="transparent"
                        stroke={isFullscreen ? "#4f46e5" : "#1e293b"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        initial="hidden"
                        animate={controls}
                        onAnimationComplete={handleAnimationComplete}
                      />
                    </svg>

                    {/* Faded Handwriting guide lines behind signature */}
                    <div className="absolute top-1/2 left-[10%] right-[10%] border-b-2 border-blue-200/50 -translate-y-4 pointer-events-none" />
                    <div className="absolute top-1/2 left-[10%] right-[10%] border-b-2 border-red-200/30 translate-y-12 border-dashed pointer-events-none" />
                  </div>

                  {/* Bottom Controls */}
                  <div className={cn(
                      "p-4 bg-slate-50 border-t flex flex-col sm:flex-row items-center gap-4 justify-between",
                      isFullscreen && "absolute bottom-0 w-full left-0 right-0 max-w-3xl mx-auto rounded-t-2xl border-x shadow-2xl"
                    )}>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-center">
                      <Button variant="outline" size="icon" onClick={handleReplay} className="rounded-full w-10 h-10 hover:bg-slate-200">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button variant="default" size="icon" onClick={handlePlayPause} className="rounded-full w-10 h-10 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-64">
                      <FastForward className="w-4 h-4 text-slate-400 shrink-0" />
                      <Slider 
                        value={[speed]} 
                        onValueChange={(vals) => {
                          const val = Array.isArray(vals) ? vals[0] : vals;
                          setSpeed(val as number); 
                          controls.stop(); 
                          setIsPlaying(false);
                        }} 
                        max={3} 
                        min={0.5} 
                        step={0.5} 
                        className="flex-1"
                      />
                      <span className="text-xs font-mono text-slate-500 w-8">{speed}x</span>
                    </div>

                  </div>
                </div>
              </Card>

              {/* Step By Step Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step-by-Step Breakdown</CardTitle>
                  <CardDescription>Master the signature by understanding its components.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "The Initial Capital Setup", desc: "Start strong with an angled, looping ascender. This sets the rhythm." },
                      { step: 2, title: "Middle Glyphs Flow", desc: "Keep the pen on the \"paper\" for the middle section, maintaining consistent height." },
                      { step: 3, title: "The Final Flourish", desc: "Finish with a confident, sweeping line outward to project authority." }
                    ].map((s, i) => (
                      <div 
                        key={s.step} 
                        className={cn(
                          "flex gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                          learningStep >= s.step ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50/50 border-transparent text-slate-400 grayscale"
                        )}
                        onClick={() => {
                           setLearningStep(s.step);
                           setSpeed(0.5); // slow down on specific steps
                           handleReplay();
                        }}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold",
                          learningStep >= s.step ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-500"
                        )}>
                          {s.step}
                        </div>
                        <div>
                          <h4 className="font-medium">{s.title}</h4>
                          <p className="text-sm mt-1">{s.desc}</p>
                        </div>
                        {learningStep > s.step && (
                           <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto mt-2 shrink-0 animate-in zoom-in" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice" className="space-y-6 mt-0">
               <Card className="border-slate-200">
                  <CardHeader>
                     <CardTitle className="flex justify-between items-center">
                        Practice Session
                        {practiceProgress === 100 && <Badge className="bg-emerald-500">Mastered</Badge>}
                     </CardTitle>
                     <CardDescription>Trace over the guide, then try it freehand.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="font-medium text-slate-700">Muscle Memory Progress</span>
                           <span className="text-slate-500">{practiceProgress}%</span>
                        </div>
                        <Progress value={practiceProgress} className="h-2" />
                     </div>
                     
                     <div className="bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 min-h-[300px] flex items-center justify-center relative cursor-crosshair group">
                        {/* A fake drawing canvas area for UI purposes */}
                        <p className="text-slate-400 group-hover:opacity-0 transition-opacity absolute">
                           Use a stylus or mouse to trace here
                        </p>
                        <svg viewBox="0 0 300 150" className="w-full h-auto max-w-lg opacity-20 pointer-events-none">
                           <path
                           d={activeSig.path}
                           fill="transparent"
                           stroke="#000"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           />
                        </svg>
                     </div>
                     
                     <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setPracticeProgress(0)}>Reset Pad</Button>
                        <Button onClick={() => setPracticeProgress(p => Math.min(p + 25, 100))}>Submit Attempt</Button>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

          </Tabs>
        </div>

      </div>
    </div>
  );
}
