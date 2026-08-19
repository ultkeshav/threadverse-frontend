import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        <section className="border-b border-[#EEEEEA] bg-[#FFF8F2]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              Our Story
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              More than clothing.
              <span className="block text-[#F28C28]">
                It is your identity.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#737373]">
              ThreadVerse is built around a simple idea: the things you love
              become part of who you are. We combine fandom culture,
              streetwear energy, and modern design into one universe.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-2">
            {[
              [
                "01",
                "Fandom First",
                "The worlds, characters and communities that inspire us deserve more than passive appreciation.",
              ],
              [
                "02",
                "Modern Fits",
                "We combine cultural references with clean, contemporary streetwear aesthetics.",
              ],
              [
                "03",
                "Built To Express",
                "ThreadVerse is about giving people another way to express what they love.",
              ],
              [
                "04",
                "One Universe",
                "Different fandoms, different identities, one place to bring them together.",
              ],
            ].map(([number, title, text], index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[2rem] border border-[#EEEEEA] bg-white p-8 shadow-sm"
              >
                <span className="text-4xl font-black text-[#F28C28]">
                  {number}
                </span>

                <h2 className="mt-8 text-2xl font-black">{title}</h2>

                <p className="mt-4 leading-7 text-[#737373]">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#171717] px-7 py-14 text-white sm:px-12 sm:py-16 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F6B57D]">
                ThreadVerse
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Your fandom. Your identity.
              </h2>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#F28C28] px-6 py-3.5 text-sm font-bold"
            >
              Explore the drops
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;