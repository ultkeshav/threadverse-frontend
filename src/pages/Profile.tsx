import { motion } from "framer-motion";
import {
  ArrowLeft,
  LogOut,
  Mail,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center">
          <h1 className="text-4xl font-black">
            Please sign in first.
          </h1>

          <Link
            to="/login"
            className="mt-7 rounded-full bg-[#171717] px-6 py-3 text-sm font-bold text-white"
          >
            Go to Login
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  const fullName =
    `${user.firstName} ${user.lastName}`.trim();

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        <section className="border-b border-[#EEEEEA] bg-[#FFF8F2]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#737373]"
            >
              <ArrowLeft size={16} />
              Back to ThreadVerse
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              My Account
            </p>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-black text-[#E97917] shadow-sm">
                {initials}
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-[-0.05em]">
                  {fullName}
                </h1>

                <p className="mt-2 text-sm text-[#737373]">
                  {user.email}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-[#FFF3E8] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#E97917]">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-[#EEEEEA] bg-white p-7 shadow-sm lg:col-span-2"
            >
              <div className="flex items-center gap-3">
                <User
                  size={20}
                  className="text-[#F28C28]"
                />

                <h2 className="text-xl font-black">
                  Personal Information
                </h2>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9A9A94]">
                    First Name
                  </p>
                  <p className="mt-2 font-semibold">
                    {user.firstName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9A9A94]">
                    Last Name
                  </p>
                  <p className="mt-2 font-semibold">
                    {user.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9A9A94]">
                    Email
                  </p>

                  <p className="mt-2 flex items-center gap-2 font-semibold">
                    <Mail size={16} />
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9A9A94]">
                    Role
                  </p>

                  <p className="mt-2 font-semibold">
                    {user.role}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="rounded-3xl border border-[#EEEEEA] bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black">
                Account
              </h2>

              <div className="mt-6 space-y-3">
                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-2xl border border-[#EEEEEA] px-4 py-4 text-sm font-semibold transition hover:bg-[#FFF8F2]"
                >
                  <Package size={18} />
                  My Orders
                </Link>

                <Link
                  to="/addresses"
                  className="flex items-center gap-3 rounded-2xl border border-[#EEEEEA] px-4 py-4 text-sm font-semibold transition hover:bg-[#FFF8F2]"
                >
                  <MapPin size={18} />
                  Addresses
                </Link>

                <button
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#EEEEEA] px-4 py-4 text-left text-sm font-semibold transition hover:bg-[#FFF8F2]"
                >
                  <Settings size={18} />
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl border border-red-100 px-4 py-4 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-[#FFE0C7] bg-[#FFF3E8] p-7 lg:col-span-3">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
                    ThreadVerse Member
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Welcome back, {user.firstName}.
                  </h2>

                  <p className="mt-2 text-sm text-[#6A625D]">
                    Your orders, addresses and account information will
                    appear here.
                  </p>
                </div>

                <Link
                  to="/products"
                  className="rounded-full bg-[#FFFFFF] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;