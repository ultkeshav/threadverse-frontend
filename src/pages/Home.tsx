import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { collections, products, series } from "../data/demoData";

function Home() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#171717]">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#FFE4CC] blur-3xl" />
          <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-[#FFF8F2] blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:pb-32 lg:pt-24">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFE4CC] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E97917] shadow-sm"
              >
                <Sparkles size={14} />
                Anime × Streetwear
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.065em] sm:text-6xl lg:text-8xl"
              >
                Wear your
                <span className="block text-[#F28C28]">universe.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mt-7 max-w-xl text-base leading-7 text-[#737373] sm:text-lg"
              >
                Anime-inspired streetwear for people who carry their fandom
                everywhere they go.
              </motion.p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#FFFFF] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#F28C28]"
                >
                  Explore the drop
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/about"
                  className="rounded-full border border-[#E5E5E0] bg-white px-7 py-4 text-sm font-bold transition hover:-translate-y-1 hover:bg-[#FFF3E8]"
                >
                  Our story
                </Link>
              </div>
            </div>

            <motion.div
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7 }}
  className="relative"
>
  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#EEEEEA] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">
    <div className="relative flex h-full items-end overflow-hidden rounded-[1.5rem] bg-[#FFF8F2] p-8">

      {/* Demo Product Image */}
      <img
        src="https://res.cloudinary.com/dbhshe7qu/image/upload/v1787160641/trending_o8shwh.webp"
        alt="ThreadVerse product"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute right-[-70px] top-[-50px] h-72 w-72 rounded-full bg-[#FFE4CC]" />

      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E97917]">
          ThreadVerse / 001
        </p>

        <h2 className="mt-3 max-w-sm text-4xl font-black leading-none tracking-[-0.05em] sm:text-5xl">
          Your fandom.
          <br />
          Your identity.
        </h2>

        <Link
          to="/collections"
          className="mt-6 inline-flex rounded-full bg-[#FFFFF] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#F28C28]"
        >
          Explore the universe
        </Link>
      </div>

    </div>
  </div>
</motion.div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-y border-[#EEEEEA] bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#EEEEEA] sm:grid-cols-4">
            {[
              ["Premium feel", "Built for everyday wear"],
              ["Fast delivery", "Across India"],
              ["Secure checkout", "Protected payments"],
              ["Easy support", "We have your back"],
            ].map(([title, text]) => (
              <div key={title} className="px-5 py-7 text-center sm:px-8">
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-1 text-xs text-[#737373]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Collection Preview */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F28C28]">
                  Explore
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
                  Find your corner.
                </h2>
              </div>

              <Link
                to="/collections"
                className="hidden items-center gap-2 text-sm font-bold text-[#E97917] sm:flex"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-3xl border border-[#EEEEEA] bg-white p-3 shadow-sm"
                >
                  <div className="aspect-[1.15] rounded-2xl bg-[#FFF8F2]" />

                  <div className="p-4">
                    <h3 className="text-xl font-black">{collection.name}</h3>
                    <p className="mt-2 text-sm text-[#737373]">
                      {collection.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/collections"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#E97917] sm:hidden"
            >
              View all collections
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Series Preview */}
        <section className="bg-[#FAFAF8] py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              Your favourites
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Choose your universe.
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              {series.slice(0, 6).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#E5E5E0] bg-white px-5 py-3 text-sm font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>

            <Link
              to="/series"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#E97917]"
            >
              Explore all series
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Product Preview */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F28C28]">
                  New Drops
                </p>

                <h2 className="mt-3 text-4xl font-black">
                  The ThreadVerse edit.
                </h2>
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 text-sm font-bold text-[#E97917] sm:flex"
              >
                Shop everything
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.id}>
                  <div className="aspect-[4/5] rounded-3xl border border-[#EEEEEA] bg-[#FFF8F2]" />

                  <div className="mt-4 flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="mt-1 text-xs text-[#737373]">
                        {product.category}
                      </p>
                    </div>

                    <p className="font-black">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#E97917] sm:hidden"
            >
              Shop everything
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#171717] px-7 py-14 text-white sm:px-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F6B57D]">
              Stay in the loop
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em]">
              New drops.
              <br />
              No spoilers.
            </h2>

            <Link
              to="/products"
              className="mt-8 inline-flex rounded-full bg-[#F28C28] px-6 py-3.5 text-sm font-bold text-white"
            >
              Explore drops
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;