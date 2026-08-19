import {
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "../../service/collectionService";

import type { Collection } from "../../types/collection";

function AdminCollections() {
  const [collections, setCollections] =
    useState<Collection[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingCollection, setEditingCollection] =
    useState<Collection | null>(null);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  async function loadCollections() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getCollections();

      setCollections(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load collections.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCollections();
  }, []);

  function openCreateForm() {
    setEditingCollection(null);
    setName("");
    setDescription("");
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(
    collection: Collection,
  ) {
    setEditingCollection(collection);
    setName(collection.name);
    setDescription(
      collection.description || "",
    );
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingCollection(null);
    setName("");
    setDescription("");
  }

  async function handleSave() {
    if (!name.trim()) {
      setError(
        "Collection name is required.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      if (editingCollection) {
        const updated =
          await updateCollection(
            editingCollection.collectionId,
            {
              name: name.trim(),
              description:
                description.trim() ||
                undefined,
            },
          );

        setCollections((current) =>
          current.map((collection) =>
            collection.collectionId ===
            updated.collectionId
              ? updated
              : collection,
          ),
        );
      } else {
        const created =
          await createCollection({
            name: name.trim(),
            description:
              description.trim() ||
              undefined,
          });

        setCollections((current) => [
          created,
          ...current,
        ]);
      }

      closeForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save collection.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(
    collection: Collection,
  ) {
    const confirmed = window.confirm(
      `Delete "${collection.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        collection.collectionId,
      );

      setError("");

      await deleteCollection(
        collection.collectionId,
      );

      setCollections((current) =>
        current.filter(
          (item) =>
            item.collectionId !==
            collection.collectionId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete collection.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#171717]">
            Collections.
          </h1>

          <p className="mt-3 text-sm text-[#737373]">
            Create and manage your ThreadVerse
            collections.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Refresh */}
          <button
            type="button"
            onClick={loadCollections}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3E1DC] bg-white px-4 py-3 text-sm font-bold text-[#333] transition hover:border-[#F28C28] disabled:opacity-50"
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

          {/* New Collection */}
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28]"
          >
            <Plus size={18} />

            New Collection
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-3xl bg-white"
              />
            ),
          )}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        collections.length === 0 && (
          <div className="mt-8 rounded-3xl border border-[#E8E6E1] bg-white px-6 py-20 text-center">
            <h2 className="text-2xl font-black">
              No collections yet.
            </h2>

            <p className="mt-2 text-sm text-[#737373]">
              Create your first collection to
              start organizing products.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28]"
            >
              Create Collection
            </button>
          </div>
        )}

      {/* Collection Cards */}
      {!isLoading &&
        collections.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collections.map(
              (collection) => (
                <div
                  key={
                    collection.collectionId
                  }
                  className="rounded-3xl border border-[#E8E6E1] bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E97917]">
                        Collection #
                        {
                          collection.collectionId
                        }
                      </p>

                      <h2 className="mt-2 truncate text-xl font-black text-[#171717]">
                        {collection.name}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-[#737373]">
                    {collection.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-6 flex gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(
                          collection,
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E3E1DC] px-4 py-3 text-sm font-bold transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        collection.collectionId
                      }
                      onClick={() =>
                        handleDelete(
                          collection,
                        )
                      }
                      className="rounded-xl border border-red-100 px-4 py-3 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Catalog
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {editingCollection
                    ? "Edit Collection"
                    : "New Collection"}
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

            {/* Form */}
            <div className="mt-7 space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-bold text-[#333]">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Summer Collection"
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none transition focus:border-[#F28C28]"
                />
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
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Describe this collection..."
                  className="mt-2 w-full resize-none rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none transition focus:border-[#F28C28]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-7 flex justify-end gap-3">
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
                  !name.trim()
                }
                className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingCollection
                    ? "Save Changes"
                    : "Create Collection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCollections;