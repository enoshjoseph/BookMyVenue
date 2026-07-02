"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Landmark,
  Building2,
  CalendarDays,
  Plus,
  LogOut,
  LayoutDashboard,
  Loader2,
  Check,
  X,
} from "lucide-react";
import type { Venue } from "@/types/venue";
import type { Booking } from "@/types/booking";
import { getMyVenues } from "@/services/venueService";
import { getVenueBookings, confirmBooking, declineBooking } from "@/services/bookingService";

export default function DashboardBookingsPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      if (data.length > 0) {
        setSelectedVenueId(data[0].id);
        loadBookings(data[0].id);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (venueId: string) => {
    setBookingsLoading(true);
    try {
      const data = await getVenueBookings(venueId);
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleVenueChange = (venueId: string) => {
    setSelectedVenueId(venueId);
    loadBookings(venueId);
  };

  const handleConfirm = async (id: string) => {
    setActionLoading(id);
    try {
      await confirmBooking(id);
      toast.success("Booking confirmed!");
      loadBookings(selectedVenueId);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed."
          : "Something went wrong.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    if (!confirm("Are you sure you want to decline this booking?")) return;
    setActionLoading(id);
    try {
      await declineBooking(id);
      toast.success("Booking declined.");
      loadBookings(selectedVenueId);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed."
          : "Something went wrong.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    window.location.href = "/";
  };

  const statusColor: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-600 border-red-200",
    Completed: "bg-blue-50 text-blue-700 border-blue-200",
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
          <Link href="/dashboard/venues" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Building2 className="h-4 w-4" /> My Venues
          </Link>
          <Link href="/dashboard/bookings" className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700">
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
          <h1 className="text-lg font-semibold text-gray-900">Venue Bookings</h1>
          {venues.length > 0 && (
            <select
              value={selectedVenueId}
              onChange={(e) => handleVenueChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </header>

        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : venues.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 py-20">
              <Building2 className="h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-400">No venues yet. Add a venue first.</p>
            </div>
          ) : bookingsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 py-20">
              <CalendarDays className="h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-400">No bookings for this venue yet</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-600">Dates</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Payment</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₹{b.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{b.paymentStatus}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[b.status] || ""}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {b.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirm(b.id)}
                              disabled={actionLoading === b.id}
                              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                              {actionLoading === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              Confirm
                            </button>
                            <button
                              onClick={() => handleDecline(b.id)}
                              disabled={actionLoading === b.id}
                              className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                              Decline
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
