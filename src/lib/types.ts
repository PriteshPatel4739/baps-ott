// ============================================
// API Response Types
// ============================================

// Home Page API Types
export interface ContentItem {
  content_id: number;
  title: string;
  sub_title: string | null;
  thumbnail_horizontal_url: string | null;
  thumbnail_vertical_url: string | null;
}

export interface HomeSectionsResponse {
  slider: ContentItem[];
  trending: ContentItem[];
  recommended: ContentItem[];
  new_releases: ContentItem[];
}

// Content Detail API Types
export interface Episode {
  video_id: number;
  title: string;
  sub_title: string | null;
  sequence: number;
  video_link: string;
}

export interface CurrentVideo {
  video_id: number;
  title: string;
  sub_title: string | null;
  sequence: number;
  video_link: string;
}

export interface ContentDetailResponse {
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

// Video Detail API Types
export interface VideoDetailResponse {
  video_id: number;
  title: string;
  sub_title: string | null;
  video_link: string;
  sequence: number;
}

// ============================================
// Component Props Types
// ============================================

export interface CardItemProps {
  image: string;
  title: string;
  contentId: number;
  subTitle?: string | null;
}

// ============================================
// Master Data Types
// ============================================

export interface MasterCategory {
  master_id: number;
  title: string;
  code: string | null;
  content_count: number;
}

export interface MasterAudience {
  master_id: number;
  title: string;
  code: string | null;
}

export interface MasterLanguage {
  master_id: number;
  title: string;
  code: string | null;
}

// ============================================
// Category Content Response
// ============================================

export interface CategoryContentItem {
  content_id: number;
  title: string;
  sub_title: string | null;
  thumbnail_horizontal_url: string | null;
  thumbnail_vertical_url: string | null;
}

// ============================================
// Filter API Types
// ============================================

export interface FilterRequest {
  categories?: { master_id: number }[];
  languages?: { master_id: number }[];
  audiences?: { master_id: number }[];
}

export type FilterType = 'category' | 'audience' | 'language';

// ============================================
// Utility Types
// ============================================

export type SectionType = 'slider' | 'trending' | 'recommended' | 'new_releases';
