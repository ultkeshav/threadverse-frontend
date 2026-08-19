import {
  BarChart3,
  Boxes,
  ClipboardList,
  Image,
  Layers3,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  onClose?: () => void;
}

function AdminSidebar({
  onClose,
}: AdminSidebarProps) {
  const navigate = useNavigate();

  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: BarChart3,
    },
    {
      label: "Collections",
      path: "/admin/collections",
      icon: Boxes,
    },
    {
      label: "Series",
      path: "/admin/series",
      icon: Layers3,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Variants",
      path: "/admin/variants",
      icon: ShoppingBag,
    },
    {
      label: "Images",
      path: "/admin/images",
      icon: Image,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ClipboardList,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("threadverse_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-[#E8E6E1] bg-[#171717] text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F28C28]">
          ThreadVerse
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#F28C28] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ShoppingBag size={18} />
          View Store
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;