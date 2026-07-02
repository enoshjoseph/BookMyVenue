
"use client";

import { useState } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
export default function Hero() {
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Searching for city:", location);
};

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 text-white px-4 sm:px-6 lg:px-8">
      
      {/* Background Atmosphere Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1600" 
          alt="Premium Event Space" 
          className="w-full h-full object-cover object-center opacity-30 scale-105 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        
        {/* Subtle Luxury Tagline */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-white/10 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" /> Vetted Spaces for Flawless Events
        </span>

        {/* Catchy Main Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none">
          Find Your Perfect Venue <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-rose-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            Life&apos;s Great Moments
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 font-medium">
          Weddings, modern corporate meetups, high-end summits, rooftop cocktail soirées, and more. Book premium spaces with zero friction.
        </p>

        {/* Combined Airbnb-Style Capsule Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="mx-auto mt-12 max-w-2xl rounded-2xl sm:rounded-full bg-white text-slate-800 shadow-2xl p-2.5 sm:p-2 border border-slate-200/50 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 relative z-30"
        >
          {/* Where Segment */}
          <div className="flex-1 px-5 py-2.5 sm:py-1 text-left flex items-center gap-3.5 group/seg">
            <div className="p-2 rounded-full bg-slate-50 text-indigo-600 group-hover/seg:bg-indigo-50 transition">
              <MapPin className="h-5 w-5 flex-shrink-0" />
            </div>
            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Where</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by city (e.g. Kochi)..." 
                className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Search CTA Trigger */}
          <div className="flex items-center justify-center p-2">
            <button 
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-gradient-to-r from-rose-500 via-indigo-600 to-indigo-700 hover:from-rose-600 hover:to-indigo-800 px-7 py-3.5 text-white font-bold shadow-lg shadow-indigo-600/35 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Search className="h-4.5 w-4.5" />
              <span>Search</span>
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}


  