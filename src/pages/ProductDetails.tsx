import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import {
  addCartItem,
  getCart,
  updateCartItem,
} from "../service/cartService";

import {
  getProductById,
  getProductImages,
  getProductVariants,
} from "../service/productService";

import type {
  Product,
  ProductImage,
  ProductVariant,
} from "../types/product";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [images, setImages] = useState<ProductImage[]>(
    [],
  );

  const [variants, setVariants] = useState<
    ProductVariant[]
  >([]);

  const [selectedImage, setSelectedImage] =
    useState<ProductImage | null>(null);

  const [selectedSize, setSelectedSize] =
    useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

const [cartLoading, setCartLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [cartMessage, setCartMessage] =
    useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError("Product ID is missing.");
        setIsLoading(false);
        return;
      }

      const id = Number(productId);

      if (!Number.isInteger(id) || id <= 0) {
        setError("Invalid product ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        setCartMessage("");

        const [
          productData,
          imageData,
          variantData,
        ] = await Promise.all([
          getProductById(id),
          getProductImages(id),
          getProductVariants(id),
        ]);

        const sortedImages = [...imageData].sort(
          (a, b) =>
            a.displayOrder - b.displayOrder,
        );

        setProduct(productData);
        setImages(sortedImages);
        setVariants(variantData);

        setSelectedImage(
          sortedImages.length > 0
            ? sortedImages[0]
            : null,
        );

        const firstAvailableVariant =
          variantData.find(
            (variant) =>
              variant.available &&
              variant.stock > 0,
          );

        setSelectedSize(
          firstAvailableVariant?.size || null,
        );

        setQuantity(1);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this product.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (variant) =>
          variant.size === selectedSize,
      ) || null,
    [variants, selectedSize],
  );

  const maxQuantity =
    selectedVariant?.stock || 1;

  const handleQuantityChange = (
    change: number,
  ) => {
    setQuantity((current) => {
      const next = current + change;

      if (next < 1) {
        return 1;
      }

      if (next > maxQuantity) {
        return maxQuantity;
      }

      return next;
    });
  };

  const handleAddToCart = async () => {
    setCartMessage("");

    if (!product || !selectedVariant) {
      setCartMessage(
        "Please select an available size.",
      );
      return;
    }

    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);

      /*
       * First get the current cart.
       * We need this to determine whether
       * this exact variant already exists.
       */
      const currentCart = await getCart(
        user.userId,
      );

      /*
       * Cart uniqueness is based on variantId.
       *
       * Same product + same size
       * = same variantId
       *
       * Same product + different size
       * = different variantId
       */
      const existingItem =
        currentCart.items.find(
          (item) =>
            item.variantId ===
            selectedVariant.variantId,
        );

      if (existingItem) {
        /*
         * Same variant already exists.
         * Increase the existing cart item's
         * quantity instead of creating a new row.
         */
        const newQuantity =
          existingItem.quantity + quantity;

        /*
         * Never allow quantity above
         * available stock.
         */
        if (
          newQuantity >
          selectedVariant.stock
        ) {
          setCartMessage(
            `Only ${selectedVariant.stock} item${
              selectedVariant.stock === 1
                ? ""
                : "s"
            } available in stock.`,
          );
          return;
        }

        await updateCartItem(
          user.userId,
          existingItem.cartItemId,
          {
            quantity: newQuantity,
          },
        );

        setCartMessage(
          `Cart updated. Quantity is now ${newQuantity}.`,
        );
      } else {
        /*
         * This variant doesn't exist in the cart.
         * Create a new cart item.
         */
        await addCartItem(user.userId, {
          variantId:
            selectedVariant.variantId,
          quantity,
        });

        setCartMessage(
          "Added to cart successfully.",
        );
      }
    } catch (err) {
      setCartMessage(
        err instanceof Error
          ? err.message
          : "Unable to add item to cart.",
      );
    } finally {
      setCartLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-[#F3F1EF]" />

            <div className="space-y-6">
              <div className="h-4 w-24 animate-pulse rounded bg-[#F3F1EF]" />

              <div className="h-12 w-3/4 animate-pulse rounded-xl bg-[#F3F1EF]" />

              <div className="h-7 w-32 animate-pulse rounded bg-[#F3F1EF]" />

              <div className="h-24 animate-pulse rounded-2xl bg-[#F3F1EF]" />

              <div className="h-20 animate-pulse rounded-2xl bg-[#F3F1EF]" />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <Navbar />

        <main className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center sm:px-8">
          <div className="rounded-full bg-[#FFF3E8] p-5 text-[#E97917]">
            <ShoppingBag size={28} />
          </div>

          <h1 className="mt-6 text-4xl font-black">
            Product unavailable
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#737373]">
            {error ||
              "We couldn't find the product you're looking for."}
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#F28C28]"
          >
            <ArrowLeft size={16} />
            Back to New Drops
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
        {/* Back */}
        <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#737373] transition hover:text-[#E97917]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Product */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            {/* Gallery */}
            <div>
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#EEEEEA] bg-[#FFF8F2]"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-2/3 w-2/3 rounded-[2rem] bg-white shadow-sm" />
                  </div>
                )}

                {product.newArrival && (
                  <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                    New Drop
                  </span>
                )}

                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute right-5 top-5 rounded-full bg-white p-3 shadow-sm transition hover:bg-[#FFF3E8]"
                >
                  <Heart size={18} />
                </button>
              </motion.div>

              {/* Image thumbnails */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image) => (
                    <button
                      key={image.imageId}
                      type="button"
                      onClick={() =>
                        setSelectedImage(image)
                      }
                      className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-[#FFF8F2] ${
                        selectedImage?.imageId ===
                        image.imageId
                          ? "border-[#F28C28]"
                          : "border-[#EEEEEA]"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E97917]">
                {product.seriesName}
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <p className="text-2xl font-black">
                  ₹
                  {product.price.toLocaleString(
                    "en-IN",
                  )}
                </p>

                {product.bestSeller && (
                  <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-xs font-bold text-[#E97917]">
                    Best Seller
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-6 text-sm leading-7 text-[#737373]">
                  {product.description}
                </p>
              )}

              {/* Size */}
              <div className="mt-9">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold">
                    Select size
                  </h2>

                  {selectedVariant && (
                    <span className="text-xs text-[#737373]">
                      {selectedVariant.stock} available
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {variants.map((variant) => {
                    const disabled =
                      !variant.available ||
                      variant.stock <= 0;

                    const selected =
                      selectedSize ===
                      variant.size;

                    return (
                      <button
                        key={variant.variantId}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setSelectedSize(
                            variant.size,
                          );
                          setQuantity(1);
                          setCartMessage("");
                        }}
                        className={`min-w-16 rounded-xl border px-5 py-3 text-sm font-bold transition ${
                          disabled
                            ? "cursor-not-allowed border-[#EEEEEA] bg-[#F7F7F4] text-[#B0B0AA] line-through"
                            : selected
                              ? "border-[#F28C28] bg-[#FFF3E8] text-[#E97917]"
                              : "border-[#E5E5E0] bg-white hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>

                {variants.length === 0 && (
                  <p className="mt-3 text-sm text-red-600">
                    No sizes are currently available.
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mt-8">
                <h2 className="text-sm font-bold">
                  Quantity
                </h2>

                <div className="mt-4 inline-flex items-center overflow-hidden rounded-xl border border-[#E5E5E0] bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(-1)
                    }
                    disabled={quantity <= 1}
                    className="p-3 transition hover:bg-[#FFF3E8] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="min-w-12 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(1)
                    }
                    disabled={
                      quantity >= maxQuantity
                    }
                    className="p-3 transition hover:bg-[#FFF3E8] disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {/* Stock */}
              <div className="mt-7 flex items-center gap-2 text-sm">
                {selectedVariant &&
                selectedVariant.stock > 0 &&
                selectedVariant.available ? (
                  <>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <Check size={14} />
                    </span>

                    <span className="font-semibold text-green-700">
                      In stock
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-red-600">
                    Select an available size
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                disabled={
                  !selectedVariant ||
                  cartLoading
                }
                onClick={handleAddToCart}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#171717] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={19} />

                {cartLoading
                  ? "Adding..."
                  : "Add to cart"}
              </button>

              {/* Cart message */}
              {cartMessage && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={`mt-3 text-center text-sm font-semibold ${
                    cartMessage.includes(
                      "successfully",
                    ) ||
                    cartMessage.includes(
                      "updated",
                    )
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {cartMessage}
                </motion.p>
              )}

              {/* View Cart */}
              <Link
                to="/cart"
                className="mt-4 flex w-full items-center justify-center rounded-2xl border border-[#E5E5E0] bg-white px-6 py-4 text-sm font-bold transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
              >
                View Cart
              </Link>

              {/* Extra info */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#EEEEEA] bg-white p-4">
                  <p className="text-sm font-bold">
                    Premium feel
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#737373]">
                    Designed for everyday streetwear.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EEEEEA] bg-white p-4">
                  <p className="text-sm font-bold">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#737373]">
                    Your order information stays
                    protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;