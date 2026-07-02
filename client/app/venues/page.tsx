"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VenueCard from "@/components/VenueCard";
import { searchVenues } from "@/services/venueService";
import type { Venue } from "@/types/venue";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadVenues = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (city.trim()) params.city = city.trim();
      if (type.trim()) params.type = type.trim();
      if (capacity) params.capacity = Number(capacity);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const data = await searchVenues(params);
      setVenues(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadVenues();
  };

  const clearFilters = () => {
    setCity("");
    setType("");
    setCapacity("");
    setMaxPrice("");
    setTimeout(loadVenues, 0);
  };

  const hasActiveFilters = city || type || capacity || maxPrice;

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="bg-slate-950 px-6 py-14 text-center text-white">
        <h1 className="text-4xl font-bold">Explore Venues</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Find the perfect venue for your next event. Filter by city, type,
          capacity, and budget.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-2xl items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city (e.g. Kochi, Mumbai)..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-rose-600 hover:to-indigo-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
              showFilters
                ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-end gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white outline-none"
              >
                <option value="" className="text-gray-900">All Types</option>
                <option value="Wedding" className="text-gray-900">Wedding</option>
                <option value="Conference" className="text-gray-900">Conference</option>
                <option value="Party" className="text-gray-900">Party</option>
                <option value="Corporate" className="text-gray-900">Corporate</option>
                <option value="Birthday" className="text-gray-900">Birthday</option>
                <option value="Exhibition" className="text-gray-900">Exhibition</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Min Capacity
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Max Price / Day
              </label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}
      </section>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : venues.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Search className="h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-400">
              No venues found matching your criteria
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">
              {venues.length} venue{venues.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}