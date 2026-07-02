// // import { Venue } from "@/types/venue";

// // interface AboutVenueProps {
// //   venue: Venue;
// // }

// // export default function AboutVenue({ venue }: AboutVenueProps) {
// //   return (
// //     <div className="rounded-2xl border bg-white p-8 shadow-sm">
// //       <h2 className="text-3xl font-bold text-gray-900">
// //         About Venue
// //       </h2>

// //       <p className="mt-6 text-lg leading-8 text-gray-600">
// //         {venue.description}
// //       </p>
// //     </div>
// //   );
// // }

// import { MapPin, Users, Wallet } from "lucide-react";
// import { Venue } from "@/types/venue";

// interface AboutVenueProps {
//   venue: Venue;
// }

// export default function AboutVenue({ venue }: AboutVenueProps) {
//   return (
//     <div className="rounded-md border border-[#0F3D2E]/12 bg-white p-8">
//       <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1B2B22]">
//         About this venue
//       </h2>

//       <p className="mt-5 text-[15px] leading-relaxed text-[#1B2B22]/70">
//         {venue.description}
//       </p>

//       <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#0F3D2E]/10 pt-6 sm:grid-cols-3">
//         <div className="flex items-center gap-2.5 text-sm text-[#1B2B22]/70">
//           <MapPin className="h-4 w-4 flex-shrink-0 text-[#C9A227]" />
//           <span>{venue.address}</span>
//         </div>
//         <div className="flex items-center gap-2.5 text-sm text-[#1B2B22]/70">
//           <Users className="h-4 w-4 flex-shrink-0 text-[#0F3D2E]" />
//           <span>{venue.capacity} guests capacity</span>
//         </div>
//         <div className="flex items-center gap-2.5 text-sm text-[#1B2B22]/70">
//           <Wallet className="h-4 w-4 flex-shrink-0 text-[#0F3D2E]" />
//           <span>₹{venue.pricePerDay.toLocaleString()} / day</span>
//         </div>
//       </div>

//       {venue.amenities.length > 0 && (
//         <div className="mt-6 border-t border-[#0F3D2E]/10 pt-6">
//           <span className="text-xs font-medium uppercase tracking-wider text-[#1B2B22]/40">
//             Amenities
//           </span>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {venue.amenities.map((amenity) => (
//               <span
//                 key={amenity}
//                 className="rounded-full border border-[#0F3D2E]/15 bg-[#FAF6EE] px-3 py-1 text-xs font-medium text-[#1B2B22]/70"
//               >
//                 {amenity}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { MapPin, Users, Wallet } from "lucide-react";
import { Venue } from "@/types/venue";

interface AboutVenueProps {
  venue: Venue;
}

export default function AboutVenue({ venue }: AboutVenueProps) {
  return (
    <div className="border-b border-[#EBEBEB] pb-8">
      <div className="flex items-center gap-6 border-b border-[#EBEBEB] pb-6">
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

      <p className="mt-6 text-[16px] leading-relaxed text-[#222222]">
        {venue.description}
      </p>

      {venue.amenities.length > 0 && (
        <div className="mt-8">
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
      )}
    </div>
  );
}