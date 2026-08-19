import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../service/orderService";
import type { Order } from "../types/order";

function Orders() {
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getUserOrders(
          user.userId,
        );

        setOrders(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load orders.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated && user) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center sm:px-8">
          <Package
            size={32}
            className="text-[#F28C28]"
          />

          <h1 className="mt-6 text-4xl font-black">
            Sign in to view your orders.
          </h1>

          <Link
            to="/login"
            className="mt-7 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
          >
            Sign in
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        <section className="border-b border-[#EEEEEA] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#737373] transition hover:text-[#E97917]"
            >
              <ArrowLeft size={16} />
              Back to profile
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              My Account
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-[-0.06em]">
              My Orders.
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-36 animate-pulse rounded-3xl bg-[#F3F1EF]"
                    />
                  ),
                )}
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {!isLoading &&
              !error &&
              orders.length === 0 && (
                <div className="rounded-[2rem] border border-[#EEEEEA] bg-white px-6 py-20 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E8] text-[#E97917]">
                    <Package size={26} />
                  </div>

                  <h2 className="mt-6 text-3xl font-black">
                    No orders yet.
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#737373]">
                    Your completed orders will appear
                    here.
                  </p>

                  <Link
                    to="/products"
                    className="mt-8 inline-flex rounded-full bg-[#C0C0C0] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}

            {!isLoading &&
              !error &&
              orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.orderId}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="rounded-3xl border border-[#EEEEEA] bg-white p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                            Order #{order.orderId}
                          </p>

                          <h2 className="mt-2 text-xl font-black">
                            ₹
                            {order.totalAmount.toLocaleString(
                              "en-IN",
                            )}
                          </h2>

                          <p className="mt-2 text-sm text-[#737373]">
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "item"
                              : "items"}{" "}
                            · {order.paymentMethod}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <div className="text-right">
                            <span className="inline-flex rounded-full bg-[#FFF3E8] px-3 py-1.5 text-xs font-bold text-[#E97917]">
                              {order.orderStatus}
                            </span>

                            <p className="mt-2 text-xs text-[#737373]">
                              Payment:{" "}
                              {order.paymentStatus}
                            </p>
                          </div>

                          <Link
                            to={`/orders/${order.orderId}`}
                            className="rounded-full border border-[#E5E5E0] p-3 transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                            aria-label={`View order ${order.orderId}`}
                          >
                            <ChevronRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Orders;