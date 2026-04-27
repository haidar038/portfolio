import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";

const FALLBACK_COUNT = 2461;
const SESSION_KEY = "visitor_counted";
const DOC_PATH = "stats/visitors";

/**
 * Formats a number as a 7-digit string with comma separator.
 * Example: 2461 -> "000,2461"
 */
function formatCount(count: number): string {
  const padded = count.toString().padStart(7, "0");
  return `${padded.slice(0, 3)},${padded.slice(3)}`;
}

/**
 * VisitorCounter component - displays and increments the visitor count.
 * Uses Firestore for persistence and sessionStorage for rate limiting.
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export default function VisitorCounter() {
  const [count, setCount] = useState<number>(FALLBACK_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndIncrement() {
      try {
        const docRef = doc(db, DOC_PATH);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentCount = typeof data.count === "number" ? data.count : FALLBACK_COUNT;
          setCount(currentCount);
        } else {
          // Document doesn't exist, create it with initial count
          await setDoc(docRef, { count: FALLBACK_COUNT, lastUpdated: new Date() });
          setCount(FALLBACK_COUNT);
        }

        // Check if we've already incremented in this session
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY);
        if (!alreadyCounted) {
          // Increment the counter
          await setDoc(docRef, { count: increment(1), lastUpdated: new Date() }, { merge: true });
          setCount((prev) => prev + 1);
          sessionStorage.setItem(SESSION_KEY, "true");
        }
      } catch (err) {
        console.error("VisitorCounter error:", err);
        // Keep fallback value on error
      } finally {
        setLoading(false);
      }
    }

    fetchAndIncrement();
  }, []);

  return (
    <span className="font-mono text-sm">
      {loading ? (
        <span className="text-retro-text-secondary">Loading...</span>
      ) : (
        formatCount(count)
      )}
    </span>
  );
}
