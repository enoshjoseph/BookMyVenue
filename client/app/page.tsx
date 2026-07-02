"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import { getAllVenues } from "@/services/venueService";
import type { Venue } from "@/types/venue";
import VenueCard from "@/components/VenueCard";
import Footer from "@/components/Footer";


export default function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const loadVenues = async () => {
    try {
      const data = await getAllVenues();
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

  
  if (loading) {
    return <h2>Loading venues...</h2>;
  }

  return (
  <>
    <Navbar />
    <Hero />

    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-8 text-3xl font-bold text-gray-900">
        Featured Venues
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {venues.slice(0, 6).map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
    </div>
    <Footer />
  </>
);
}