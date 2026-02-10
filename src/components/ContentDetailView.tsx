"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronRight, Play } from "lucide-react";
import type { ContentDetailResponse, Episode } from "@/lib/types";
import api, { extractYouTubeId, getYouTubeThumbnail, getAuthHeaders, isAuthenticated } from "@/lib/api";

interface ContentDetailViewProps {
  content: ContentDetailResponse;
  initialEpisodeId?: number;
}

// Episode Card Component
const EpisodeCard = ({
  episode,
  isActive,
  onClick,
}: {
  episode: Episode;
  isActive: boolean;
  onClick: () => void;
}) => {
  const thumbnailUrl = getYouTubeThumbnail(episode.video_link, "high");

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-48 md:w-56 text-left transition-all duration-200 group ${
        isActive ? "ring-2 ring-red-500 rounded-lg" : ""
      }`}
    >
      <div className="relative rounded-lg overflow-hidden shadow-md">
        <img
          src={thumbnailUrl || "/assets/images/default.jpg"}
          alt={episode.title}
          className="w-full h-28 md:h-32 object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <Play className="w-10 h-10 text-white fill-white" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          Ep {episode.sequence}
        </div>
      </div>
      <p
        className={`mt-2 text-sm font-medium truncate ${
          isActive ? "text-red-600" : "text-gray-900"
        }`}
      >
        {episode.title}
      </p>
      {episode.sub_title && (
        <p className="text-xs text-gray-500 truncate">{episode.sub_title}</p>
      )}
    </button>
  );
};

// Video Player Component
const VideoPlayer = ({ videoId }: { videoId: string }) => {
  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-white">Video not available</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
        title="Video player"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Main Content Detail View Component
export default function ContentDetailView({
  content,
  initialEpisodeId,
}: ContentDetailViewProps) {
  const router = useRouter();

  // Determine the initial episode
  const initialEpisode = useMemo(() => {
    if (!content.episodes?.length) return null;

    // If initialEpisodeId is provided, find that episode
    if (initialEpisodeId) {
      const found = content.episodes.find(
        (ep) => ep.video_id === initialEpisodeId
      );
      if (found) return found;
    }

    // Otherwise use current_video if it matches an episode
    if (content.current_video?.video_id) {
      const found = content.episodes.find(
        (ep) => ep.video_id === content.current_video.video_id
      );
      if (found) return found;
    }

    // Default to first episode
    return content.episodes[0];
  }, [content.episodes, content.current_video, initialEpisodeId]);

  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(
    initialEpisode
  );
  const [isBookmarked, setIsBookmarked] = useState(content.in_watchlist);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  // Get current video YouTube ID
  const currentVideoId = currentEpisode
    ? extractYouTubeId(currentEpisode.video_link)
    : "";

  // Track video history when video/episode changes
  const trackHistory = useCallback(async (videoId: number) => {
    if (!isAuthenticated()) return;
    
    try {
      await api.post("/user/history", {
        content_id: content.content_id,
        video_id: videoId,
        timestamp_seconds: 0,
      }, {
        headers: getAuthHeaders(),
      });
    } catch {
      // Silently fail - history tracking is not critical
    }
  }, [content.content_id]);

  // Track history when component mounts or episode changes
  useEffect(() => {
    if (currentEpisode?.video_id) {
      trackHistory(currentEpisode.video_id);
    }
  }, [currentEpisode?.video_id, trackHistory]);

  // Handle episode selection
  const handleEpisodeSelect = useCallback(
    (episode: Episode) => {
      setCurrentEpisode(episode);
      // Update URL without full page reload
      router.push(`/content/${content.content_id}?episode=${episode.video_id}`, {
        scroll: false,
      });
    },
    [content.content_id, router]
  );

  // Handle bookmark toggle with API integration
  const handleBookmarkToggle = useCallback(async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setIsTogglingBookmark(true);
    try {
      await api.post("/user/preferences/toggle", {
        content_id: content.content_id,
        preference_type: "watchlist",
      }, {
        headers: getAuthHeaders(),
      });
      setIsBookmarked((prev) => !prev);
    } catch {
      // Failed to toggle bookmark
    } finally {
      setIsTogglingBookmark(false);
    }
  }, [content.content_id, router]);

  // Breadcrumb
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: content.title, href: `/content/${content.content_id}` },
    ...(currentEpisode
      ? [{ label: currentEpisode.title, href: "#" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container with consistent padding */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        {/* Video Player Section */}
        <VideoPlayer videoId={currentVideoId} />

        {/* Content Info Section */}
        <div className="pt-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.label}>
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              ) : (
                <a
                  href={crumb.href}
                  className="hover:text-red-600 transition-colors"
                >
                  {crumb.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {currentEpisode?.title || content.title}
            </h1>
            {currentEpisode?.sub_title && (
              <p className="text-gray-600 mt-1">{currentEpisode.sub_title}</p>
            )}
            {content.title !== currentEpisode?.title && (
              <p className="text-sm text-gray-500 mt-1">
                From: <span className="font-medium">{content.title}</span>
                {currentEpisode && (
                  <span className="ml-2">• Episode {currentEpisode.sequence}</span>
                )}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmarkToggle}
              disabled={isTogglingBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isBookmarked
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-yellow-200 hover:text-yellow-700"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? "fill-yellow-500" : ""}`}
              />
              <span className="text-sm font-medium">
                {isTogglingBookmark ? "..." : isBookmarked ? "Bookmarked" : "Bookmark"}
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        {content.description && (
          <p className="text-gray-700 leading-relaxed mb-5 max-w-4xl">
            {content.description}
          </p>
        )}

        {/* Episodes Section */}
        {content.episodes?.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Episodes
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({content.episodes.length} episodes)
                </span>
              </h2>
              {content.episodes.length > 5 && (
                <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {content.episodes.map((episode) => (
                <EpisodeCard
                  key={episode.video_id}
                  episode={episode}
                  isActive={currentEpisode?.video_id === episode.video_id}
                  onClick={() => handleEpisodeSelect(episode)}
                />
              ))}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}
