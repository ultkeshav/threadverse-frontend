import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { collections } from "../data/demoData";

function Collections() {
  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        <section className="border-b border-[#EEEEEA] bg-[#FFF8F2]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              ThreadVerse
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              Collections.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#737373]">
              Different worlds, different moods, one place to express
              yourself.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {collections.map((collection, index) => (
                <motion.article
                  key={collection.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="group overflow-hidden rounded-[2rem] border border-[#EEEEEA] bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[1.7] rounded-[1.5rem] bg-[#FFF3E8]" />

                  <div className="flex items-end justify-between gap-6 p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                        {collection.label}
                      </p>

                      <h2 className="mt-2 text-3xl font-black">
                        {collection.name}
                      </h2>

                      <p className="mt-2 max-w-md text-sm leading-6 text-[#737373]">
                        {collection.description}
                      </p>
                    </div>

                    <Link
                      to="/products"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white transition group-hover:bg-[#F28C28]"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Collections;