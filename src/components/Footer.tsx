import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#EEEEEA] bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black tracking-[-0.06em]"
            >
              THREAD<span className="text-[#F28C28]">VERSE</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#737373]">
              Anime-inspired streetwear for people who wear their fandom
              with pride.
            </p>

            <a
              href="mailto:hello@threadverse.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E5E5E0] px-4 py-3 text-sm font-semibold transition hover:bg-[#FFF3E8]"
            >
              <Mail size={17} />
              Contact us
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold">Shop</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#737373]">
              <Link to="/products">New Drops</Link>
              <Link to="/collections">Collections</Link>
              <Link to="/series">Series</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Company</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#737373]">
              <Link to="/about">About Us</Link>
              <Link to="/about">Our Story</Link>
              <a href="mailto:hello@threadverse.com">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Support</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#737373]">
              <Link to="/about">Shipping</Link>
              <Link to="/about">Returns</Link>
              <Link to="/about">FAQs</Link>
              <Link to="/about">Privacy</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[#EEEEEA] pt-8 text-xs text-[#9A9A94] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ThreadVerse. All rights reserved.</p>
          <p>Made with fandom, code &amp; caffeine.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;