import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  CreditCard,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import {
  getOrderById,
  cancelOrder,
} from "../service/orderService";
import type { Order } from "../types/order";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isCancelling, setIsCancelling] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!user || !orderId) {
        setIsLoading(false);
        return;
      }

      const id = Number(orderId);

      if (!Number.isInteger(id) || id <= 0) {
        setError("Invalid order ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getOrderById(
          user.userId,
          id,
        );

        setOrder(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated && user) {
      loadOrder();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, orderId]);

  const handleCancelOrder = async () => {
    if (!user || !order) {
      return;
    }

    try {
      setIsCancelling(true);
      setError("");

      const updatedOrder =
        await cancelOrder(
          user.userId,
          order.orderId,
        );

      setOrder(updatedOrder);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel order.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center sm:px-8">
          <h1 className="text-4xl font-black">
            Sign in to view your order.
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#737373]">
            Please sign in to view your order details.
          </p>

          <Link
            to="/login"
            className="mt-8 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
          >
            Sign in
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
          <div className="h-10 w-48 animate-pulse rounded bg-[#F3F1EF]" />

          <div className="mt-8 h-[500px] animate-pulse rounded-[2rem] bg-[#F3F1EF]" />
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto flex max-w-5xl flex-col items-center px-5 py-32 text-center sm:px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Package size={28} />
          </div>

          <h1 className="mt-6 text-4xl font-black">
            Order unavailable
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#737373]">
            {error ||
              "We couldn't find this order."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </main>

        <Footer />
      </div>
    );
  }

  const isConfirmed =
    order.orderStatus === "CONFIRMED";

  const isCancelled =
    order.orderStatus === "CANCELLED";

  const paymentSuccessful =
    order.paymentStatus === "SUCCESS";

  const canCancel =
    !isCancelled &&
    order.orderStatus !== "DELIVERED" &&
    order.orderStatus !== "SHIPPED";

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        {/* Confirmation Header */}
        <section className="border-b border-[#EEEEEA] bg-white">
          <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
              }}
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                isCancelled
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-600"
              }`}
            >
              <CheckCircle2 size={42} />
            </motion.div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-[#E97917]">
              Order #{order.orderId}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {isCancelled
                ? "Order Cancelled"
                : isConfirmed
                  ? "Order Confirmed"
                  : "Order Processing"}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#737373]">
              {isCancelled
                ? "This order has been cancelled."
                : isConfirmed
                  ? "Your order has been successfully placed and is now available in My Orders."
                  : "Your order is being processed. Payment confirmation may still be pending."}
            </p>
          </div>
        </section>

        {/* Order Content */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl space-y-6 px-5 sm:px-8">
            {/* Status Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#EEEEEA] bg-white p-6">
                <div className="flex items-center gap-3">
                  <Package
                    size={20}
                    className="text-[#F28C28]"
                  />

                  <p className="text-xs font-bold uppercase tracking-wide text-[#9A9A94]">
                    Order Status
                  </p>
                </div>

                <p className="mt-4 text-lg font-black">
                  {order.orderStatus}
                </p>
              </div>

              <div className="rounded-3xl border border-[#EEEEEA] bg-white p-6">
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={20}
                    className="text-[#F28C28]"
                  />

                  <p className="text-xs font-bold uppercase tracking-wide text-[#9A9A94]">
                    Payment
                  </p>
                </div>

                <p
                  className={`mt-4 text-lg font-black ${
                    paymentSuccessful
                      ? "text-green-600"
                      : "text-[#E97917]"
                  }`}
                >
                  {order.paymentStatus}
                </p>
              </div>

              <div className="rounded-3xl border border-[#EEEEEA] bg-white p-6">
                <div className="flex items-center gap-3">
                  <Clock
                    size={20}
                    className="text-[#F28C28]"
                  />

                  <p className="text-xs font-bold uppercase tracking-wide text-[#9A9A94]">
                    Method
                  </p>
                </div>

                <p className="mt-4 text-lg font-black">
                  {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Payment Confirmation */}
            <div className="rounded-[2rem] border border-[#EEEEEA] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    paymentSuccessful
                      ? "bg-green-50 text-green-600"
                      : "bg-[#FFF3E8] text-[#E97917]"
                  }`}
                >
                  {paymentSuccessful ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    {paymentSuccessful
                      ? "Payment Confirmed"
                      : order.paymentMethod ===
                          "COD"
                        ? "Cash on Delivery"
                        : "Payment Pending"}
                  </h2>

                  <p className="mt-1 text-sm text-[#737373]">
                    {paymentSuccessful
                      ? "Your online payment has been successfully verified."
                      : order.paymentMethod ===
                          "COD"
                        ? "Payment will be collected when your order is delivered."
                        : "Complete the payment process to confirm this order."}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-[2rem] border border-[#EEEEEA] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <Package
                  size={21}
                  className="text-[#F28C28]"
                />

                <h2 className="text-xl font-black">
                  Ordered Items
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {order.items.map(
                  (item, index) => (
                    <motion.div
                      key={`${item.productName}-${item.size}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="flex flex-col gap-4 rounded-2xl border border-[#EEEEEA] p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-bold">
                          {item.productName}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#737373]">
                          <span>
                            Size: {item.size}
                          </span>

                          <span>
                            Quantity: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <p className="font-black">
                        ₹
                        {(
                          item.unitPrice *
                          item.quantity
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </motion.div>
                  ),
                )}
              </div>
            </div>

            {/* Total */}
            <div className="rounded-[2rem] border border-[#EEEEEA] bg-white p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#737373]">
                    Total Amount
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>

                <span className="rounded-full bg-[#FFF3E8] px-4 py-2 text-xs font-bold text-[#E97917]">
                  {order.orderStatus}
                </span>
              </div>

              {error && (
                <p className="mt-5 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {/* THIS ALWAYS GOES HOME */}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 rounded-2xl bg-[#171717] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                >
                  Back to Home
                </button>

                <Link
                  to="/orders"
                  className="flex-1 rounded-2xl border border-[#E5E5E0] bg-white px-6 py-4 text-center text-sm font-bold transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                >
                  View My Orders
                </Link>
              </div>

              {/* Cancel */}
              {canCancel && (
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={handleCancelOrder}
                  className="mt-4 w-full rounded-2xl border border-red-100 px-5 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default OrderDetails;