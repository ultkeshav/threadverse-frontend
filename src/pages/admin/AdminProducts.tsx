import {
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../service/productService";

import { getSeries } from "../../service/seriesService";

import {
  createProductVariant,
} from "../../service/variantService";

import {
  createProductImage,
} from "../../service/imageService";

import type {
  Product,
  CreateProductRequest,
} from "../../types/product";

import type { Series } from "../../types/series";

const ADMIN_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
] as const;

type AdminSize =
  (typeof ADMIN_SIZES)[number];

interface SizeForm {
  selected: boolean;
  stock: string;
}

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [series, setSeries] =
    useState<Series[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [seriesId, setSeriesId] =
    useState<number | "">("");

  const [featured, setFeatured] =
    useState(false);

  const [bestSeller, setBestSeller] =
    useState(false);

  const [newArrival, setNewArrival] =
    useState(false);

  const [active, setActive] =
    useState(true);

  const [imageUrl, setImageUrl] =
    useState("");

  const [sizeForms, setSizeForms] =
    useState<
      Record<AdminSize, SizeForm>
    >({
      XS: {
        selected: false,
        stock: "",
      },
      S: {
        selected: false,
        stock: "",
      },
      M: {
        selected: false,
        stock: "",
      },
      L: {
        selected: false,
        stock: "",
      },
      XL: {
        selected: false,
        stock: "",
      },
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  /*
   * ============================
   * LOAD PRODUCTS + SERIES
   * ============================
   */

  async function loadData() {
    try {
      setIsLoading(true);
      setError("");

      const [
        productData,
        seriesData,
      ] = await Promise.all([
        getProducts(),
        getSeries(),
      ]);

      setProducts(productData);
      setSeries(seriesData);
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

  useEffect(() => {
    loadData();
  }, []);

  /*
   * ============================
   * RESET FORM
   * ============================
   */

  function resetSizeForms() {
    setSizeForms({
      XS: {
        selected: false,
        stock: "",
      },
      S: {
        selected: false,
        stock: "",
      },
      M: {
        selected: false,
        stock: "",
      },
      L: {
        selected: false,
        stock: "",
      },
      XL: {
        selected: false,
        stock: "",
      },
    });
  }

  function resetForm() {
    setEditingProduct(null);

    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setSeriesId("");

    setFeatured(false);
    setBestSeller(false);
    setNewArrival(false);
    setActive(true);

    setImageUrl("");

    resetSizeForms();
  }

  /*
   * ============================
   * OPEN CREATE FORM
   * ============================
   */

  function openCreateForm() {
    resetForm();

    setError("");
    setIsFormOpen(true);
  }

  /*
   * ============================
   * OPEN EDIT FORM
   * ============================
   */

  function openEditForm(
    product: Product,
  ) {
    /*
     * Existing products are edited here.
     *
     * Variants and images can still be
     * managed from the Manage page.
     */
    setEditingProduct(product);

    setName(product.name);
    setSlug(product.slug);

    setDescription(
      product.description || "",
    );

    setPrice(
      String(product.price),
    );

    setSeriesId(product.seriesId);

    setFeatured(
      product.featured ?? false,
    );

    setBestSeller(
      product.bestSeller ?? false,
    );

    setNewArrival(
      product.newArrival ?? false,
    );

    setActive(
      product.active ?? true,
    );

    /*
     * Don't recreate existing variants
     * or images during edit.
     */
    setImageUrl("");
    resetSizeForms();

    setError("");
    setIsFormOpen(true);
  }

  /*
   * ============================
   * CLOSE FORM
   * ============================
   */

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    resetForm();
  }

  /*
   * ============================
   * SLUG GENERATOR
   * ============================
   */

  function generateSlug(
    value: string,
  ): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /*
   * ============================
   * SIZE HELPERS
   * ============================
   */

  function toggleSize(
    size: AdminSize,
  ) {
    setSizeForms((current) => ({
      ...current,
      [size]: {
        ...current[size],
        selected:
          !current[size].selected,
      },
    }));
  }

  function updateStock(
    size: AdminSize,
    value: string,
  ) {
    setSizeForms((current) => ({
      ...current,
      [size]: {
        ...current[size],
        stock: value,
      },
    }));
  }

  /*
   * ============================
   * VALIDATE SELECTED SIZES
   * ============================
   */

  function validateSizes(): boolean {
    const selectedSizes =
      ADMIN_SIZES.filter(
        (size) =>
          sizeForms[size].selected,
      );

    /*
     * Product must have at least one
     * size when creating.
     */
    if (
      !editingProduct &&
      selectedSizes.length === 0
    ) {
      setError(
        "Select at least one product size.",
      );

      return false;
    }

    for (const size of selectedSizes) {
      const stockValue =
        Number(sizeForms[size].stock);

      if (
        sizeForms[size].stock.trim() ===
          "" ||
        Number.isNaN(stockValue) ||
        stockValue < 0 ||
        !Number.isInteger(stockValue)
      ) {
        setError(
          `Enter a valid stock quantity for size ${size}.`,
        );

        return false;
      }
    }

    return true;
  }

  /*
   * ============================
   * SAVE PRODUCT
   * ============================
   */

  async function handleSave() {
    if (!name.trim()) {
      setError(
        "Product name is required.",
      );
      return;
    }

    if (!slug.trim()) {
      setError(
        "Product slug is required.",
      );
      return;
    }

    if (!price.trim()) {
      setError(
        "Price is required.",
      );
      return;
    }

    const numericPrice =
      Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      setError(
        "Price must be a valid number greater than or equal to 0.",
      );
      return;
    }

    if (!seriesId) {
      setError(
        "Please select a series.",
      );
      return;
    }

    /*
     * Only require sizes and image during
     * creation.
     *
     * Editing remains focused on product
     * details; variants/images can be
     * managed from Manage.
     */
    if (!editingProduct) {
      if (!validateSizes()) {
        return;
      }

      if (!imageUrl.trim()) {
        setError(
          "Product image URL is required.",
        );

        return;
      }
    }

    try {
      setIsSaving(true);
      setError("");

      const request: CreateProductRequest = {
        name: name.trim(),
        slug: slug.trim(),
        description:
          description.trim() ||
          undefined,
        price: numericPrice,
        featured,
        bestSeller,
        newArrival,
        active,
        seriesId: Number(seriesId),
      };

      /*
       * ============================
       * EDIT EXISTING PRODUCT
       * ============================
       */

      if (editingProduct) {
        const updated =
          await updateProduct(
            editingProduct.productId,
            request,
          );

        setProducts((current) =>
          current.map((product) =>
            product.productId ===
            updated.productId
              ? updated
              : product,
          ),
        );

        closeForm();

        return;
      }

      /*
       * ============================
       * CREATE PRODUCT
       * ============================
       */

      const created =
        await createProduct(request);

      /*
       * Keep track of whether
       * creation of child resources
       * succeeds.
       */
      try {
        /*
         * ==========================
         * CREATE VARIANTS
         * ==========================
         */

        const selectedSizes =
          ADMIN_SIZES.filter(
            (size) =>
              sizeForms[size].selected,
          );

        await Promise.all(
          selectedSizes.map(
            (size) =>
              createProductVariant({
                productId:
                  created.productId,

                /*
                 * Backend enum accepts
                 * XS, S, M, L, XL, XXL.
                 *
                 * We only expose five options
                 * in this admin UI.
                 */
                size,

                stock: Number(
                  sizeForms[size].stock,
                ),

                available:
                  Number(
                    sizeForms[size].stock,
                  ) > 0,
              }),
          ),
        );

        /*
         * ==========================
         * CREATE FIRST IMAGE
         * ==========================
         */

        await createProductImage({
          productId:
            created.productId,

          imageUrl:
            imageUrl.trim(),

          displayOrder: 0,
        });
      } catch (childError) {
        /*
         * The product itself already exists.
         *
         * We don't delete it automatically
         * because we don't want to accidentally
         * hide a backend failure.
         */
        console.error(
          "Product created but variant/image creation failed:",
          childError,
        );

        setError(
          "Product was created, but adding the sizes or image failed. Open Manage to finish setup.",
        );

        setProducts((current) => [
          created,
          ...current,
        ]);

        return;
      }

      setProducts((current) => [
        created,
        ...current,
      ]);

      closeForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save product.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  /*
   * ============================
   * DELETE PRODUCT
   * ============================
   */

  async function handleDelete(
    product: Product,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        product.productId,
      );

      setError("");

      await deleteProduct(
        product.productId,
      );

      setProducts((current) =>
        current.filter(
          (item) =>
            item.productId !==
            product.productId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * ============================
   * SEARCH
   * ============================
   */

  const filteredProducts =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(keyword) ||
          product.slug
            .toLowerCase()
            .includes(keyword) ||
          (
            product.seriesName || ""
          )
            .toLowerCase()
            .includes(keyword),
      );
    }, [products, search]);

  /*
   * ============================
   * RENDER
   * ============================
   */

  return (
    <div>
      {/* ============================
          HEADER
          ============================ */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#171717]">
            Products.
          </h1>

          <p className="mt-3 text-sm text-[#737373]">
            Create and manage products,
            sizes, stock, and images.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}

          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-[#E3E1DC] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#F28C28] sm:w-64"
            />
          </div>

          {/* Refresh */}

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3E1DC] bg-white px-4 py-3 text-sm font-bold transition hover:border-[#F28C28] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* New Product */}

          <button
            type="button"
            onClick={openCreateForm}
            disabled={
              series.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />

            New Product
          </button>
        </div>
      </div>

      {/* ============================
          SERIES WARNING
          ============================ */}

      {!isLoading &&
        series.length === 0 && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
            Create at least one series before
            creating a product.
          </div>
        )}

      {/* ============================
          ERROR
          ============================ */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* ============================
          LOADING
          ============================ */}

      {isLoading && (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      )}

      {/* ============================
          EMPTY
          ============================ */}

      {!isLoading &&
        filteredProducts.length ===
          0 && (
          <div className="mt-8 rounded-3xl border border-[#E8E6E1] bg-white px-6 py-20 text-center">
            <h2 className="text-2xl font-black">
              {search
                ? "No matching products."
                : "No products yet."}
            </h2>

            <p className="mt-2 text-sm text-[#737373]">
              {search
                ? "Try a different search."
                : "Create your first product to start building your catalog."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openCreateForm}
                disabled={
                  series.length === 0
                }
                className="mt-6 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:opacity-50"
              >
                Create Product
              </button>
            )}
          </div>
        )}

      {/* ============================
          PRODUCT GRID
          ============================ */}

      {!isLoading &&
        filteredProducts.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map(
              (product) => (
                <div
                  key={product.productId}
                  className="rounded-3xl border border-[#E8E6E1] bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E97917]">
                        Product #
                        {product.productId}
                      </p>

                      <h2 className="mt-2 truncate text-xl font-black">
                        {product.name}
                      </h2>

                      <p className="mt-1 truncate text-xs text-[#737373]">
                        /{product.slug}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        product.active
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {product.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-2xl font-black">
                      ₹
                      {product.price.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#737373]">
                      {product.seriesName ||
                        `Series #${product.seriesId}`}
                    </p>
                  </div>

                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-[#737373]">
                    {product.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.featured && (
                      <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-xs font-bold text-[#E97917]">
                        Featured
                      </span>
                    )}

                    {product.bestSeller && (
                      <span className="rounded-full bg-[#F3F1EC] px-3 py-1 text-xs font-bold text-[#555]">
                        Best Seller
                      </span>
                    )}

                    {product.newArrival && (
                      <span className="rounded-full bg-[#EEF7FF] px-3 py-1 text-xs font-bold text-blue-600">
                        New Arrival
                      </span>
                    )}
                  </div>

                  {/* Actions */}

                  <div className="mt-6 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/products/${product.productId}`,
                        )
                      }
                      className="flex flex-1 items-center justify-center rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28]"
                    >
                      Manage
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(
                          product,
                        )
                      }
                      className="rounded-xl border border-[#E3E1DC] px-4 py-3 text-[#555] transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        product.productId
                      }
                      onClick={() =>
                        handleDelete(
                          product,
                        )
                      }
                      className="rounded-xl border border-red-100 px-4 py-3 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

      {/* ============================
          PRODUCT MODAL
          ============================ */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-5 py-8">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-7 shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Catalog
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {editingProduct
                    ? "Edit Product"
                    : "New Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-xl p-2 text-[#737373] transition hover:bg-[#F3F1EC] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 space-y-7">

              {/* ============================
                  BASIC DETAILS
                  ============================ */}

              <section>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Product Details
                </p>

                <div className="mt-4 space-y-5">

                  {/* Name + Slug */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-[#333]">
                        Product Name
                      </label>

                      <input
                        value={name}
                        onChange={(event) => {
                          const value =
                            event.target.value;

                          setName(value);

                          if (
                            !editingProduct
                          ) {
                            setSlug(
                              generateSlug(
                                value,
                              ),
                            );
                          }
                        }}
                        placeholder="Hokage Oversized Tee"
                        className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#333]">
                        Slug
                      </label>

                      <input
                        value={slug}
                        onChange={(event) =>
                          setSlug(
                            event.target.value,
                          )
                        }
                        placeholder="hokage-oversized-tee"
                        className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                      />
                    </div>
                  </div>

                  {/* Price + Series */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-[#333]">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(event) =>
                          setPrice(
                            event.target.value,
                          )
                        }
                        placeholder="799"
                        className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#333]">
                        Series
                      </label>

                      <select
                        value={seriesId}
                        onChange={(event) =>
                          setSeriesId(
                            event.target
                              .value
                              ? Number(
                                  event.target
                                    .value,
                                )
                              : "",
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-[#E3E1DC] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                      >
                        <option value="">
                          Select a series
                        </option>

                        {series.map(
                          (item) => (
                            <option
                              key={
                                item.seriesId
                              }
                              value={
                                item.seriesId
                              }
                            >
                              {item.name}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Description */}

                  <div>
                    <label className="text-sm font-bold text-[#333]">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target
                            .value,
                        )
                      }
                      rows={4}
                      placeholder="Premium anime-inspired oversized streetwear tee..."
                      className="mt-2 w-full resize-none rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                    />
                  </div>

                </div>
              </section>

              {/* ============================
                  SIZES + STOCK
                  ============================ */}

              {!editingProduct && (
                <section>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                    Sizes & Stock
                  </p>

                  <p className="mt-2 text-sm text-[#737373]">
                    Select the sizes available for
                    this product and set their stock.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {ADMIN_SIZES.map(
                      (size) => {
                        const item =
                          sizeForms[size];

                        return (
                          <div
                            key={size}
                            className={`rounded-2xl border p-4 transition ${
                              item.selected
                                ? "border-[#F28C28] bg-[#FFF8F2]"
                                : "border-[#E3E1DC] bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={
                                  item.selected
                                }
                                onChange={() =>
                                  toggleSize(
                                    size,
                                  )
                                }
                                className="h-4 w-4 accent-[#F28C28]"
                              />

                              <span className="w-10 font-black">
                                {size}
                              </span>

                              {item.selected && (
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    item.stock
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateStock(
                                      size,
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  placeholder="Stock"
                                  className="min-w-0 flex-1 rounded-lg border border-[#E3E1DC] bg-white px-3 py-2 text-sm outline-none focus:border-[#F28C28]"
                                />
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              )}

              {/* ============================
                  PRODUCT IMAGE
                  ============================ */}

              {!editingProduct && (
                <section>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                    Product Image
                  </p>

                  <label className="mt-4 block text-sm font-bold text-[#333]">
                    Image URL
                  </label>

                  <input
                    value={imageUrl}
                    onChange={(event) =>
                      setImageUrl(
                        event.target.value,
                      )
                    }
                    placeholder="https://example.com/product-image.jpg"
                    className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                  />

                  {imageUrl.trim() && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-[#E8E6E1] bg-[#FFF8F2]">
                      <div className="aspect-[4/3]">
                        <img
                          src={
                            imageUrl.trim()
                          }
                          alt="Product preview"
                          className="h-full w-full object-cover"
                          onError={(
                            event,
                          ) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-[#737373]">
                    This image will become the first
                    product image with display order 0.
                  </p>
                </section>
              )}

              {/* ============================
                  PRODUCT SETTINGS
                  ============================ */}

              <section>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Product Settings
                </p>

                <div className="mt-4 rounded-2xl bg-[#F8F7F3] p-5">
                  <div className="grid gap-4 sm:grid-cols-2">

                    <label className="flex items-center gap-3 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(event) =>
                          setFeatured(
                            event.target
                              .checked,
                          )
                        }
                        className="h-4 w-4 accent-[#F28C28]"
                      />

                      Featured
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={
                          bestSeller
                        }
                        onChange={(event) =>
                          setBestSeller(
                            event.target
                              .checked,
                          )
                        }
                        className="h-4 w-4 accent-[#F28C28]"
                      />

                      Best Seller
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={
                          newArrival
                        }
                        onChange={(event) =>
                          setNewArrival(
                            event.target
                              .checked,
                          )
                        }
                        className="h-4 w-4 accent-[#F28C28]"
                      />

                      New Arrival
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(event) =>
                          setActive(
                            event.target
                              .checked,
                          )
                        }
                        className="h-4 w-4 accent-[#F28C28]"
                      />

                      Active
                    </label>

                  </div>
                </div>
              </section>
            </div>

            {/* ============================
                ACTIONS
                ============================ */}

            <div className="mt-8 flex justify-end gap-3 border-t border-[#EEEEEA] pt-6">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-xl border border-[#E3E1DC] px-5 py-3 text-sm font-bold text-[#444] transition hover:bg-[#F5F3EF] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !name.trim() ||
                  !slug.trim() ||
                  !price.trim() ||
                  !seriesId
                }
                className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Creating..."
                  : editingProduct
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;