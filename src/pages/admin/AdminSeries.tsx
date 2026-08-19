import {
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getCollections,
} from "../../service/collectionService";

import {
  createSeries,
  deleteSeries,
  getSeries,
  updateSeries,
} from "../../service/seriesService";

import type { Collection } from "../../types/collection";
import type { Series } from "../../types/series";

type SeriesGroup = {
  name: "Anime" | "Marvel" | "DC";
  collection: Collection | undefined;
  items: Series[];
};

function AdminSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [collections, setCollections] =
    useState<Collection[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingSeries, setEditingSeries] =
    useState<Series | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [collectionId, setCollectionId] =
    useState<number | "">("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  async function loadData() {
    try {
      setIsLoading(true);
      setError("");

      const [seriesData, collectionData] =
        await Promise.all([
          getSeries(),
          getCollections(),
        ]);

      setSeries(seriesData);
      setCollections(collectionData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load series.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateForm() {
    setEditingSeries(null);
    setName("");
    setDescription("");
    setCollectionId("");
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(item: Series) {
    setEditingSeries(item);
    setName(item.name);
    setDescription(item.description || "");
    setCollectionId(item.collectionId);
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingSeries(null);
    setName("");
    setDescription("");
    setCollectionId("");
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Series name is required.");
      return;
    }

    if (!collectionId) {
      setError("Please select a collection.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const request = {
        name: name.trim(),
        description:
          description.trim() || undefined,
        collectionId: Number(collectionId),
      };

      if (editingSeries) {
        const updated = await updateSeries(
          editingSeries.seriesId,
          request,
        );

        setSeries((current) =>
          current.map((item) =>
            item.seriesId === updated.seriesId
              ? updated
              : item,
          ),
        );
      } else {
        const created = await createSeries(
          request,
        );

        setSeries((current) => [
          created,
          ...current,
        ]);
      }

      closeForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save series.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: Series) {
    const confirmed = window.confirm(
      `Delete "${item.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.seriesId);
      setError("");

      await deleteSeries(item.seriesId);

      setSeries((current) =>
        current.filter(
          (seriesItem) =>
            seriesItem.seriesId !==
            item.seriesId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete series.",
      );
    } finally {
      setDeletingId(null);
    }
  }

 const categoryNames = [
  "Anime",
  "Marvel",
  "DC",
] as const;

const groups = useMemo<SeriesGroup[]>(() => {
  return categoryNames.map((name) => {
    const collection =
      collections.find(
        (item) =>
          item.name.toLowerCase() ===
          name.toLowerCase(),
      );

    const items = series.filter((item) => {
      if (collection) {
        return (
          item.collectionId ===
          collection.collectionId
        );
      }

      return (
        item.collectionName?.toLowerCase() ===
        name.toLowerCase()
      );
    });

    return {
      name,
      collection,
      items,
    };
  });
}, [collections, series]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E97917]">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#171717]">
            Series.
          </h1>

          <p className="mt-3 text-sm text-[#737373]">
            Manage Anime, Marvel and DC series.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadData}
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

          <button
            type="button"
            onClick={openCreateForm}
            disabled={collections.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            New Series
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Required collections warning */}
      {!isLoading &&
        collections.length > 0 &&
        groups.some((group) => !group.collection) && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
            Make sure your collections are named
            exactly <strong>Anime</strong>,{" "}
            <strong>Marvel</strong>, and{" "}
            <strong>DC</strong> to organize the
            series into these sections.
          </div>
        )}

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 space-y-10">
          {Array.from({ length: 3 }).map(
            (_, groupIndex) => (
              <div key={groupIndex}>
                <div className="h-8 w-32 animate-pulse rounded bg-white" />

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({
                    length: 3,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-48 animate-pulse rounded-3xl bg-white"
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Groups */}
      {!isLoading && (
        <div className="mt-8 space-y-12">
          {groups.map((group) => (
            <section key={group.name}>
              {/* Section title */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em]">
                    {group.name}
                  </h2>

                  <p className="mt-1 text-sm text-[#737373]">
                    {group.items.length}{" "}
                    {group.items.length === 1
                      ? "series"
                      : "series"}
                  </p>
                </div>

                <div className="h-px flex-1 bg-[#E8E6E1]" />
              </div>

              {/* Empty section */}
              {group.items.length === 0 && (
                <div className="mt-5 rounded-3xl border border-dashed border-[#DDDAD2] bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-[#737373]">
                    No {group.name} series yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      if (group.collection) {
                        setEditingSeries(null);
                        setName("");
                        setDescription("");
                        setCollectionId(
                          group.collection.collectionId,
                        );
                        setError("");
                        setIsFormOpen(true);
                      }
                    }}
                    disabled={!group.collection}
                    className="mt-4 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add {group.name} Series
                  </button>
                </div>
              )}

              {/* Series cards */}
              {group.items.length > 0 && (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item) => (
                    <div
                      key={item.seriesId}
                      className="rounded-3xl border border-[#E8E6E1] bg-white p-6"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E97917]">
                        Series #{item.seriesId}
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        {item.name}
                      </h3>

                      <p className="mt-4 min-h-[48px] text-sm leading-6 text-[#737373]">
                        {item.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-6 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(item)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E3E1DC] px-4 py-3 text-sm font-bold transition hover:border-[#F28C28] hover:bg-[#FFF8F2]"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            item.seriesId
                          }
                          onClick={() =>
                            handleDelete(item)
                          }
                          className="rounded-xl border border-red-100 px-4 py-3 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E97917]">
                  Catalog
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {editingSeries
                    ? "Edit Series"
                    : "New Series"}
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

            <div className="mt-7 space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-bold text-[#333]">
                  Series Name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Naruto"
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none transition focus:border-[#F28C28]"
                />
              </div>

              {/* Collection */}
              <div>
                <label className="text-sm font-bold text-[#333]">
                  Category
                </label>

                <select
                  value={collectionId}
                  onChange={(event) =>
                    setCollectionId(
                      event.target.value
                        ? Number(
                            event.target.value,
                          )
                        : "",
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#E3E1DC] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#F28C28]"
                >
                  <option value="">
                    Select category
                  </option>

                  {["Anime", "Marvel", "DC"].map(
                    (category) => {
                      const collection =
                        collections.find(
                          (item) =>
                            item.name.toLowerCase() ===
                            category.toLowerCase(),
                        );

                      if (!collection) {
                        return null;
                      }

                      return (
                        <option
                          key={
                            collection.collectionId
                          }
                          value={
                            collection.collectionId
                          }
                        >
                          {category}
                        </option>
                      );
                    },
                  )}
                </select>
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
                  placeholder="Describe this series..."
                  className="mt-2 w-full resize-none rounded-xl border border-[#E3E1DC] px-4 py-3.5 text-sm outline-none transition focus:border-[#F28C28]"
                />
              </div>
            </div>

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
                  !name.trim() ||
                  !collectionId
                }
                className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingSeries
                    ? "Save Changes"
                    : "Create Series"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSeries;