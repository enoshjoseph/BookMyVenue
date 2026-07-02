
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { Venue } from "@/types/venue";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const image =
    venue.images.length > 0 ? venue.images[0] : "/placeholder.jpg";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        
        {/* Image */}
        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={image}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-600 backdrop-blur">
            {venue.type}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <div>
            <h2 className="line-clamp-1 text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
              {venue.name}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="text-red-500" />
              <span>{venue.city}</span>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 flex-1 text-sm leading-6 text-gray-600">
            {venue.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} className="text-indigo-500" />
                <span>{venue.capacity} Guests</span>
              </div>

              <p className="mt-2 text-2xl font-bold text-indigo-600">
                ₹{venue.pricePerDay.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / day
                </span>
              </p>
            </div>

            <Link
              href={`/venues/${venue.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700"
            >
              View Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}