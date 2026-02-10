"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import type { CategoryContentItem } from "@/lib/types";

interface CategoryContentGridProps {
  items: CategoryContentItem[];
}

// Content Card for Category Grid
const ContentGridCard = ({ item }: { item: CategoryContentItem }) => {
  // Get thumbnail URL with fallback
  const thumbnailUrl =
    item.thumbnail_horizontal_url ||
    item.thumbnail_vertical_url ||
    "/assets/images/default.jpg";

  return (
    <Link
      href={`/content/${item.content_id}`}
      className="group block"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
          {item.title}
        </h3>
        {item.sub_title && (
          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
            {item.sub_title}
          </p>
        )}
      </div>
    </Link>
  );
};

const CategoryContentGrid: React.FC<CategoryContentGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <ContentGridCard key={item.content_id} item={item} />
      ))}
    </div>
  );
};

export default CategoryContentGrid;
