import { motion } from "framer-motion";
import {
  Heart,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getActiveProducts,
  getProductImages,
} from "../service/productService";
import type {
  Product,
  ProductImage,
} from "../types/product";

interface ProductWithImage extends Product {
  image?: ProductImage;
}

function NewDrops() {
  const [products, setProducts] = useState<
    ProductWithImage[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const productData =
          await getActiveProducts();

        const productsWithImages =
          await Promise.all(
            productData.map(async (product) => {
              try {
                const images =
                  await getProductImages(
                    product.productId,
                  );

                const sortedImages = [
                  ...images,
                ].sort(
                  (a, b) =>
                    a.displayOrder -
                    b.displayOrder,
                );

                return {
                  ...product,
                  image: sortedImages[0],
                };
              } catch {
                return {
                  ...product,
                  image: undefined,
                };
              }
            }),
          );

        setProducts(productsWithImages);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-[#EEEEEA] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F28C28]">
              ThreadVerse
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              New Drops.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#737373]">
              Discover the latest pieces available
              in ThreadVerse.
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">

            {/* Loading */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map(
                  (_, index) => (
                    <div key={index}>
                      <div className="aspect-[4/5] animate-pulse rounded-3xl bg-[#F3F1EF]" />

                      <div className="mt-4 h-5 animate-pulse rounded-lg bg-[#F3F1EF]" />

                      <div className="mt-2 h-4 w-2/3 animate-pulse rounded-lg bg-[#F3F1EF]" />
                    </div>
                  ),
                )}
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
                <p className="text-sm font-semibold text-red-600">
                  {error}
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-sm font-bold text-white"
                >
                  <RefreshCw size={16} />
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading &&
              !error &&
              products.length === 0 && (
                <div className="rounded-3xl border border-[#EEEEEA] bg-white p-16 text-center">
                  <h2 className="text-2xl font-black">
                    No products available
                  </h2>

                  <p className="mt-3 text-sm text-[#737373]">
                    New ThreadVerse drops will appear
                    here.
                  </p>
                </div>
              )}

            {/* Product Grid */}
            {!isLoading &&
              !error &&
              products.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map(
                    (product, index) => (
                      <motion.article
                        key={product.productId}
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.04,
                        }}
                        className="group"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#EEEEEA] bg-[#FFF8F2]">

                          {product.image ? (
                            <img
                              src={
                                product.image
                                  .imageUrl
                              }
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#FFF8F2]">
                              <div className="h-2/3 w-2/3 rounded-[2rem] bg-white shadow-sm" />
                            </div>
                          )}

                          {/* Badge */}
                          {product.newArrival && (
                            <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                              New Drop
                            </span>
                          )}

                          {/* Wishlist */}
                          <button
                            className="absolute right-4 top-4 z-10 rounded-full bg-white p-2.5 opacity-0 shadow-sm transition group-hover:opacity-100"
                            aria-label={`Add ${product.name} to wishlist`}
                          >
                            <Heart size={16} />
                          </button>

                          {/* Product link */}
                          <Link
                            to={`/products/${product.productId}`}
                            className="absolute bottom-5 left-5 rounded-full bg-[#D3D3D3] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#F28C28]"
                          >
                            View product
                          </Link>
                        </div>

                        {/* Product info */}
                        <div className="mt-5 flex justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate font-bold">
                              {product.name}
                            </h2>

                            <p className="mt-1 text-xs text-[#737373]">
                              {product.seriesName}
                            </p>
                          </div>

                          <p className="shrink-0 font-black">
                            ₹
                            {product.price.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </motion.article>
                    ),
                  )}
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default NewDrops;