import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { series } from "../data/demoData";

function Series() {
  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        <section className="border-b border-[#EEEEEA] bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              Fandom
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              Choose your universe.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#737373]">
              A visual showcase of the worlds and fandoms that inspire
              ThreadVerse.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {series.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl border border-[#EEEEEA] bg-white p-5 shadow-sm"
                >
                  <div className="aspect-[1.4] rounded-2xl bg-[#FFF8F2]" />

                  <div className="mt-5 flex items-center justify-between">
                    <h2 className="text-xl font-black">{item}</h2>

                    <Link
                      to="/products"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E0] transition group-hover:bg-[#FFF3E8]"
                    >
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Series;