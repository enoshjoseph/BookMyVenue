"use client";
import Link from "next/link";
import React, { useState, useSyncExternalStore } from "react";
import {
  Menu,
  X,
  LogOut,
  Clock,
  Landmark,
  LayoutDashboard,
  Shield,
} from "lucide-react";

// --- Reading localStorage safely across server/client ---
// useSyncExternalStore is the React-recommended tool for this: it reads an
// external, non-React value (localStorage) and gives React a server-safe
// fallback to render first, avoiding both hydration mismatches AND the
// "setState in effect" cascading-render warning that a useEffect approach hits.
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getTokenSnapshot() {
  return localStorage.getItem("token");
}
function getFullNameSnapshot() {
  return localStorage.getItem("fullName") || "";
}
function getRoleSnapshot() {
  return localStorage.getItem("role") || "";
}
function getServerTokenSnapshot() {
  return null;
}
function getServerFullNameSnapshot() {
  return "";
}
function getServerRoleSnapshot() {
  return "";
}

/* ==========================================
   PREMIUM NEXT.JS STICKY NAVBAR COMPONENT
   ========================================== */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const token = useSyncExternalStore(
    subscribeToStorage,
    getTokenSnapshot,
    getServerTokenSnapshot
  );
  const fullName = useSyncExternalStore(
    subscribeToStorage,
    getFullNameSnapshot,
    getServerFullNameSnapshot
  );
  const role = useSyncExternalStore(
    subscribeToStorage,
    getRoleSnapshot,
    getServerRoleSnapshot
  );

  // Standard Logout logic
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      // Force refresh/redirect to trigger layout-level state updates
      window.location.href = "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Elegant Modern Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
              <Landmark className="h-5.5 w-5.5" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
              BookMyVenue
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1.5 rounded-full border border-slate-200/40">
            <Link
              href="/"
              className="rounded-full px-5 py-2 text-sm font-semibold text-indigo-600 bg-white shadow-sm transition hover:text-indigo-700"
            >
              Home
            </Link>
            <Link
              href="/venues"
              className="rounded-full px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Explore Venues
            </Link>
          </div>

          {/* Desktop Right Side Auth Panel */}
          <div className="hidden md:flex items-center gap-4">
            {!token ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-150"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  Hi, {fullName}
                </span>

                {role === "VenueOwner" && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold shadow-sm transition"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                    Dashboard
                  </Link>
                )}

                {role === "Admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 px-4 py-2 text-sm font-semibold shadow-sm transition"
                  >
                    <Shield className="h-4 w-4 text-violet-600" />
                    Admin Panel
                  </Link>
                )}

                {role === "User" && (
                  <Link
                    href="/bookings"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold shadow-sm transition"
                  >
                    <Clock className="h-4 w-4 text-indigo-500" />
                    My Bookings
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 text-sm font-semibold transition"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-4 py-6 space-y-4 shadow-inner animate-in slide-in-from-top duration-250">
          <div className="space-y-1.5">
            <Link href="/" className="block rounded-xl px-4 py-3 text-base font-semibold text-indigo-600 bg-indigo-50/50">
              Home
            </Link>
            <Link href="/venues" className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50">
              Explore Venues
            </Link>
            {token && role === "User" && (
              <Link href="/bookings" className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50">
                My Bookings
              </Link>
            )}
            {token && role === "VenueOwner" && (
              <Link href="/dashboard" className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50">
                Dashboard
              </Link>
            )}
            {token && role === "Admin" && (
              <Link href="/admin" className="block rounded-xl px-4 py-3 text-base font-semibold text-violet-700 bg-violet-50">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4">
            {!token ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="px-4 py-2 text-sm font-semibold text-slate-500">
                  Hi, {fullName}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-rose-50 py-3 text-center text-sm font-semibold text-rose-600 hover:bg-rose-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}