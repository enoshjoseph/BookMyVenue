"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft,
  X,
  UploadCloud,
  Star,
  Trash2,
} from "lucide-react";
import { createVenue, uploadVenueImages } from "@/services/venueService";

export default function AddVenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  // Photos
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  // Payment policy
  const [isAdvanceRequired, setIsAdvanceRequired] = useState(false);
  const [advancePercentage, setAdvancePercentage] = useState("");
  const [balanceDueDays, setBalanceDueDays] = useState("");

  // Cancellation policy
  const [isCancellationAllowed, setIsCancellationAllowed] = useState(false);
  const [cancellationDeadlineDays, setCancellationDeadlineDays] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (!token || role !== "VenueOwner") {
      router.push("/login");
    }
  }, [router]);

  const addAmenity = () => {
    const trimmed = newAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities([...amenities, trimmed]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (a: string) => {
    setAmenities(amenities.filter((x) => x !== a));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const fileArray = Array.from(files);
      const res = await uploadVenueImages(fileArray);
      setImages((prev) => [...prev, ...res.urls]);
      toast.success(`${res.urls.length} photo(s) uploaded successfully!`);
    } catch {
      try {
        const fileArray = Array.from(files);
        const base64Promises = fileArray.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        );
        const base64Urls = await Promise.all(base64Promises);
        setImages((prev) => [...prev, ...base64Urls]);
        toast.success(`${base64Urls.length} photo(s) added!`);
      } catch {
        toast.error("Failed to process image files.");
      }
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const addImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!images.includes(trimmed)) {
      setImages([...images, ...[trimmed]]);
      setNewImageUrl("");
      toast.success("Image URL added!");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const reordered = [...images];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);
    setImages(reordered);
    toast.success("Cover photo updated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !type || !address || !city || !pricePerDay || !capacity || !availableFrom || !availableTo) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await createVenue({
        name,
        description,
        type,
        address,
        city,
        pricePerDay: Number(pricePerDay),
        capacity: Number(capacity),
        availableFrom,
        availableTo,
        amenities,
        images,
        isAdvanceRequired,
        advancePercentage: isAdvanceRequired ? Number(advancePercentage) : undefined,
        balanceDueDaysBeforeEvent: isAdvanceRequired ? Number(balanceDueDays) : undefined,
        isCancellationAllowed,
        cancellationDeadlineDays: isCancellationAllowed ? Number(cancellationDeadlineDays) : undefined,
      });
      toast.success("Venue submitted for approval!");
      router.push("/dashboard/venues");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create venue."
          : "Something went wrong.";
      toast.error(msg);
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
          <Link href="/dashboard/venues" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Building2 className="h-4 w-4" /> My Venues
          </Link>
          <Link href="/dashboard/bookings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <CalendarDays className="h-4 w-4" /> Bookings
          </Link>
          <Link href="/dashboard/venues/new" className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700">
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
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 lg:px-8">
          <Link href="/dashboard/venues" className="text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Add New Venue</h1>
        </header>

        <div className="mx-auto max-w-3xl p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Venue Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grand Palace Banquet Hall" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Description *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe your venue..." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Type *</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="">Select type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Conference">Conference</option>
                    <option value="Party">Party</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Exhibition">Exhibition</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">City *</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Kochi" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Address *</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Price Per Day (₹) *</label>
                  <input type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} placeholder="e.g. 25000" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Capacity (guests) *</label>
                  <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 500" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
            </section>

            {/* Availability */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Available From *</label>
                  <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Available To *</label>
                  <input type="date" value={availableTo} onChange={(e) => setAvailableTo(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  placeholder="e.g. WiFi, Parking, AC"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button type="button" onClick={addAmenity} className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition">
                  Add
                </button>
              </div>
              {amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {a}
                      <button type="button" onClick={() => removeAmenity(a)}>
                        <X className="h-3 w-3 text-indigo-400 hover:text-indigo-600" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Photos & Gallery */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Photos & Gallery</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Upload vibrant photos of your venue. The first photo will be your main cover photo.</p>
                </div>
              </div>

              {/* Upload Box */}
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 transition hover:border-indigo-400 hover:bg-indigo-50/30">
                <input
                  type="file"
                  id="venue-photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="venue-photos"
                  className="flex flex-col items-center justify-center cursor-pointer text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-3 shadow-sm">
                    {uploadingImages ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <UploadCloud className="h-6 w-6" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {uploadingImages ? "Uploading photos..." : "Click to upload files"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    JPG, PNG, WEBP (multiple photos allowed)
                  </span>
                </label>
              </div>

              {/* Or paste URL */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  placeholder="Or paste an image URL (e.g. https://images.unsplash.com/...)"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                >
                  Add URL
                </button>
              </div>

              {/* Images Grid */}
              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`Venue photo ${index + 1}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                      {index === 0 ? (
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                          <Star className="h-3 w-3 fill-current" /> Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makePrimary(index)}
                          className="absolute left-2 top-2 hidden rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700 shadow hover:bg-white group-hover:block"
                        >
                          Make Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600/90 text-white shadow opacity-0 transition group-hover:opacity-100 hover:bg-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Payment Policy */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Payment Policy</h2>
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isAdvanceRequired} onChange={(e) => setIsAdvanceRequired(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Require advance payment</span>
                </label>

                {isAdvanceRequired && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Advance Percentage (%)</label>
                      <input type="number" value={advancePercentage} onChange={(e) => setAdvancePercentage(e.target.value)} placeholder="e.g. 30" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Balance Due Days Before Event</label>
                      <input type="number" value={balanceDueDays} onChange={(e) => setBalanceDueDays(e.target.value)} placeholder="e.g. 7" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Cancellation Policy</h2>
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isCancellationAllowed} onChange={(e) => setIsCancellationAllowed(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Allow cancellation</span>
                </label>

                {isCancellationAllowed && (
                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Cancellation Deadline (days before event)</label>
                    <input type="number" value={cancellationDeadlineDays} onChange={(e) => setCancellationDeadlineDays(e.target.value)} placeholder="e.g. 3" className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                )}
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-indigo-700 hover:to-rose-600 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Venue for Approval"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
