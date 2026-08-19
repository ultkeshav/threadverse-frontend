import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "Series", path: "/series" },
    { name: "New Drops", path: "/products" },
    { name: "About Us", path: "/about" },
  ];

  const userInitial =
    user?.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <div className="bg-[#171717] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.12em] text-white">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      <header className="sticky top-0 z-50 border-b border-[#EEEEEA] bg-[#FCFCFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-black tracking-[-0.06em]"
          >
            THREAD
            <span className="text-[#F28C28]">
              VERSE
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#F28C28]"
                      : "text-[#737373] hover:text-[#F28C28]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-1 sm:flex">
            <button
              className="rounded-full p-3 transition hover:bg-[#FFF3E8]"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.8} />
            </button>

            <Link
              to={
                isAuthenticated
                  ? "/profile"
                  : "/login"
              }
              aria-label="Wishlist"
              className="rounded-full p-3 transition hover:bg-[#FFF3E8]"
            >
              <Heart size={18} strokeWidth={1.8} />
            </Link>

            <Link
              to={
                isAuthenticated
                  ? "/cart"
                  : "/login"
              }
              aria-label="Cart"
              className="rounded-full p-3 transition hover:bg-[#FFF3E8]"
            >
              <ShoppingBag
                size={18}
                strokeWidth={1.8}
              />
            </Link>

            <Link
              to={
                isAuthenticated
                  ? "/profile"
                  : "/login"
              }
              aria-label="Account"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#FFF3E8]"
            >
              {isAuthenticated ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF3E8] text-sm font-bold text-[#E97917]">
                  {userInitial}
                </span>
              ) : (
                <User
                  size={18}
                  strokeWidth={1.8}
                />
              )}
            </Link>
          </div>

          <button
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            className="rounded-full p-3 transition hover:bg-[#FFF3E8] sm:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#EEEEEA] bg-white px-5 py-5 sm:hidden">
            <nav className="flex flex-col gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className="text-base font-semibold"
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-2 flex gap-2 border-t border-[#EEEEEA] pt-5">
                <Link
                  to={
                    isAuthenticated
                      ? "/profile"
                      : "/login"
                  }
                  onClick={closeMenu}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E5E5E0] bg-white px-4 py-3 text-sm font-semibold"
                >
                  <User size={16} />

                  {isAuthenticated
                    ? "My Profile"
                    : "Login"}
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex flex-1 items-center justify-center rounded-full bg-[#FFFFFF] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;