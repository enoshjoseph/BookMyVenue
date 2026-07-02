"use client";

import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Venue } from "@/types/venue";

interface Props {
  venue: Venue;
  onChange?: (dates: { checkIn: string; checkOut: string }) => void;
  newBookingRange?: { startDate: string; endDate: string } | null;
}

export default function BookingCalendar({ venue, onChange, newBookingRange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Expand booked + blocked ranges into individual dates & sets for styling
  const { unavailableDates, bookedDatesSet, blockedDatesSet } = useMemo(() => {
    const bookedSet = new Set<string>();
    const blockedSet = new Set<string>();
    const allUnavailable: Date[] = [];

    const bookedRanges = [...(venue.bookedDates || [])];
    if (newBookingRange) {
      bookedRanges.push(newBookingRange);
    }

    bookedRanges.forEach((range) => {
      let current = new Date(range.startDate);
      const end = new Date(range.endDate);
      while (current <= end) {
        bookedSet.add(current.toDateString());
        allUnavailable.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    (venue.blockedDates || []).forEach((range) => {
      let current = new Date(range.startDate);
      const end = new Date(range.endDate);
      while (current <= end) {
        blockedSet.add(current.toDateString());
        allUnavailable.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    return { unavailableDates: allUnavailable, bookedDatesSet: bookedSet, blockedDatesSet: blockedSet };
  }, [venue, newBookingRange]);

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mt-6 rounded-2xl border bg-white p-6 shadow">
      <style jsx global>{`
        .booked-date-cell,
        .react-datepicker__day--excluded.booked-date-cell,
        .react-datepicker__day--disabled.booked-date-cell {
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
          font-weight: 600 !important;
          text-decoration: line-through !important;
          border-radius: 9999px !important;
          opacity: 1 !important;
        }
        .booked-date-cell:hover {
          background-color: #fecaca !important;
        }
        .blocked-date-cell,
        .react-datepicker__day--excluded.blocked-date-cell,
        .react-datepicker__day--disabled.blocked-date-cell {
          background-color: #f3f4f6 !important;
          color: #9ca3af !important;
          text-decoration: line-through !important;
          border-radius: 9999px !important;
          opacity: 1 !important;
        }
      `}</style>

      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Select Booking Dates
      </h2>

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          const [start, end] = update;
          setStartDate(start);
          setEndDate(end);
          if (onChange) {
            onChange({
              checkIn: formatDate(start),
              checkOut: formatDate(end),
            });
          }
        }}
        inline
        minDate={new Date(venue.availableFrom)}
        maxDate={new Date(venue.availableTo)}
        excludeDates={unavailableDates}
        dayClassName={(date) => {
          const dateStr = date.toDateString();
          if (bookedDatesSet.has(dateStr)) return "booked-date-cell";
          if (blockedDatesSet.has(dateStr)) return "blocked-date-cell";
          return null;
        }}
      />

      <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-gray-100 pt-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#fee2e2] border border-[#dc2626]"></span>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gray-200 border border-gray-400"></span>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#216ba5]"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}