"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  CalendarCheck,
  Search,
  Filter,
  Loader2,
  MapPin,
  DollarSign,
  User,
  Clock,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import type { Venue } from "@/types/venue";
import { getAdminAllVenues, approveVenue, rejectVenue } from "@/services/venueService";
import { getAdminAllUsers } from "@/services/authService";
import { getAdminAllBookings } from "@/services/bookingService";

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface BookingItem {
  id: string;
  venueName?: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "venues" | "users" | "bookings">("pending");

  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "Admin") {
        toast.error("Admin access required.");
        router.push("/login");
        return;
      }
    }
    loadAdminData();
  }, [router]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [vData, uData, bData] = await Promise.all([
        getAdminAllVenues().catch(() => []),
        getAdminAllUsers().catch(() => []),
        getAdminAllBookings().catch(() => []),
      ]);
      setVenues(vData || []);
      setUsers(uData || []);
      setBookings(bData || []);
    } catch {
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await approveVenue(id);
      toast.success(`"${name}" has been approved!`);
      setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, status: "Approved" } : v)));
    } catch {
      toast.error("Failed to approve venue.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await rejectVenue(id);
      toast.success(`"${name}" has been rejected.`);
      setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, status: "Rejected" } : v)));
    } catch {
      toast.error("Failed to reject venue.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingVenues = venues.filter((v) => v.status === "Pending");
  const approvedVenues = venues.filter((v) => v.status === "Approved");

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        <p className="mt-4 text-sm font-medium text-slate-400">Loading Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-900 via-violet-950/60 to-slate-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-bold tracking-wide text-violet-300 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                SYSTEM ADMINISTRATOR
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                Admin Control Panel
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Review and approve new venue listings, oversee users, monitor bookings, and manage the platform infrastructure.
              </p>
            </div>

            <button
              onClick={loadAdminData}
              className="self-start md:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition"
            >
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              Refresh Data
            </button>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-950/30 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">Pending Approvals</span>
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-400">{pendingVenues.length}</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Venues</span>
                <Building2 className="h-5 w-5 text-violet-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{venues.length}</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Users</span>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{users.length}</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</span>
                <CalendarCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{bookings.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "pending"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Clock className="h-4 w-4" />
              Pending Queue
              {pendingVenues.length > 0 && (
                <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-black text-slate-950">
                  {pendingVenues.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("venues")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "venues"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Building2 className="h-4 w-4" />
              All Venues ({venues.length})
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "users"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Users className="h-4 w-4" />
              Users ({users.length})
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "bookings"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              Bookings ({bookings.length})
            </button>
          </div>

          {(activeTab === "venues" || activeTab === "users") && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          )}
        </div>

        {/* TAB 1: PENDING APPROVALS */}
        {activeTab === "pending" && (
          <div className="mt-6 space-y-4">
            {pendingVenues.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/60 mb-3" />
                <h3 className="text-lg font-bold text-white">All Caught Up!</h3>
                <p className="mt-1 text-sm text-slate-400 max-w-sm">
                  There are no venue listings currently waiting for administrator verification.
                </p>
              </div>
            ) : (
              pendingVenues.map((v) => (
                <div
                  key={v.id}
                  className="overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 to-slate-900/60 p-5 shadow-xl backdrop-blur-md transition hover:border-amber-500/50"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full lg:w-72 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                      <img
                        src={v.images && v.images[0] ? v.images[0] : "/placeholder.jpg"}
                        alt={v.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-slate-950 uppercase">
                        Pending Verification
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {v.name}
                          </h3>
                          <Link
                            href={`/venues/${v.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
                          >
                            Preview Listing <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-rose-400" /> {v.address}, {v.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-indigo-400" /> {v.type}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            ₹{v.pricePerDay.toLocaleString("en-IN")} / day
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-300 line-clamp-2">{v.description}</p>

                        {v.amenities && v.amenities.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {v.amenities.slice(0, 5).map((a, idx) => (
                              <span key={idx} className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
                        <button
                          onClick={() => handleReject(v.id, v.name)}
                          disabled={actionLoading === v.id}
                          className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-300 transition disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4 text-rose-400" />
                          Reject Listing
                        </button>

                        <button
                          onClick={() => handleApprove(v.id, v.name)}
                          disabled={actionLoading === v.id}
                          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                        >
                          {actionLoading === v.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Approve Venue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ALL VENUES */}
        {activeTab === "venues" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((v) => (
              <div
                key={v.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition hover:border-slate-700"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-800 mb-4">
                    <img
                      src={v.images && v.images[0] ? v.images[0] : "/placeholder.jpg"}
                      alt={v.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide shadow-md ${
                          v.status === "Approved"
                            ? "bg-emerald-500 text-slate-950"
                            : v.status === "Pending"
                            ? "bg-amber-500 text-slate-950"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white">{v.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-rose-400" /> {v.city} • {v.type}
                  </p>
                  <p className="mt-2 text-sm font-bold text-emerald-400">
                    ₹{v.pricePerDay.toLocaleString("en-IN")} / day
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-semibold">
                  <Link
                    href={`/venues/${v.id}`}
                    target="_blank"
                    className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    View Page <ExternalLink className="h-3 w-3" />
                  </Link>

                  <div className="flex gap-2">
                    {v.status !== "Approved" && (
                      <button
                        onClick={() => handleApprove(v.id, v.name)}
                        className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-emerald-300 hover:bg-emerald-500/30"
                      >
                        Approve
                      </button>
                    )}
                    {v.status !== "Rejected" && (
                      <button
                        onClick={() => handleReject(v.id, v.name)}
                        className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-rose-300 hover:bg-rose-500/30"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: USERS TABLE */}
        {activeTab === "users" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Email / Contact</th>
                    <th className="px-6 py-4">Account Role</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/20 text-violet-400 font-bold">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        {u.fullName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-200">{u.email}</div>
                        <div className="text-xs text-slate-400">{u.phone || "No phone provided"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            u.role === "Admin"
                              ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                              : u.role === "VenueOwner"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Booking Reference</th>
                    <th className="px-6 py-4">Venue</th>
                    <th className="px-6 py-4">Event Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        #{b.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {b.venueName || "Venue Booking"}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="text-slate-200">{b.startDate}</span> to{" "}
                        <span className="text-slate-200">{b.endDate}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        ₹{b.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                            b.status === "Confirmed"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : b.status === "Pending"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
