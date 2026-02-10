"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CardSlider from "./CardSlider";
import VideoCard from "./VideoCard"


export interface Episode {
  sub_title: string | null;
  title: string;
  sequence: number;
  video_id: number;
  video_link: string;
}

export interface CurrentVideo {
  sub_title: string | null;
  title: string;
  sequence: number;
  video_id: number;
  video_link: string;
}

export interface ContentDetailsResponse {
  content_id: number;
  title: string;
  sub_title: string | null;
  thumbnail_horizontal_url: string | null;
  thumbnail_vertical_url: string | null;
  description: string | null;

  current_video: CurrentVideo;
  episodes: Episode[];

  is_liked: boolean;
  in_watchlist: boolean;
}

const extractYouTubeId = (link: string): string => {
  try {
    const parsed = new URL(link);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace("/", "");
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    }
    return "";
  } catch {
    return "";
  }
};

export const VideoDetailPage = ({
  data,
  selectedVideoId,
}: {
  data: ContentDetailsResponse;
  selectedVideoId?: number;
}) => {
  const router = useRouter();
  const initialEpisode = useMemo(() => {
    if (!data.episodes?.length) return undefined;
    if (!selectedVideoId) return data.episodes[0];
    return (
      data.episodes.find(ep => ep.video_id === selectedVideoId) ||
      data.episodes[0]
    );
  }, [data.episodes, selectedVideoId]);

  const [currentVideoId, setCurrentVideoId] = useState<number | undefined>(
    initialEpisode?.video_id
  );

  const currentEpisode =
    data.episodes.find(ep => ep.video_id === currentVideoId) || initialEpisode;

  const currentVideoLink = currentEpisode?.video_link || "";
  const videoSrc = extractYouTubeId(currentVideoLink);

  const handleEpisodeClick = (item: Episode | { contentId?: number }) => {
    // Only handle Episode type items
    if ("video_id" in item) {
      setCurrentVideoId(item.video_id);
      router.push(`/content/${data.content_id}?episode=${item.video_id}`);
    }
  };

  const listPageData = [{ list: data.episodes, title: "Episodes" }];

  return (
    <div>
      <VideoCard
        videoSrc={videoSrc}
        // poster = {data.thumbnail_vertical_url || data.thumbnail_horizontal_url || ""}
        title={data.title}
        description={data.description || ""}
        // breadcrumb = {['Home',"first of it's kind"]}
      />
      {listPageData.map((item, index) => {
        return (
          <div key={index + 23} className="py-2 px-0">
            <CardSlider
              heading={item?.title}
              items={item?.list}
              onCardClick={handleEpisodeClick}
            />
          </div>
        );
      })}
    </div>
  );
};