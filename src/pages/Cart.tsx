import { motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../service/cartService";
import type { Cart } from "../types/cart";

function CartPage() {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart] =
    useState<Cart | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadCart = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await getCart(user.userId);

      setCart(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load cart.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleQuantityChange = async (
    cartItemId: number,
    quantity: number,
  ) => {
    if (!user || quantity < 1) {
      return;
    }

    try {
      setError("");

      const updatedCart =
        await updateCartItem(
          user.userId,
          cartItemId,
          { quantity },
        );

      setCart(updatedCart);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update cart.",
      );
    }
  };

  const handleRemove = async (
    cartItemId: number,
  ) => {
    if (!user) {
      return;
    }

    try {
      setError("");

      await removeCartItem(
        user.userId,
        cartItemId,
      );

      await loadCart();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove item.",
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center sm:px-8">
          <div className="rounded-full bg-[#FFF3E8] p-5 text-[#E97917]">
            <ShoppingBag size={30} />
          </div>

          <h1 className="mt-6 text-4xl font-black">
            Your cart is waiting.
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#737373]">
            Sign in to view your cart and continue
            shopping.
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

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        <section className="border-b border-[#EEEEEA] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#737373] transition hover:text-[#E97917]"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>

            <h1 className="mt-8 text-5xl font-black tracking-[-0.06em]">
              Your Cart.
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {/* Loading */}
            {isLoading && (
              <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                <div className="h-40 animate-pulse rounded-3xl bg-[#F3F1EF]" />

                <div className="h-80 animate-pulse rounded-3xl bg-[#F3F1EF]" />
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Empty cart */}
            {!isLoading &&
              !error &&
              cart &&
              cart.items.length === 0 && (
                <div className="rounded-[2rem] border border-[#EEEEEA] bg-white px-6 py-20 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E8] text-[#E97917]">
                    <ShoppingBag size={26} />
                  </div>

                  <h2 className="mt-6 text-3xl font-black">
                    Your cart is empty.
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#737373]">
                    Discover something you love and
                    add it to your ThreadVerse cart.
                  </p>

                  <Link
                    to="/products"
                    className="mt-8 inline-flex rounded-full bg-[#C0C0C0] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                  >
                    Explore New Drops
                  </Link>
                </div>
              )}

            {/* Cart items */}
            {!isLoading &&
              !error &&
              cart &&
              cart.items.length > 0 && (
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                  <div className="space-y-4">
                    {cart.items.map(
                      (item, index) => (
                        <motion.div
                          key={item.cartItemId}
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
                          className="rounded-3xl border border-[#EEEEEA] bg-white p-5 sm:p-6"
                        >
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <h2 className="text-lg font-black">
                                {item.productName}
                              </h2>

                              <p className="mt-1 text-sm text-[#737373]">
                                Size: {item.size}
                              </p>

                              <p className="mt-2 text-sm font-semibold">
                                ₹
                                {item.unitPrice.toLocaleString(
                                  "en-IN",
                                )}{" "}
                                each
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-5 sm:justify-end">
                              <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#E5E5E0]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cartItemId,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={
                                    item.quantity <= 1
                                  }
                                  className="p-3 hover:bg-[#FFF3E8] disabled:opacity-40"
                                >
                                  <Minus size={15} />
                                </button>

                                <span className="min-w-10 text-center text-sm font-bold">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cartItemId,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="p-3 hover:bg-[#FFF3E8]"
                                >
                                  <Plus size={15} />
                                </button>
                              </div>

                              <p className="min-w-20 text-right font-black">
                                ₹
                                {item.totalPrice.toLocaleString(
                                  "en-IN",
                                )}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemove(
                                    item.cartItemId,
                                  )
                                }
                                className="rounded-full p-2.5 text-[#737373] transition hover:bg-red-50 hover:text-red-600"
                                aria-label={`Remove ${item.productName}`}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ),
                    )}
                  </div>

                  {/* Summary */}
                  <aside className="h-fit rounded-3xl border border-[#EEEEEA] bg-white p-7">
                    <h2 className="text-xl font-black">
                      Order Summary
                    </h2>

                    <div className="mt-7 space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#737373]">
                          Subtotal
                        </span>

                        <span className="font-semibold">
                          ₹
                          {cart.totalAmount.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#737373]">
                          Shipping
                        </span>

                        <span className="font-semibold">
                          Calculated at checkout
                        </span>
                      </div>
                    </div>

                    <div className="my-6 border-t border-[#EEEEEA]" />

                    <div className="flex justify-between">
                      <span className="font-bold">
                        Total
                      </span>

                      <span className="text-xl font-black">
                        ₹
                        {cart.totalAmount.toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    {/* FIXED */}
                    <Link
                      to="/checkout"
                      className="mt-7 flex w-full items-center justify-center rounded-2xl bg-[#C0C0C0] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                    >
                      Proceed to Checkout
                    </Link>
                  </aside>
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;