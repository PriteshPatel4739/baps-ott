import React from "react";
import VideoPlayer from "./VideoPlayer";

interface VideoDetailProps {
  videoSrc: string;
  // poster?: string;
  title: string;
  description: string;
  // breadcrumb?: string[];
}

const VideoCard: React.FC<VideoDetailProps> = ({
  videoSrc,
  // poster,
  title,
  description,
  // breadcrumb = [],
}) => {
  return (
    <div className="w-full px-2 py-6">
      {/* Video Player */}
      {/* <VideoPlayer src={videoSrc} poster={poster} /> */}

      <div className="aspect-video w-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoSrc}`}
        title="YouTube player"
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
      />
    </div>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mt-4 flex flex-wrap gap-1">
        {/* {breadcrumb.map((item, index) => (
          <span key={index}>
            {item}
            {index !== breadcrumb.length - 1 && " > "}
          </span>
        ))} */}
      </div>

      {/* <img className="m-l" src={poster} alt="" /> */}

      {/* Title */}
      <h1 className="text-2xl px-10 md:text-2xl font-semibold mt-3">
        {title}
      </h1>

      {/* Description */}
      <p className="text-sm px-12 md:text-base text-gray-700 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default VideoCard;
