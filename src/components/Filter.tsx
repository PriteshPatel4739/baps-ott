"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";
import api from "@/lib/api";

interface SearchResult {
  content_id: number;
  thumbnail_horizontal_url: string;
  title: string;
  timeLeft?: string;
}

const DEBOUNCE_DELAY = 500; // 500ms debounce delay
const MIN_SEARCH_LENGTH = 3;

const Filter: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedSearch = search.trim();

    // Clear results if search is less than minimum length
    if (trimmedSearch.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    // Set loading state immediately for better UX
    setLoading(true);

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get("/content/search", {
          params: { q: trimmedSearch },
        });
        setSearchResults(data || []);
      } catch (error) {
        console.error("Search API error:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search]);

  const handleCardClick = (contentId: number) => {
    router.push(`/content/${contentId}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 space-y-4 w-full">
      {/* Search Bar */}
      <div>
        <label className="text-sm font-semibold text-black">Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search content (min 3 characters)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 mt-2 text-black border rounded-lg outline-none focus:ring focus:ring-blue-300"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1">
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {search.trim().length > 0 && search.trim().length < MIN_SEARCH_LENGTH && (
          <p className="text-xs text-gray-500 mt-1">
            Type at least {MIN_SEARCH_LENGTH} characters to search
          </p>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {searchResults.map((item, index) => (
            <Card
              key={index}
              image={item.thumbnail_horizontal_url}
              title={item.title}
              timeLeft={item.timeLeft}
              onCardClick={() => handleCardClick(item.content_id)}
            />
          ))}
        </div>
      )}

      {/* No Results Message */}
      {searchResults.length === 0 && search.trim().length >= MIN_SEARCH_LENGTH && !loading && (
        <div className="text-center text-gray-500 py-4">
          No results found for &quot;{search}&quot;
        </div>
      )}
    </div>
  );
};

export default Filter;
