import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useI18n } from "../i18n/useI18n";
import OldIcon from "./OldIcon";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: Timestamp | null;
}

const ENTRIES_PER_PAGE = 10;

export default function GuestbookEntries() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<unknown>(null);
  const [hasMore, setHasMore] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchEntries = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const entriesRef = collection(db, "guestbook");
      const q = lastDoc
        ? query(
            entriesRef,
            orderBy("timestamp", "desc"),
            startAfter(lastDoc),
            limit(ENTRIES_PER_PAGE)
          )
        : query(
            entriesRef,
            orderBy("timestamp", "desc"),
            limit(ENTRIES_PER_PAGE)
          );

      const snapshot = await getDocs(q);

      const newEntries: GuestbookEntry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GuestbookEntry[];

      if (isLoadMore) {
        setEntries((prev) => [...prev, ...newEntries]);
      } else {
        setEntries(newEntries);
      }

      // Update last document for pagination
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Check if there are more entries to load
      setHasMore(snapshot.docs.length === ENTRIES_PER_PAGE);
    } catch (err) {
      console.error("Failed to fetch guestbook entries:", err);
      setError(t("guestbook.entries.offline"));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastDoc, t]);

  // Initial fetch - using ref to prevent cascading renders
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchEntries();
    }
  }, [fetchEntries]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchEntries(true);
    }
  };

  const handleRetry = () => {
    setLastDoc(null);
    setHasMore(true);
    fetchEntries();
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="border-t border-l border-retro-border-mid border-b border-r p-3 bg-[#f0f0f0]">
        <div className="flex items-center gap-2 text-sm text-retro-blue-dark">
          <OldIcon name="Hourglass16" size={16} alt="" />
          {t("guestbook.entries.loading")}
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="border-t border-l border-retro-border-mid border-b border-r p-3 bg-[#f0f0f0]">
        <div className="text-sm text-retro-red-link mb-2">{error}</div>
        <button
          type="button"
          onClick={handleRetry}
          className="retro-btn px-4 py-1.5 text-sm cursor-pointer"
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="border-t border-l border-retro-border-mid border-b border-r p-3 bg-[#f0f0f0]">
        <div className="text-sm text-retro-blue-dark">
          {t("guestbook.entries.empty")}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-l border-retro-border-mid border-b border-r p-3 bg-[#f0f0f0]">
      <div className="font-bold text-sm mb-3 text-retro-blue-dark flex items-center gap-1.5">
        <OldIcon name="FileText16" size={16} alt="" />
        {t("guestbook.entries.title")}
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="border border-retro-border-mid p-2 bg-white"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-bold text-sm text-retro-blue-dark">
                {entry.name}
              </span>
              {entry.timestamp && (
                <span className="text-xs text-[#999]">
                  {formatDate(entry.timestamp)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-words">
              {entry.message}
            </p>
          </div>
        ))}
      </div>

      {/* Load More button */}
      {hasMore && (
        <div className="mt-3">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="retro-btn px-4 py-1.5 text-sm cursor-pointer w-full"
          >
            {loadingMore ? (
              <span className="flex items-center justify-center gap-2">
                <OldIcon name="Hourglass16" size={14} alt="" />
                {t("guestbook.entries.loading")}
              </span>
            ) : (
              t("guestbook.entries.loadMore")
            )}
          </button>
        </div>
      )}
    </div>
  );
}
