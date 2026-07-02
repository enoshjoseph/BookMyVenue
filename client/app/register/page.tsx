"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { register } from "@/services/authService";
import {
  Landmark,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  CreditCard,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("User");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (role === "VenueOwner" && (!businessName || !businessAddress || !panNumber)) {
      toast.error("Please fill in all business details.");
      return;
    }

    setLoading(true);

    const registerData = {
      fullName,
      email,
      password,
      phone,
      role,
      businessName: role === "VenueOwner" ? businessName : undefined,
      businessAddress: role === "VenueOwner" ? businessAddress : undefined,
      panNumber: role === "VenueOwner" ? panNumber : undefined,
    };

    try {
      await register(registerData);
      toast.success("Registration successful! Please sign in.");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Registration Failed";
        toast.error(message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1600"
          alt=""
          className="h-full w-full object-cover opacity-20 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-indigo-950/80" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-rose-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center justify-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            BookMyVenue
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
            <p className="mt-2 text-sm text-slate-400">
              Join BookMyVenue to book premium event spaces
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mt-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setRole("User")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                role === "User"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              I&apos;m a User
            </button>
            <button
              type="button"
              onClick={() => setRole("VenueOwner")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                role === "VenueOwner"
                  ? "bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              I&apos;m a Venue Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="register-fullname"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="register-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Venue Owner Fields */}
            {role === "VenueOwner" && (
              <div className="space-y-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  Business Details
                </p>

                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="register-business-name"
                    type="text"
                    placeholder="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="register-business-address"
                    type="text"
                    placeholder="Business Address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="register-pan"
                    type="text"
                    placeholder="PAN Number"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:from-indigo-700 hover:to-rose-600 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}