import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import { getCart } from "../service/cartService";

import {
  addAddress,
  getAddresses,
} from "../service/addressService";

import { createOrder } from "../service/orderService";

import {
  createRazorpayOrder,
  verifyPayment,
} from "../service/paymentService";

import { loadRazorpay } from "../service/razorpayLoader";

import type {
  Address,
  AddAddressRequest,
} from "../types/address";

import type {
  CreateOrderRequest,
  PaymentMethod,
} from "../types/order";

import type { Cart } from "../types/cart";

function Checkout() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState<number | null>(null);

  /*
   * Backend still accepts:
   * COD / UPI / CARD / NET_BANKING
   *
   * Frontend now shows:
   * COD
   * Online Payment
   *
   * CARD is used internally for Online Payment.
   * Razorpay will provide UPI / Card / Net Banking.
   */
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [newAddress, setNewAddress] =
    useState<AddAddressRequest>({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");

  const [addressError, setAddressError] =
    useState("");

  /*
   * COD delivery charge.
   */
  const COD_DELIVERY_CHARGE = 49;

  /*
   * Product subtotal comes from cart.
   */
  const subtotal = cart?.totalAmount ?? 0;

  /*
   * COD = ₹49 delivery
   * Online = Free delivery
   */
  const deliveryCharge =
    paymentMethod === "COD"
      ? COD_DELIVERY_CHARGE
      : 0;

  /*
   * Final checkout amount.
   */
  const finalTotal =
    subtotal + deliveryCharge;

  /*
   * Load cart and addresses.
   */
  useEffect(() => {
    async function loadCheckout() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [
          cartData,
          addressData,
        ] = await Promise.all([
          getCart(user.userId),
          getAddresses(user.userId),
        ]);

        setCart(cartData);
        setAddresses(addressData);

        const defaultAddress =
          addressData.find(
            (address) => address.isDefault,
          );

        setSelectedAddressId(
          defaultAddress?.addressId ??
            addressData[0]?.addressId ??
            null,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load checkout.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated && user) {
      loadCheckout();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  /*
   * Address input.
   */
  const handleAddressInput = (
    field: keyof AddAddressRequest,
    value: string | boolean,
  ) => {
    setNewAddress((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * Add a new address.
   */
  const handleAddAddress = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      setAddressError("");

      const createdAddress =
        await addAddress(
          user.userId,
          newAddress,
        );

      setAddresses((current) => [
        ...current,
        createdAddress,
      ]);

      setSelectedAddressId(
        createdAddress.addressId,
      );

      setShowAddressForm(false);

      setNewAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    } catch (err) {
      setAddressError(
        err instanceof Error
          ? err.message
          : "Unable to add address.",
      );
    }
  };

  /*
   * Main order/payment flow.
   */
  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedAddressId) {
      setError(
        "Please select a delivery address.",
      );
      return;
    }

    if (
      !cart ||
      cart.items.length === 0
    ) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setError("");

      /*
       * Create ThreadVerse order.
       *
       * COD stays COD.
       * Online Payment internally uses CARD.
       */
      const request: CreateOrderRequest = {
        addressId: selectedAddressId,
        paymentMethod,
      };

      const order = await createOrder(
        user.userId,
        request,
      );

      /*
       * ============================
       * COD FLOW
       * ============================
       *
       * Backend:
       * Order   -> CONFIRMED
       * Payment -> PENDING
       *
       * COD delivery charge is already
       * included by the backend.
       */
      if (paymentMethod === "COD") {
        navigate(
          `/orders/${order.orderId}`,
        );

        return;
      }

      /*
       * ============================
       * ONLINE PAYMENT FLOW
       * ============================
       *
       * CARD is used internally for the
       * generic online-payment method.
       *
       * Razorpay handles:
       * - UPI
       * - Cards
       * - Net Banking
       */

      /*
       * Create Razorpay order.
       */
      const razorpayOrder =
        await createRazorpayOrder(
          user.userId,
          order.orderId,
        );

      /*
       * Load Razorpay Checkout.
       */
      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load.",
        );
      }

      /*
       * Razorpay options.
       */
      const options: RazorpayOptions = {
        key:
          razorpayOrder.razorpayKeyId,

        amount:
          razorpayOrder.amountInPaise,

        currency:
          razorpayOrder.currency,

        name: "ThreadVerse",

        description:
          `ThreadVerse Order #${order.orderId}`,

        order_id:
          razorpayOrder.razorpayOrderId,

        prefill: {
          name:
            razorpayOrder.customerName ||
            "",

          email:
            razorpayOrder.customerEmail ||
            "",

          contact:
            razorpayOrder.customerPhone
              ? `+91${razorpayOrder.customerPhone}`
              : "",
        },

        notes: {
          threadverseOrderId:
            String(order.orderId),
        },

        theme: {
          color: "#F28C28",
        },

        modal: {
          confirm_close: true,

          /*
           * User closes Razorpay.
           *
           * Stay on Checkout.
           * Don't clear cart.
           * Don't navigate Home.
           */
          ondismiss: () => {
            setIsPlacingOrder(false);

            setError(
              "Payment was cancelled. You can try again.",
            );
          },
        },

        /*
         * Razorpay success callback.
         */
        handler: async (
          response,
        ) => {
          console.log(
            "===== RAZORPAY PAYMENT SUCCESS CALLBACK =====",
          );

          console.log(
            "Razorpay response:",
            response,
          );

          try {
            setIsPlacingOrder(true);
            setError("");

            /*
             * Verify payment on Spring Boot.
             */
            const payment =
              await verifyPayment(
                user.userId,
                {
                  orderId:
                    order.orderId,

                  razorpayPaymentId:
                    response.razorpay_payment_id,

                  razorpayOrderId:
                    response.razorpay_order_id,

                  razorpaySignature:
                    response.razorpay_signature,
                },
              );

            console.log(
              "Backend verification response:",
              payment,
            );

            /*
             * Continue only when the backend
             * confirms SUCCESS.
             */
            if (
              payment.paymentStatus !==
              "SUCCESS"
            ) {
              throw new Error(
                "Payment verification failed.",
              );
            }

            /*
             * Backend should now have:
             *
             * Payment = SUCCESS
             * Order = CONFIRMED
             * Purchased cart items removed
             *
             * Now show the order confirmation.
             */
            navigate(
              `/orders/${order.orderId}`,
            );
          } catch (err) {
            console.error(
              "Payment verification error:",
              err,
            );

            setError(
              err instanceof Error
                ? err.message
                : "Payment verification failed.",
            );

            setIsPlacingOrder(false);
          }
        },
      };

      /*
       * Open Razorpay.
       */
      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

      /*
       * Razorpay now owns the payment UI.
       */
      setIsPlacingOrder(false);
    } catch (err) {
      console.error(
        "Checkout error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to process your order.",
      );

      setIsPlacingOrder(false);
    }
  };

  /*
   * ============================
   * NOT AUTHENTICATED
   * ============================
   */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center">
          <h1 className="text-4xl font-black">
            Sign in to checkout.
          </h1>

          <p className="mt-3 max-w-md text-sm text-[#737373]">
            Please sign in before continuing
            to checkout.
          </p>

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

  /*
   * ============================
   * LOADING
   * ============================
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="h-[500px] animate-pulse rounded-3xl bg-[#F3F1EF]" />

            <div className="h-[400px] animate-pulse rounded-3xl bg-[#F3F1EF]" />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>

        {/* ========================= */}
        {/* HEADER                    */}
        {/* ========================= */}

        <section className="border-b border-[#EEEEEA] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#737373] transition hover:text-[#E97917]"
            >
              <ArrowLeft size={16} />
              Back to cart
            </Link>

            <h1 className="mt-8 text-5xl font-black tracking-[-0.06em]">
              Checkout.
            </h1>
          </div>
        </section>

        {/* ========================= */}
        {/* CHECKOUT CONTENT           */}
        {/* ========================= */}

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_380px]">

            <div className="space-y-6">

              {/* ========================= */}
              {/* DELIVERY ADDRESS           */}
              {/* ========================= */}

              <div className="rounded-3xl border border-[#EEEEEA] bg-white p-7">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
                      Step 1
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Delivery Address
                    </h2>
                  </div>

                  <MapPin className="text-[#F28C28]" />
                </div>

                {addresses.length > 0 && (
                  <div className="mt-7 space-y-3">

                    {addresses.map(
                      (address) => {

                        const selected =
                          selectedAddressId ===
                          address.addressId;

                        return (
                          <button
                            key={
                              address.addressId
                            }
                            type="button"
                            onClick={() =>
                              setSelectedAddressId(
                                address.addressId,
                              )
                            }
                            className={`w-full rounded-2xl border p-5 text-left transition ${
                              selected
                                ? "border-[#F28C28] bg-[#FFF8F2]"
                                : "border-[#E5E5E0] hover:border-[#FFD6B4]"
                            }`}
                          >

                            <div className="flex items-start gap-3">

                              <span
                                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-[#F28C28] bg-[#F28C28] text-white"
                                    : "border-[#D8D8D2]"
                                }`}
                              >
                                {selected && (
                                  <Check size={12} />
                                )}
                              </span>

                              <div>

                                <p className="font-bold">
                                  {
                                    address.addressLine1
                                  }
                                </p>

                                {address.addressLine2 && (
                                  <p className="mt-1 text-sm text-[#737373]">
                                    {
                                      address.addressLine2
                                    }
                                  </p>
                                )}

                                <p className="mt-1 text-sm text-[#737373]">
                                  {address.city},{" "}
                                  {address.state}{" "}
                                  {
                                    address.postalCode
                                  }
                                </p>

                                <p className="mt-1 text-sm text-[#737373]">
                                  {
                                    address.country
                                  }
                                </p>

                                {address.isDefault && (
                                  <span className="mt-3 inline-flex rounded-full bg-[#FFF3E8] px-3 py-1 text-xs font-bold text-[#E97917]">
                                    Default
                                  </span>
                                )}

                              </div>

                            </div>

                          </button>
                        );
                      },
                    )}

                  </div>
                )}

                {/* Add address */}

                <button
                  type="button"
                  onClick={() =>
                    setShowAddressForm(
                      (value) => !value,
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#E5E5E0] px-5 py-3 text-sm font-bold transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                >
                  <Plus size={16} />
                  Add new address
                </button>

                {showAddressForm && (
                  <motion.form
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    onSubmit={
                      handleAddAddress
                    }
                    className="mt-6 space-y-4 border-t border-[#EEEEEA] pt-6"
                  >

                    {addressError && (
                      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {addressError}
                      </div>
                    )}

                    <input
                      required
                      value={
                        newAddress.addressLine1
                      }
                      onChange={(event) =>
                        handleAddressInput(
                          "addressLine1",
                          event.target.value,
                        )
                      }
                      placeholder="Address line 1"
                      className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 text-sm outline-none transition focus:border-[#F28C28]"
                    />

                    <input
                      value={
                        newAddress.addressLine2 ||
                        ""
                      }
                      onChange={(event) =>
                        handleAddressInput(
                          "addressLine2",
                          event.target.value,
                        )
                      }
                      placeholder="Address line 2 (optional)"
                      className="w-full rounded-2xl border border-[#E5E5E0] bg-white px-4 py-4 text-sm outline-none transition focus:border-[#F28C28]"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">

                      <input
                        required
                        value={newAddress.city}
                        onChange={(event) =>
                          handleAddressInput(
                            "city",
                            event.target.value,
                          )
                        }
                        placeholder="City"
                        className="rounded-2xl border border-[#E5E5E0] px-4 py-4 text-sm outline-none transition focus:border-[#F28C28]"
                      />

                      <input
                        required
                        value={newAddress.state}
                        onChange={(event) =>
                          handleAddressInput(
                            "state",
                            event.target.value,
                          )
                        }
                        placeholder="State"
                        className="rounded-2xl border border-[#E5E5E0] px-4 py-4 text-sm outline-none transition focus:border-[#F28C28]"
                      />

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <input
                        required
                        value={
                          newAddress.postalCode
                        }
                        onChange={(event) =>
                          handleAddressInput(
                            "postalCode",
                            event.target.value,
                          )
                        }
                        placeholder="Postal code"
                        className="rounded-2xl border border-[#E5E5E0] px-4 py-4 text-sm outline-none transition focus:border-[#F28C28]"
                      />

                      <input
                        required
                        value={
                          newAddress.country
                        }
                        onChange={(event) =>
                          handleAddressInput(
                            "country",
                            event.target.value,
                          )
                        }
                        placeholder="Country"
                        className="rounded-2xl border border-[#E5E5E0] px-4 py-4 text-sm outline-none transition focus:border-[#F28C28]"
                      />

                    </div>

                    <label className="flex items-center gap-3 text-sm font-semibold">

                      <input
                        type="checkbox"
                        checked={
                          newAddress.isDefault ||
                          false
                        }
                        onChange={(event) =>
                          handleAddressInput(
                            "isDefault",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 accent-[#F28C28]"
                      />

                      Make this my default address

                    </label>

                    <button
                      type="submit"
                      className="rounded-full bg-[#171717] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                    >
                      Save Address
                    </button>

                  </motion.form>
                )}

              </div>

              {/* ========================= */}
              {/* PAYMENT METHOD             */}
              {/* ========================= */}

              <div className="rounded-3xl border border-[#EEEEEA] bg-white p-7">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
                  Step 2
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Payment Method
                </h2>

                <div className="mt-7 space-y-3">

                  {/* COD */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "COD",
                      )
                    }
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      paymentMethod ===
                      "COD"
                        ? "border-[#F28C28] bg-[#FFF8F2]"
                        : "border-[#E5E5E0] bg-white hover:border-[#FFD6B4]"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          paymentMethod ===
                          "COD"
                            ? "border-[#F28C28] bg-[#F28C28]"
                            : "border-[#D8D8D2]"
                        }`}
                      >
                        {paymentMethod ===
                          "COD" && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>

                      <div>

                        <p className="font-bold">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-[#737373]">
                          Pay when your order arrives
                        </p>

                      </div>

                    </div>

                  </button>

                  {/* ONLINE PAYMENT */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "CARD",
                      )
                    }
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      paymentMethod !==
                      "COD"
                        ? "border-[#F28C28] bg-[#FFF8F2]"
                        : "border-[#E5E5E0] bg-white hover:border-[#FFD6B4]"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          paymentMethod !==
                          "COD"
                            ? "border-[#F28C28] bg-[#F28C28]"
                            : "border-[#D8D8D2]"
                        }`}
                      >
                        {paymentMethod !==
                          "COD" && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>

                      <div className="min-w-0">

                        <p className="font-bold">
                          Online Payment
                        </p>

                        <p className="mt-1 text-xs text-[#737373]">
                          UPI · Cards · Net Banking
                        </p>

                      </div>

                    </div>

                  </button>

                </div>

                <div className="mt-4 rounded-2xl bg-[#FFF8F2] px-4 py-3">

                  <p className="text-xs leading-5 text-[#737373]">
                    {paymentMethod ===
                    "COD"
                      ? "A ₹49 delivery charge applies to Cash on Delivery."
                      : "Online payments are securely processed through Razorpay. Choose UPI, Card, or Net Banking there."}
                  </p>

                </div>

              </div>

              {/* Error */}

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

            </div>

            {/* ========================= */}
            {/* ORDER SUMMARY              */}
            {/* ========================= */}

            <aside className="h-fit rounded-3xl border border-[#EEEEEA] bg-white p-7">

              <h2 className="text-xl font-black">
                Order Summary
              </h2>

              {/* Items */}

              <div className="mt-6 space-y-4">

                {cart?.items.map(
                  (item) => (
                    <div
                      key={
                        item.cartItemId
                      }
                      className="flex justify-between gap-4 text-sm"
                    >

                      <div>

                        <p className="font-semibold">
                          {
                            item.productName
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#737373]">
                          {item.size} ×{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <p className="font-bold">
                        ₹
                        {item.totalPrice.toLocaleString(
                          "en-IN",
                        )}
                      </p>

                    </div>
                  ),
                )}

              </div>

              <div className="my-6 border-t border-[#EEEEEA]" />

              {/* Subtotal */}

              <div className="flex justify-between text-sm">

                <span className="text-[#737373]">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </div>

              {/* Delivery */}

              <div className="mt-4 flex justify-between text-sm">

                <span className="text-[#737373]">
                  Delivery
                </span>

                <span
                  className={`font-semibold ${
                    deliveryCharge === 0
                      ? "text-green-600"
                      : "text-[#171717]"
                  }`}
                >
                  {deliveryCharge ===
                  0
                    ? "Free"
                    : `₹${deliveryCharge.toLocaleString(
                        "en-IN",
                      )}`}
                </span>

              </div>

              <div className="my-6 border-t border-[#EEEEEA]" />

              {/* Final Total */}

              <div className="flex justify-between">

                <span className="font-bold">
                  Total
                </span>

                <span className="text-xl font-black">
                  ₹
                  {finalTotal.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </div>

              {/* Main Button */}

              <button
                type="button"
                disabled={
                  isPlacingOrder ||
                  !selectedAddressId ||
                  !cart ||
                  cart.items.length === 0
                }
                onClick={
                  handlePlaceOrder
                }
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <ShieldCheck size={18} />

                {isPlacingOrder
                  ? paymentMethod ===
                    "COD"
                    ? "Placing order..."
                    : "Opening Payment..."
                  : paymentMethod ===
                    "COD"
                  ? "Place Order"
                  : "Proceed to Payment"}

              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#737373]">

                {paymentMethod ===
                "COD"
                  ? "Payment will be collected when your order is delivered."
                  : "Razorpay will securely handle UPI, Card, and Net Banking payments."}

              </p>

            </aside>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Checkout;