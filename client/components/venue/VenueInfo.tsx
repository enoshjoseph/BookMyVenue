import { MapPin, Users, Wallet } from "lucide-react";
import { Venue } from "@/types/venue";

interface VenueInfoProps {
  venue: Venue;
}

export default function VenueInfo({ venue }: VenueInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-[#EBEBEB] pb-8">
      <div className="flex items-center gap-2 text-[15px] text-[#222222]">
        <Users className="h-5 w-5" />
        {venue.capacity} guests capacity
      </div>
      <div className="flex items-center gap-2 text-[15px] text-[#222222]">
        <MapPin className="h-5 w-5" />
        {venue.address}
      </div>
      <div className="flex items-center gap-2 text-[15px] text-[#222222]">
        <Wallet className="h-5 w-5" />
        ₹{venue.pricePerDay.toLocaleString()} / day
      </div>
    </div>
  );
}