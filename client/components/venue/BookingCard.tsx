"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ShieldCheck, XCircle, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Venue } from "@/types/venue";
import type { Booking } from "@/types/booking";
import BookingCalendar from "@/components/venue/BookingCalendar";
import { createBooking } from "@/services/bookingService";

interface BookingCardProps {
  venue: Venue;
}

export default function BookingCard({ venue }: BookingCardProps) {
  const router = useRouter();
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  const advanceAmount = venue.isAdvanceRequired && venue.advancePercentage
    ? Math.round((venue.pricePerDay * venue.advancePercentage) / 100)
    : 0;

  // Calculate number of days & total
  const dayCount =
    dates.checkIn && dates.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const estimatedTotal = dayCount * venue.pricePerDay;

  const handleReserve = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to book a venue.");
      router.push("/login");
      return;
    }

    if (!dates.checkIn || !dates.checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    setLoading(true);
    try {
      const result = await createBooking({
        venueId: venue.id,
        startDate: dates.checkIn,
        endDate: dates.checkOut,
      });
      setBookingResult(result);
      toast.success("Booking created! Head to My Bookings to pay.");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Booking failed."
          : "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#DDDDDD] bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold text-[#222222]">
          ₹{venue.pricePerDay.toLocaleString()}
        </span>
        <span className="text-[15px] text-[#222222]">/ day</span>
      </div>

      <div className="mt-4">
        <BookingCalendar
          venue={venue}
          onChange={setDates}
          newBookingRange={
            bookingResult
              ? { startDate: bookingResult.startDate, endDate: bookingResult.endDate }
              : null
          }
        />
      </div>

      {/* Price breakdown */}
      {dayCount > 0 && !bookingResult && (
        <div className="mt-4 space-y-2 border-t border-[#EBEBEB] pt-4 text-sm text-[#222222]">
          <div className="flex justify-between">
            <span>
              ₹{venue.pricePerDay.toLocaleString()} × {dayCount} day{dayCount !== 1 ? "s" : ""}
            </span>
            <span>₹{estimatedTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-[#EBEBEB] pt-2 font-semibold">
            <span>Total</span>
            <span>₹{estimatedTotal.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Success state */}
      {bookingResult ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Booking Created!
          </div>
          <div className="text-sm text-[#717171] space-y-1">
            <p>Status: <span className="font-medium text-[#222222]">{bookingResult.status}</span></p>
            <p>Total: <span className="font-medium text-[#222222]">₹{bookingResult.totalAmount.toLocaleString()}</span></p>
            {bookingResult.advanceAmount > 0 && (
              <p>Advance Due: <span className="font-medium text-[#222222]">₹{bookingResult.advanceAmount.toLocaleString()}</span></p>
            )}
          </div>
          <button
            onClick={() => router.push("/bookings")}
            className="w-full rounded-lg bg-[#222222] py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
          >
            Go to My Bookings →
          </button>
        </div>
      ) : (
        <button
          onClick={handleReserve}
          disabled={loading || !dates.checkIn || !dates.checkOut}
          className="mt-4 w-full rounded-lg bg-[#E61E4D] py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#D70466] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Reserve"
          )}
        </button>
      )}

      {!bookingResult && (
        <p className="mt-3 text-center text-sm text-[#717171]">You won&apos;t be charged yet</p>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-[#EBEBEB] pt-5 text-sm text-[#222222]">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            Available {new Date(venue.availableFrom).toLocaleDateString()} –{" "}
            {new Date(venue.availableTo).toLocaleDateString()}
          </span>
        </div>

        {venue.isAdvanceRequired && venue.advancePercentage && (
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              {venue.advancePercentage}% advance required (₹
              {advanceAmount.toLocaleString()}) — balance due{" "}
              {venue.balanceDueDaysBeforeEvent} day
              {venue.balanceDueDaysBeforeEvent === 1 ? "" : "s"} before the
              event.
            </span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {venue.isCancellationAllowed ? (
            <span>
              Free cancellation up to {venue.cancellationDeadlineDays} day
              {venue.cancellationDeadlineDays === 1 ? "" : "s"} before the
              event.
            </span>
          ) : (
            <span>This booking is non-refundable once confirmed.</span>
          )}
        </div>
      </div>
    </div>
  );
}