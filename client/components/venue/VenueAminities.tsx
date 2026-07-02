import { Venue } from "@/types/venue";

interface VenueAmenitiesProps {
  venue: Venue;
}

export default function VenueAmenities({ venue }: VenueAmenitiesProps) {
  if (venue.amenities.length === 0) return null;

  return (
    <div className="border-b border-[#EBEBEB] py-8">
      <h3 className="text-xl font-semibold text-[#222222]">What this place offers</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {venue.amenities.map((amenity) => (
          <div key={amenity} className="flex items-center gap-3 text-[15px] text-[#222222]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#222222]/40" />
            {amenity}
          </div>
        ))}
      </div>
    </div>
  );
}