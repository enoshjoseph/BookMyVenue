import Link from "next/link";
import { Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            BookMyVenue
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-400">
            Find the perfect venue for weddings, birthdays,
            corporate events, parties and every special occasion.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link href="/venues" className="hover:text-white">
                Venues
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>support@bookmyvenue.com</span>
            </div>

            <div className="flex gap-4 pt-2 text-xl">
            <FaFacebook className="cursor-pointer transition hover:text-white" />
            <FaInstagram className="cursor-pointer transition hover:text-white" />
            <FaLinkedin className="cursor-pointer transition hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BookMyVenue. All rights reserved.
      </div>
    </footer>
  );
}