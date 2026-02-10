"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";

interface BannerProps {
  image: string;
  title: string;
  duration?: string;
  description?: string;
  language?: string;
  buttonText?: string;
  contentId?: number;
}

const Banner: React.FC<BannerProps> = ({
  image,
  title,
  duration,
  description,
  language,
  buttonText = "Watch Now",
  contentId,
}) => {
  const contentLink = contentId ? `/content/${contentId}` : "#";

  return (
    <div
      className="relative w-full h-[60vh] md:h-[80vh] flex items-center text-white"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-xl px-6 md:px-16">
        {/* Meta info */}
        {(duration || language) && (
          <p className="text-sm mb-2 text-red-400 font-medium">
            {duration && <span>{duration}</span>}
            {duration && language && <span> • </span>}
            {language && <span>{language}</span>}
          </p>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-sm md:text-base opacity-90 mb-6 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Watch Button */}
        <Link
          href={contentLink}
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Play className="w-5 h-5 fill-white" />
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default Banner;
