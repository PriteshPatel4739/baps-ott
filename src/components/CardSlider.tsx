"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import type { CardItemProps, Episode } from "@/lib/types";

interface CardSliderProps {
  heading?: string;
  items: (CardItemProps | Episode)[];
  onCardClick?: (item: CardItemProps | Episode) => void;
  showViewAll?: boolean;
  viewAllHref?: string;
}

/**
 * Check if item is an Episode type
 */
function isEpisode(item: CardItemProps | Episode): item is Episode {
  return "video_id" in item && "video_link" in item;
}

const CardSlider: React.FC<CardSliderProps> = ({
  heading,
  items,
  onCardClick,
  showViewAll = false,
  viewAllHref = "#",
}) => {
  if (!items?.length) return null;

  return (
    <section className="w-full">
      {/* Section Header */}
      {heading && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl md:text-2xl font-semibold font-Poppins text-gray-900">
            {heading}
          </h2>
          {showViewAll && (
            <Link
              href={viewAllHref}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Scrollable Cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item, index) => {
          // Handle Episode items
          if (isEpisode(item)) {
            return (
              <ContentCard
                key={`episode-${item.video_id}`}
                videoLink={item.video_link}
                title={item.title}
                subTitle={item.sub_title}
                episodeNumber={item.sequence}
                onClick={() => onCardClick?.(item)}
              />
            );
          }

          // Handle regular content items
          return (
            <ContentCard
              key={`content-${item.contentId}-${index}`}
              contentId={item.contentId}
              image={item.image}
              title={item.title}
              subTitle={item.subTitle}
              onClick={onCardClick ? () => onCardClick(item) : undefined}
            />
          );
        })}
      </div>
    </section>
  );
};

export default CardSlider;
