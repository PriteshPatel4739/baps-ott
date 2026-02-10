
"use client"
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoCard: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        poster,
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-full"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoCard;
