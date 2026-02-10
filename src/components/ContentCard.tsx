"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { getYouTubeThumbnail } from "@/lib/api";

interface ContentCardProps {
  // For regular content (links to content detail)
  contentId?: number;
  image?: string;
  
  // For episodes (displays video thumbnail)
  videoLink?: string;
  episodeNumber?: number;
  
  // Common props
  title: string;
  subTitle?: string | null;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  contentId,
  image,
  videoLink,
  episodeNumber,
  title,
  subTitle,
  onClick,
}) => {
  // Determine thumbnail URL
  let thumbnailUrl = image || "/assets/images/default.jpg";
  
  if (videoLink) {
    // Get YouTube thumbnail from video link
    const ytThumbnail = getYouTubeThumbnail(videoLink, "high");
    if (ytThumbnail) {
      thumbnailUrl = ytThumbnail;
    }
  } else if (image) {
    // Check if image is a YouTube URL and extract thumbnail
    try {
      const parsed = new URL(image);
      if (parsed.hostname === "youtu.be" || parsed.hostname.includes("youtube.com")) {
        const ytThumbnail = getYouTubeThumbnail(image, "high");
        if (ytThumbnail) {
          thumbnailUrl = ytThumbnail;
        }
      }
    } catch {
      // Not a valid URL, use as-is
      thumbnailUrl = image;
    }
  }

  // Card content
  const cardContent = (
    <>
      <div className="relative rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
        
        {/* Episode badge */}
        {episodeNumber && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            Ep {episodeNumber}
          </div>
        )}
      </div>
      
      {/* Card info */}
      <div className="py-2.5">
        <h4 className="font-Poppins font-semibold text-base text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
          {title}
        </h4>
        {subTitle && (
          <p className="text-sm text-gray-500 line-clamp-1">{subTitle}</p>
        )}
      </div>
    </>
  );

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-56 md:w-60 flex-shrink-0 text-left group cursor-pointer"
      >
        {cardContent}
      </button>
    );
  }

  // If contentId is provided, render as link
  if (contentId) {
    return (
      <Link
        href={`/content/${contentId}`}
        className="w-56 md:w-60 flex-shrink-0 group cursor-pointer"
      >
        {cardContent}
      </Link>
    );
  }

  // Fallback - just render the card without interactivity
  return (
    <div className="w-56 md:w-60 flex-shrink-0 group">
      {cardContent}
    </div>
  );
};

export default ContentCard;
