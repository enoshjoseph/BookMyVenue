
import Image from "next/image";
import { MapPin, Share, Heart, Camera } from "lucide-react";
import { Venue } from "@/types/venue";

interface VenueHeroProps {
  venue: Venue;
}

export default function VenueHero({ venue }: VenueHeroProps) {
  const images = venue?.images || [];
  const hasImages = images.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8">
      {/* Title row sits above the gallery, Airbnb-style */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold text-[#222222]">{venue.name}</h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#222222]">
            <MapPin className="h-4 w-4" />
            <span className="underline underline-offset-2">{venue.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-[#222222] underline underline-offset-2 hover:bg-[#F7F7F7]">
            <Share className="h-4 w-4" />
            Share
          </button>
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-[#222222] underline underline-offset-2 hover:bg-[#F7F7F7]">
            <Heart className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Gallery rendering */}
      {!hasImages ? (
        <div className="relative mt-5 flex h-[420px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <Camera className="h-8 w-8 text-indigo-300" />
          </div>
          <span className="text-lg font-semibold tracking-wide">No photos uploaded yet</span>
          <span className="text-xs text-slate-400">The venue owner will add gallery images soon</span>
        </div>
      ) : images.length === 1 ? (
        <div className="relative mt-5 h-[420px] w-full overflow-hidden rounded-2xl shadow-md">
          <Image src={images[0]} alt={venue.name} fill sizes="100vw" priority className="object-cover" />
        </div>
      ) : (
        <div className="mt-5 grid h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl shadow-md">
          <div className="relative col-span-2 row-span-2">
            <Image src={images[0]} alt={venue.name} fill sizes="50vw" priority className="object-cover transition duration-300 hover:scale-105" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => {
            const src = images[(i + 1) % images.length];
            return (
              <div key={i} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt={`${venue.name} photo ${i + 2}`}
                  fill
                  sizes="25vw"
                  unoptimized
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}