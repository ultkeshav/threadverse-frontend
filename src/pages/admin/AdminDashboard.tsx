import {
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const stats = [
    {
      label: "Products",
      value: "—",
      icon: Package,
      path: "/admin/products",
    },
    {
      label: "Collections",
      value: "—",
      icon: Boxes,
      path: "/admin/collections",
    },
    {
      label: "Orders",
      value: "—",
      icon: ClipboardList,
      path: "/admin/orders",
    },
    {
      label: "Sales",
      value: "—",
      icon: ShoppingBag,
      path: "/admin/orders",
    },
  ];

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
          Overview
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#171717]">
          Dashboard.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#737373]">
          Manage your ThreadVerse catalog and
          customer orders from one place.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.path}
              className="group rounded-3xl border border-[#E8E6E1] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#F5C59C] hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF3E8] text-[#E97917]">
                  <Icon size={21} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-[#A1A19B] transition group-hover:text-[#E97917]"
                />
              </div>

              <p className="mt-7 text-sm font-semibold text-[#737373]">
                {stat.label}
              </p>

              <p className="mt-1 text-3xl font-black text-[#171717]">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
            Quick Actions
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              to="/admin/collections"
              className="rounded-2xl border border-[#E8E6E1] p-5 transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
            >
              <p className="font-bold">
                Create Collection
              </p>

              <p className="mt-1 text-xs text-[#737373]">
                Organize your catalog.
              </p>
            </Link>

            <Link
              to="/admin/series"
              className="rounded-2xl border border-[#E8E6E1] p-5 transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
            >
              <p className="font-bold">
                Create Series
              </p>

              <p className="mt-1 text-xs text-[#737373]">
                Add a new product series.
              </p>
            </Link>

            <Link
              to="/admin/products"
              className="rounded-2xl border border-[#E8E6E1] p-5 transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
            >
              <p className="font-bold">
                Manage Products
              </p>

              <p className="mt-1 text-xs text-[#737373]">
                Create and edit products.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="rounded-2xl border border-[#E8E6E1] p-5 transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
            >
              <p className="font-bold">
                Manage Orders
              </p>

              <p className="mt-1 text-xs text-[#737373]">
                Update order statuses.
              </p>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8E6E1] bg-[#171717] p-7 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            ThreadVerse Admin
          </p>

          <h2 className="mt-4 text-3xl font-black">
            Your store, under control.
          </h2>

          <p className="mt-4 text-sm leading-6 text-white/65">
            Products, collections, series,
            inventory, images, and orders will
            all be managed from this panel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;