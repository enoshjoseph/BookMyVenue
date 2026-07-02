"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CalendarDays,
  MapPin,
  Clock,
  Loader2,
  XCircle,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Booking } from "@/types/booking";
import { getMyBookings, cancelBooking } from "@/services/bookingService";
import { createPaymentOrder, verifyPayment } from "@/services/paymentService";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const statusColor: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const paymentColor: Record<string, string> = {
  Pending: "text-amber-600",
  PartiallyPaid: "text-indigo-600",
  FullyPaid: "text-emerald-600",
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setActionLoading(id);
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled.");
      loadBookings();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            "Cancel failed."
          : "Something went wrong.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePay = async (booking: Booking) => {
    setActionLoading(booking.id);
    try {
      const order = await createPaymentOrder(booking.id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T6bsrEcdaz6hai",
        amount: order.amount * 100,
        currency: order.currency,
        name: "BookMyVenue",
        description: `Payment for ${booking.venueName}`,
        order_id: order.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              bookingId: booking.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentType: order.paymentType,
            });
            toast.success("Payment successful!");
            loadBookings();
          } catch {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          email: typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
          name: typeof window !== "undefined" ? localStorage.getItem("fullName") || "" : "",
        },
        theme: { color: "#4F46E5" },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Razorpay is not loaded. Please refresh and try again.");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            "Payment failed."
          : "Something went wrong.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto min-h-screen max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-500">Manage all your venue reservations</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 py-20">
            <CalendarDays className="h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-400">No bookings yet</p>
            <button
              onClick={() => router.push("/venues")}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Explore Venues
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Venue Name + Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.venueName}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${
                          statusColor[booking.status] || "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-indigo-500" />
                        {new Date(booking.startDate).toLocaleDateString()} –{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Amounts */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span className="text-gray-700">
                        Total:{" "}
                        <span className="font-semibold">
                          ₹{booking.totalAmount.toLocaleString()}
                        </span>
                      </span>
                      {booking.advanceAmount > 0 && (
                        <span className="text-gray-700">
                          Advance:{" "}
                          <span className="font-semibold">
                            ₹{booking.advanceAmount.toLocaleString()}
                          </span>
                        </span>
                      )}
                      {booking.balanceAmount > 0 && (
                        <span className="text-gray-700">
                          Balance:{" "}
                          <span className="font-semibold">
                            ₹{booking.balanceAmount.toLocaleString()}
                          </span>
                        </span>
                      )}
                      <span className={`font-medium ${paymentColor[booking.paymentStatus] || ""}`}>
                        {booking.paymentStatus === "FullyPaid" && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Fully Paid
                          </span>
                        )}
                        {booking.paymentStatus === "PartiallyPaid" && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" /> Partially Paid
                          </span>
                        )}
                        {booking.paymentStatus === "Pending" && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Payment Pending
                          </span>
                        )}
                      </span>
                    </div>

                    {booking.balanceDueDate && booking.paymentStatus !== "FullyPaid" && (
                      <p className="text-xs text-amber-600">
                        Balance due by {new Date(booking.balanceDueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 gap-2">
                    {(booking.status === "Pending" || booking.status === "Confirmed") &&
                      booking.paymentStatus !== "FullyPaid" && (
                        <button
                          onClick={() => handlePay(booking)}
                          disabled={actionLoading === booking.id}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {actionLoading === booking.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4" />
                              Pay Now
                            </>
                          )}
                        </button>
                      )}

                    {booking.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
