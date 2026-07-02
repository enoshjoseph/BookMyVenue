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
} from "lucide-react";
import type { Venue } from "@/types/venue";
import { getMyVenues } from "@/services/venueService";

export default function DashboardPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "VenueOwner") {
        router.push("/login");
        return;
      }
      setFullName(localStorage.getItem("fullName") || "");
    }
    loadVenues();
  }, [router]);

  const loadVenues = async () => {
    try {
      const data = await getMyVenues();
      setVenues(data);
    } catch {
      // silent fail — venues just won't show
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

  const approved = venues.filter((v) => v.status === "Approved").length;
  const pending = venues.filter((v) => v.status === "Pending").length;

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
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/venues"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <Building2 className="h-4 w-4" />
            My Venues
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <CalendarDays className="h-4 w-4" />
            Bookings
          </Link>
          <Link
            href="/dashboard/venues/new"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <Plus className="h-4 w-4" />
            Add Venue
          </Link>
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <span className="text-sm text-gray-500">Welcome, {fullName}</span>
        </header>

        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
                      <p className="text-sm text-gray-500">Total Venues</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{approved}</p>
                      <p className="text-sm text-gray-500">Approved</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                      <CalendarDays className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{pending}</p>
                      <p className="text-sm text-gray-500">Pending Approval</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link
                    href="/dashboard/venues/new"
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-indigo-200"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Add New Venue</p>
                      <p className="text-sm text-gray-500">List a new event space</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/venues"
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-indigo-200"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Venues</p>
                      <p className="text-sm text-gray-500">View & edit your venues</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-indigo-200"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View Bookings</p>
                      <p className="text-sm text-gray-500">Manage incoming bookings</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Venues */}
              {venues.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900">Your Venues</h2>
                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 font-semibold text-gray-600">Venue</th>
                          <th className="px-6 py-3 font-semibold text-gray-600">City</th>
                          <th className="px-6 py-3 font-semibold text-gray-600">Price/Day</th>
                          <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {venues.slice(0, 5).map((v) => (
                          <tr key={v.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium text-gray-900">{v.name}</td>
                            <td className="px-6 py-4 text-gray-500">{v.city}</td>
                            <td className="px-6 py-4 text-gray-700">
                              ₹{v.pricePerDay.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  v.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : v.status === "Pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
