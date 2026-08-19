import {
  ArrowLeft,
  Edit3,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getProductById,
} from "../../service/productService";

import {
  createProductVariant,
  deleteProductVariant,
  getProductVariants,
  updateProductVariant,
} from "../../service/variantService";

import {
  createProductImage,
  deleteProductImage,
  getProductImages,
  updateProductImage,
} from "../../service/imageService";

import type {
  Product,
  ProductImage,
  ProductVariant,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  CreateProductImageRequest,
  UpdateProductImageRequest,
} from "../../types/product";

function AdminProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const numericProductId =
    Number(productId);

  const [product, setProduct] =
    useState<Product | null>(null);

  const [variants, setVariants] =
    useState<ProductVariant[]>([]);

  const [images, setImages] =
    useState<ProductImage[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [variantModalOpen, setVariantModalOpen] =
    useState(false);

  const [imageModalOpen, setImageModalOpen] =
    useState(false);

  const [editingVariant, setEditingVariant] =
    useState<ProductVariant | null>(null);

  const [editingImage, setEditingImage] =
    useState<ProductImage | null>(null);

  const [size, setSize] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [available, setAvailable] =
    useState(true);

  const [imageUrl, setImageUrl] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState("0");

  const [isSaving, setIsSaving] =
    useState(false);

  const [deletingVariantId, setDeletingVariantId] =
    useState<number | null>(null);

  const [deletingImageId, setDeletingImageId] =
    useState<number | null>(null);

  async function loadData() {
    if (
      !Number.isInteger(numericProductId) ||
      numericProductId <= 0
    ) {
      setError("Invalid product ID.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [
        productData,
        variantData,
        imageData,
      ] = await Promise.all([
        getProductById(numericProductId),
        getProductVariants(numericProductId),
        getProductImages(numericProductId),
      ]);

      setProduct(productData);
      setVariants(variantData);

      setImages(
        [...imageData].sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [productId]);

  function resetVariantForm() {
    setEditingVariant(null);
    setSize("");
    setStock("");
    setAvailable(true);
  }

  function resetImageForm() {
    setEditingImage(null);
    setImageUrl("");
    setDisplayOrder("0");
  }

  function openCreateVariant() {
    resetVariantForm();
    setError("");
    setVariantModalOpen(true);
  }

  function openEditVariant(
    variant: ProductVariant,
  ) {
    setEditingVariant(variant);
    setSize(variant.size);
    setStock(String(variant.stock));
    setAvailable(variant.available);
    setError("");
    setVariantModalOpen(true);
  }

  function closeVariantModal() {
    if (isSaving) {
      return;
    }

    setVariantModalOpen(false);
    resetVariantForm();
  }

  function openCreateImage() {
    resetImageForm();
    setError("");
    setImageModalOpen(true);
  }

  function openEditImage(
    image: ProductImage,
  ) {
    setEditingImage(image);
    setImageUrl(image.imageUrl);
    setDisplayOrder(
      String(image.displayOrder),
    );
    setError("");
    setImageModalOpen(true);
  }

  function closeImageModal() {
    if (isSaving) {
      return;
    }

    setImageModalOpen(false);
    resetImageForm();
  }

  async function handleSaveVariant() {
    if (!size.trim()) {
      setError("Size is required.");
      return;
    }

    const numericStock =
      Number(stock);

    if (
      Number.isNaN(numericStock) ||
      numericStock < 0
    ) {
      setError(
        "Stock must be a valid number greater than or equal to 0.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      if (editingVariant) {
        const request:
          UpdateProductVariantRequest = {
          size: size.trim(),
          stock: numericStock,
          available,
        };

        const updated =
          await updateProductVariant(
            editingVariant.variantId,
            request,
          );

        setVariants((current) =>
          current.map((variant) =>
            variant.variantId ===
            updated.variantId
              ? updated
              : variant,
          ),
        );
      } else {
        const request:
          CreateProductVariantRequest = {
          productId:
            numericProductId,
          size: size.trim(),
          stock: numericStock,
          available,
        };

        const created =
          await createProductVariant(
            request,
          );

        setVariants((current) => [
          ...current,
          created,
        ]);
      }

      closeVariantModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save variant.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteVariant(
    variant: ProductVariant,
  ) {
    const confirmed =
      window.confirm(
        `Delete size "${variant.size}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingVariantId(
        variant.variantId,
      );
      setError("");

      await deleteProductVariant(
        variant.variantId,
      );

      setVariants((current) =>
        current.filter(
          (item) =>
            item.variantId !==
            variant.variantId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete variant.",
      );
    } finally {
      setDeletingVariantId(null);
    }
  }

  async function handleSaveImage() {
    if (!imageUrl.trim()) {
      setError("Image URL is required.");
      return;
    }

    const numericDisplayOrder =
      Number(displayOrder);

    if (
      Number.isNaN(
        numericDisplayOrder,
      ) ||
      numericDisplayOrder < 0
    ) {
      setError(
        "Display order must be 0 or greater.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      if (editingImage) {
        const request:
          UpdateProductImageRequest = {
          imageUrl: imageUrl.trim(),
          displayOrder:
            numericDisplayOrder,
        };

        const updated =
          await updateProductImage(
            editingImage.imageId,
            request,
          );

        setImages((current) =>
          current
            .map((image) =>
              image.imageId ===
              updated.imageId
                ? updated
                : image,
            )
            .sort(
              (a, b) =>
                a.displayOrder -
                b.displayOrder,
            ),
        );
      } else {
        const request:
          CreateProductImageRequest = {
          imageUrl: imageUrl.trim(),
          displayOrder:
            numericDisplayOrder,
          productId:
            numericProductId,
        };

        const created =
          await createProductImage(
            request,
          );

        setImages((current) =>
          [...current, created].sort(
            (a, b) =>
              a.displayOrder -
              b.displayOrder,
          ),
        );
      }

      closeImageModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save image.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteImage(
    image: ProductImage,
  ) {
    const confirmed =
      window.confirm(
        "Delete this product image?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingImageId(
        image.imageId,
      );
      setError("");

      await deleteProductImage(
        image.imageId,
      );

      setImages((current) =>
        current.filter(
          (item) =>
            item.imageId !==
            image.imageId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete image.",
      );
    } finally {
      setDeletingImageId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white" />

        <div className="h-40 animate-pulse rounded-3xl bg-white" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl bg-white" />
          <div className="h-96 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/admin/products")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#737373] hover:text-[#E97917]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-sm font-semibold text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#737373] transition hover:text-[#E97917]"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
            Product Management
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">
            {product?.name}
          </h1>

          <p className="mt-2 text-sm text-[#737373]">
            ₹
            {product?.price.toLocaleString(
              "en-IN",
            )}{" "}
            ·{" "}
            {product?.seriesName ||
              `Series #${product?.seriesId}`}
          </p>
        </div>

        <Link
          to={`/products/${product?.productId}`}
          target="_blank"
          className="rounded-xl border border-[#E3E1DC] bg-white px-5 py-3 text-sm font-bold transition hover:border-[#F28C28]"
        >
          View Store Product
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ========================= */}
        {/* VARIANTS                   */}
        {/* ========================= */}

        <section className="rounded-3xl border border-[#E8E6E1] bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E97917]">
                Inventory
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Variants
              </h2>
            </div>

            <button
              type="button"
              onClick={openCreateVariant}
              className="inline-flex items-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28]"
            >
              <Plus size={17} />
              Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#DAD7D0] p-8 text-center">
              <p className="text-sm font-semibold text-[#737373]">
                No variants added yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E8E6E1]">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 bg-[#F8F7F3] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#737373]">
                <span>Size</span>
                <span>Stock</span>
                <span>Status</span>
                <span />
              </div>

              {variants.map((variant) => (
                <div
                  key={variant.variantId}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 border-t border-[#EEEEEA] px-4 py-4"
                >
                  <span className="font-black">
                    {variant.size}
                  </span>

                  <span className="text-sm font-semibold">
                    {variant.stock}
                  </span>

                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                      variant.available &&
                      variant.stock > 0
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {variant.available &&
                    variant.stock > 0
                      ? "Available"
                      : "Unavailable"}
                  </span>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        openEditVariant(
                          variant,
                        )
                      }
                      className="rounded-lg p-2 text-[#737373] hover:bg-[#FFF3E8] hover:text-[#E97917]"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingVariantId ===
                        variant.variantId
                      }
                      onClick={() =>
                        handleDeleteVariant(
                          variant,
                        )
                      }
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================= */}
        {/* IMAGES                     */}
        {/* ========================= */}

        <section className="rounded-3xl border border-[#E8E6E1] bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E97917]">
                Gallery
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Images
              </h2>
            </div>

            <button
              type="button"
              onClick={openCreateImage}
              className="inline-flex items-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28]"
            >
              <ImagePlus size={17} />
              Add Image
            </button>
          </div>

          {images.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#DAD7D0] p-8 text-center">
              <p className="text-sm font-semibold text-[#737373]">
                No images added yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div
                  key={image.imageId}
                  className="overflow-hidden rounded-2xl border border-[#E8E6E1]"
                >
                  <div className="aspect-square bg-[#FFF8F2]">
                    <img
                      src={image.imageUrl}
                      alt={product?.name || "Product"}
                      className="h-full w-full object-cover"
                      onError={(
                        event,
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-bold text-[#737373]">
                      Order{" "}
                      {image.displayOrder}
                    </p>

                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditImage(
                            image,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#E3E1DC] px-3 py-2 text-xs font-bold hover:border-[#F28C28]"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingImageId ===
                          image.imageId
                        }
                        onClick={() =>
                          handleDeleteImage(
                            image,
                          )
                        }
                        className="rounded-lg border border-red-100 px-3 py-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ========================= */}
      {/* VARIANT MODAL             */}
      {/* ========================= */}

      {variantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Inventory
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {editingVariant
                    ? "Edit Variant"
                    : "Add Variant"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeVariantModal
                }
                disabled={isSaving}
                className="rounded-xl p-2 text-[#737373] hover:bg-[#F3F1EC]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-bold">
                  Size
                </label>

                <input
                  value={size}
                  onChange={(event) =>
                    setSize(
                      event.target.value,
                    )
                  }
                  placeholder="S, M, L, XL"
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm uppercase outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="text-sm font-bold">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(event) =>
                    setStock(
                      event.target.value,
                    )
                  }
                  placeholder="20"
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(event) =>
                    setAvailable(
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#F28C28]"
                />

                Available for purchase
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={
                  closeVariantModal
                }
                disabled={isSaving}
                className="rounded-xl border border-[#E3E1DC] px-5 py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveVariant
                }
                disabled={
                  isSaving ||
                  !size.trim() ||
                  !stock.trim()
                }
                className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-bold text-white hover:bg-[#F28C28] disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingVariant
                    ? "Save Changes"
                    : "Add Variant"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* IMAGE MODAL               */}
      {/* ========================= */}

      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Gallery
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {editingImage
                    ? "Edit Image"
                    : "Add Image"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeImageModal
                }
                disabled={isSaving}
                className="rounded-xl p-2 text-[#737373] hover:bg-[#F3F1EC]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-bold">
                  Image URL
                </label>

                <input
                  value={imageUrl}
                  onChange={(event) =>
                    setImageUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                />

                {imageUrl && (
                  <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-[#E8E6E1] bg-[#FFF8F2]">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold">
                  Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(event) =>
                    setDisplayOrder(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none focus:border-[#F28C28]"
                />

                <p className="mt-2 text-xs text-[#737373]">
                  Lower numbers appear first.
                </p>
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={
                  closeImageModal
                }
                disabled={isSaving}
                className="rounded-xl border border-[#E3E1DC] px-5 py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveImage
                }
                disabled={
                  isSaving ||
                  !imageUrl.trim()
                }
                className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-bold text-white hover:bg-[#F28C28] disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingImage
                    ? "Save Changes"
                    : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductDetails;