"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Edit3 } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getVenueById } from "@/services/venueService";
import type { Venue } from "@/types/venue";
import VenueHero from "@/components/venue/VenueHero";
import AboutVenue from "@/components/venue/AboutVenue";
import BookingCard from "@/components/venue/BookingCard";


export default function VenueDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
    const loadVenue = async () => {
      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <span className="text-sm font-medium text-slate-400">
              Loading venue...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Venue not found
          </h2>
          <p className="text-sm text-gray-500">
            It may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {role === "VenueOwner" && (
        <div className="bg-indigo-900 text-white px-6 py-3 shadow-inner">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <span className="text-sm font-medium">You are viewing this venue as a Venue Owner.</span>
            <Link
              href={`/dashboard/venues/${venue.id}/edit`}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Venue & Photos
            </Link>
          </div>
        </div>
      )}

      <VenueHero venue={venue} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left side */}
          <div className="lg:col-span-2">
            <AboutVenue venue={venue} />
          </div>

          {/* Right side — Booking Card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingCard venue={venue} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}