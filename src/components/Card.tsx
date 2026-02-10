
"use client"

import { Bookmark, GalleryThumbnails } from "lucide-react";
import React from "react";

interface CardProps {
  image: string;
  title: string;
  timeLeft?: string;
  onCardClick: ()=>void;
}


const Card: React.FC<CardProps> = ({
  image,
  title,
  timeLeft,
  onCardClick
}) => {

  let thumbnailImage = image; // Default to original image
  try {
    const parsed = new URL(image);

    // 1. Short URL: https://youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      thumbnailImage = `https://img.youtube.com/vi/${parsed.pathname.replace("/", "")}/maxresdefault.jpg`;
    }
    // For all other valid URLs, use the original image (already set as default)
  } catch {
    // If URL parsing fails, use the original image (already set as default)
    thumbnailImage = image;
  }

  return (
    <div onClick={()=>onCardClick()} className="flex flex-col">
      <div className="w-60 flex-shrink-0 rounded-2xl overflow-hidden shadow-md ">
        <img
          src={thumbnailImage}
          alt={title}
          className="w-full h-36 object-cover"
        />
      </div>
      <h4 className="py-2.5 flex justify-start font-Poppins font-semibold text-xl text-gray-900">
          {title}
      </h4>
    </div>

  );
};

export default Card;
