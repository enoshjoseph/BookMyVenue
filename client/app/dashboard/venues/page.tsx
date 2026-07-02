"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Landmark,
  Building2,
  CalendarDays,
  Plus,
  LogOut,
  LayoutDashboard,
  Loader2,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
import type { Venue } from "@/types/venue";
import { getMyVenues } from "@/services/venueService";

export default function DashboardVenuesPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (!token || role !== "VenueOwner") {
      router.push("/login");
      return;
    }
    loadVenues();
  }, [router]);

  const loadVenues = async () => {
    try {
      const data = await getMyVenues();
      setVenues(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-rose-500 text-white">
            <Landmark className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-gray-900">BookMyVenue</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/dashboard/venues" className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700">
            <Building2 className="h-4 w-4" /> My Venues
          </Link>
          <Link href="/dashboard/bookings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <CalendarDays className="h-4 w-4" /> Bookings
          </Link>
          <Link href="/dashboard/venues/new" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Plus className="h-4 w-4" /> Add Venue
          </Link>
        </nav>
        <div className="border-t border-gray-200 p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">My Venues</h1>
          <Link
            href="/dashboard/venues/new"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Venue
          </Link>
        </header>

        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : venues.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 py-20">
              <Building2 className="h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-400">No venues yet</p>
              <Link
                href="/dashboard/venues/new"
                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Add Your First Venue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={venue.images && venue.images.length > 0 ? venue.images[0] : "/placeholder.jpg"}
                        alt={venue.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span
                        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold uppercase shadow-sm ${
                          venue.status === "Approved"
                            ? "bg-emerald-500 text-white"
                            : venue.status === "Pending"
                            ? "bg-amber-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {venue.status}
                      </span>
                    </div>

                    <div className="p-5 pb-0">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                        {venue.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        {venue.city} • {venue.address}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="h-3.5 w-3.5 text-indigo-500" /> {venue.capacity}
                      </span>
                      <span className="font-bold text-gray-900">₹{venue.pricePerDay.toLocaleString()}/day</span>
                      <span className="text-xs bg-gray-100 font-semibold text-gray-600 rounded-full px-2.5 py-1">
                        {venue.type}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <Link
                        href={`/venues/${venue.id}`}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition"
                      >
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/dashboard/venues/${venue.id}/edit`}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        Edit Venue
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
