import {
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() =>
                setSidebarOpen(false)
              }
            />

            <div className="relative h-full w-72">
              <AdminSidebar
                onClose={() =>
                  setSidebarOpen(false)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(false)
                }
                className="absolute right-3 top-5 rounded-lg bg-white/10 p-2 text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#E8E6E1] bg-white/95 px-5 backdrop-blur sm:px-7">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 text-[#555] hover:bg-[#F3F1EC] lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="ml-3 lg:ml-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                Administration
              </p>

              <p className="text-sm font-bold text-[#171717]">
                ThreadVerse
              </p>
            </div>
          </header>

          <main className="p-5 sm:p-7 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;