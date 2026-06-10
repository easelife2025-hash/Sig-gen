"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Heart, Download, Filter, MoreHorizontal, Trash2, Copy, FileText, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const SAVED_SIGNATURES = [
  { id: 1, name: "Alexander Designer", type: "Handwritten", fontFamily: "'Caveat', cursive", color: "#0f172a", date: "2026-06-10", isFavorite: true },
  { id: 2, name: "Alexander Designer", type: "Email HTML", template: "Corporate Modern", date: "2026-06-09", isFavorite: false },
  { id: 3, name: "A. Designer", type: "Handwritten", fontFamily: "'Great Vibes', cursive", color: "#4f46e5", date: "2026-06-08", isFavorite: true },
  { id: 4, name: "Alex D.", type: "Handwritten", fontFamily: "'Sacramento', cursive", color: "#e11d48", date: "2026-06-05", isFavorite: false },
  { id: 5, name: "Alexander", type: "Handwritten", fontFamily: "'Yellowtail', cursive", color: "#0ea5e9", date: "2026-06-01", isFavorite: false },
];

export default function CollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name
  
  // Filter and sort logic
  let filtered = SAVED_SIGNATURES.filter(sig => 
    sig.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sig.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (activeTab === "favorites") {
    filtered = filtered.filter(sig => sig.isFavorite);
  } else if (activeTab === "handwritten") {
    filtered = filtered.filter(sig => sig.type === "Handwritten");
  } else if (activeTab === "email") {
    filtered = filtered.filter(sig => sig.type === "Email HTML");
  }
  
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 flex flex-col h-full">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">
          My Collection
        </h1>
        <p className="text-slate-500">View and manage your saved signatures and templates.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Tabs defaultValue="all" className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Favorites</TabsTrigger>
            <TabsTrigger value="handwritten" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Handwritten</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Email HTML</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input 
              placeholder="Search signatures..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Button variant="outline" className="shrink-0 bg-white" onClick={() => setSortBy(prev => prev === "newest" ? "oldest" : prev === "oldest" ? "name" : "newest")}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Name"}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1">
        <AnimatePresence mode="popLayout">
          {sorted.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {sorted.map((sig, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={sig.id}
                >
                  <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group bg-white h-full flex flex-col">
                    <CardContent className="p-0 relative flex-1 min-h-[160px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center overflow-hidden">
                      {/* Action buttons overlay */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white backdrop-blur shadow-sm">
                          <Copy className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white backdrop-blur shadow-sm text-rose-500 hover:text-rose-600">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {sig.type === "Handwritten" ? (
                        <span 
                          style={{ fontFamily: sig.fontFamily, color: sig.color, fontSize: 'clamp(2rem, 3vw, 3rem)' }}
                          className="whitespace-nowrap px-4 py-8 pointer-events-none transform origin-center transition-transform group-hover:scale-105"
                        >
                          {sig.name}
                        </span>
                      ) : (
                         <div className="flex flex-col items-center justify-center p-6 text-slate-400 group-hover:scale-105 transition-transform">
                           <FileText className="h-10 w-10 mb-2 text-indigo-300" />
                           <span className="text-sm font-medium text-slate-600">Email Template</span>
                         </div>
                      )}
                    </CardContent>

                    <CardFooter className="bg-slate-50 border-t p-4 flex flex-col gap-3">
                       <div className="flex justify-between items-start w-full">
                         <div>
                            <h4 className="font-medium text-sm text-slate-900 line-clamp-1" title={sig.name}>{sig.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{sig.date}</p>
                         </div>
                         <Heart className={`w-4 h-4 shrink-0 transition-colors ${sig.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
                       </div>
                       
                       <div className="flex w-full justify-between items-center mt-auto">
                         <Badge variant="outline" className="bg-white text-[10px] font-medium text-slate-500 border-slate-200">
                           {sig.type === "Email HTML" ? sig.template : "Static"}
                         </Badge>
                         <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 px-2">
                           <Download className="w-3.5 h-3.5 mr-1.5" /> Export
                         </Button>
                       </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[40vh] text-slate-400"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-600">No signatures found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
