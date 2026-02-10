import axios from "axios";
import type {
  HomeSectionsResponse,
  ContentDetailResponse,
  VideoDetailResponse,
  ContentItem,
  MasterCategory,
  MasterAudience,
  MasterLanguage,
  CategoryContentItem,
  FilterRequest,
  FilterType,
} from "./types";

// ============================================
// Axios Instance Configuration
// ============================================

const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || ""
    : "/api/proxy";

const api = axios.create({ baseURL });

// ============================================
// Utility Functions
// ============================================

/**
 * Sanitize field values - handles "NaN", empty strings, and invalid values
 */
function sanitizeField(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  const cleaned = value.trim().toLowerCase();
  if (cleaned === "nan" || cleaned === "") return null;
  return value.trim();
}

/**
 * Sanitize a content item from API response
 */
function sanitizeContentItem(item: Record<string, unknown>): ContentItem {
  return {
    content_id: item.content_id as number,
    title: (item.title as string) || "Untitled",
    sub_title: sanitizeField(item.sub_title),
    thumbnail_horizontal_url: sanitizeField(item.thumbnail_horizontal_url),
    thumbnail_vertical_url: sanitizeField(item.thumbnail_vertical_url),
  };
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(link: string): string {
  if (!link) return "";
  try {
    const parsed = new URL(link);
    // Short URL: https://youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace("/", "");
    }
    // Standard URL: https://www.youtube.com/watch?v=ID
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    }
    return "";
  } catch {
    return "";
  }
}

/**
 * Get YouTube thumbnail URL from video link
 */
export function getYouTubeThumbnail(
  videoLink: string,
  quality: "default" | "medium" | "high" | "maxres" = "maxres"
): string {
  const videoId = extractYouTubeId(videoLink);
  if (!videoId) return "";
  
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

// ============================================
// API Methods
// ============================================

/**
 * Fetch home page sections (slider, trending, recommended, new_releases)
 */
export async function fetchHomeSections(): Promise<HomeSectionsResponse> {
  const { data } = await api.get("/content/home-sections");
  
  return {
    slider: (data.slider || []).map(sanitizeContentItem),
    trending: (data.trending || []).map(sanitizeContentItem),
    recommended: (data.recommended || []).map(sanitizeContentItem),
    new_releases: (data.new_releases || []).map(sanitizeContentItem),
  };
}

/**
 * Fetch content details by content ID
 */
export async function fetchContentDetail(
  contentId: number | string
): Promise<ContentDetailResponse> {
  const { data } = await api.get(`/content/${contentId}`);
  
  return {
    content_id: data.content_id,
    title: data.title || "Untitled",
    sub_title: sanitizeField(data.sub_title),
    thumbnail_horizontal_url: sanitizeField(data.thumbnail_horizontal_url),
    thumbnail_vertical_url: sanitizeField(data.thumbnail_vertical_url),
    description: sanitizeField(data.description),
    current_video: data.current_video
      ? {
          video_id: data.current_video.video_id,
          title: data.current_video.title,
          sub_title: sanitizeField(data.current_video.sub_title),
          sequence: data.current_video.sequence,
          video_link: data.current_video.video_link,
        }
      : {
          video_id: 0,
          title: "",
          sub_title: null,
          sequence: 0,
          video_link: "",
        },
    episodes: (data.episodes || []).map((ep: Record<string, unknown>) => ({
      video_id: ep.video_id as number,
      title: (ep.title as string) || "",
      sub_title: sanitizeField(ep.sub_title),
      sequence: ep.sequence as number,
      video_link: (ep.video_link as string) || "",
    })),
    is_liked: Boolean(data.is_liked),
    in_watchlist: Boolean(data.in_watchlist),
  };
}

/**
 * Fetch single video details by video ID
 */
export async function fetchVideoDetail(
  videoId: number | string
): Promise<VideoDetailResponse> {
  const { data } = await api.get(`/content/video/${videoId}`);
  
  return {
    video_id: data.video_id,
    title: data.title || "",
    sub_title: sanitizeField(data.sub_title),
    video_link: data.video_link || "",
    sequence: data.sequence,
  };
}

// ============================================
// Master Data API Methods
// ============================================

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<MasterCategory[]> {
  const response = await api.get("/master/categories");
  const data = response.data;
  return (data || []).map((item: Record<string, unknown>) => ({
    master_id: item.master_id as number,
    title: (item.title as string) || "",
    code: item.code as string | null,
    content_count: (item.content_count as number) || 0,
  }));
}

/**
 * Fetch all audiences
 */
export async function fetchAudiences(): Promise<MasterAudience[]> {
  const { data } = await api.get("/master/audiences");
  return (data || []).map((item: Record<string, unknown>) => ({
    master_id: item.master_id as number,
    title: (item.title as string) || "",
    code: item.code as string | null,
  }));
}

/**
 * Fetch all languages
 */
export async function fetchLanguages(): Promise<MasterLanguage[]> {
  const { data } = await api.get("/master/languages");
  return (data || []).map((item: Record<string, unknown>) => ({
    master_id: item.master_id as number,
    title: (item.title as string) || "",
    code: item.code as string | null,
  }));
}

/**
 * Fetch content by category ID
 */
export async function fetchCategoryContent(
  categoryId: number | string
): Promise<CategoryContentItem[]> {
  const { data } = await api.get(`/content/categories/${categoryId}`);
  return (data || []).map((item: Record<string, unknown>) => ({
    content_id: item.content_id as number,
    title: (item.title as string) || "Untitled",
    sub_title: sanitizeField(item.sub_title),
    thumbnail_horizontal_url: sanitizeField(item.thumbnail_horizontal_url),
    thumbnail_vertical_url: sanitizeField(item.thumbnail_vertical_url),
  }));
}

/**
 * Find category by title (case-insensitive)
 */
export function findCategoryByTitle(
  categories: MasterCategory[],
  title: string
): MasterCategory | undefined {
  const normalizedTitle = title.toLowerCase().replace(/-/g, " ");
  return categories.find(
    (cat) => cat.title.toLowerCase() === normalizedTitle
  );
}

/**
 * Convert category title to URL-friendly slug
 */
export function categoryToSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Convert URL slug back to category title format
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================
// Filter API Methods
// ============================================

/**
 * Fetch filtered content using POST /content/filter
 */
export async function fetchFilteredContent(
  filter: FilterRequest
): Promise<CategoryContentItem[]> {
  const { data } = await api.post("/content/filter", filter);
  return (data || []).map((item: Record<string, unknown>) => ({
    content_id: item.content_id as number,
    title: (item.title as string) || "Untitled",
    sub_title: sanitizeField(item.sub_title),
    thumbnail_horizontal_url: sanitizeField(item.thumbnail_horizontal_url),
    thumbnail_vertical_url: sanitizeField(item.thumbnail_vertical_url),
  }));
}

/**
 * Fetch content by filter type and master_id
 */
export async function fetchContentByFilter(
  filterType: FilterType,
  masterId: number
): Promise<CategoryContentItem[]> {
  const filter: FilterRequest = {};
  
  switch (filterType) {
    case "category":
      filter.categories = [{ master_id: masterId }];
      break;
    case "audience":
      filter.audiences = [{ master_id: masterId }];
      break;
    case "language":
      filter.languages = [{ master_id: masterId }];
      break;
  }
  
  return fetchFilteredContent(filter);
}

/**
 * Find item by title in master data array (case-insensitive)
 */
export function findMasterByTitle<T extends { title: string }>(
  items: T[],
  title: string
): T | undefined {
  const normalizedTitle = title.toLowerCase().replace(/-/g, " ");
  return items.find(
    (item) => item.title.toLowerCase() === normalizedTitle
  );
}

// ============================================
// Auth API Methods
// ============================================

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message?: string;
  token?: string;
  tokenType?: string;
  user?: {
    id: number;
    email: string;
    username: string;
    name: string;
  };
}

/**
 * Get auth headers from localStorage
 * Returns Authorization header with token_type and access_token
 */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  
  const token = localStorage.getItem("authToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `${tokenType} ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return !!localStorage.getItem("authToken");
}

/**
 * Logout user - clear all auth data from localStorage
 */
export function logout(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("user");
}

/**
 * Register a new user
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth/register", payload);
    return {
      status: response.status,
      message: response.data?.message || "Registration successful",
      token: response.data?.access_token || response.data?.token,
      tokenType: response.data?.token_type || "Bearer",
      user: response.data?.user,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "Registration failed",
      };
    }
    return {
      status: 500,
      message: "Network error. Please try again.",
    };
  }
}

/**
 * Login user
 * Note: This API expects form-urlencoded data, not JSON
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    // Create form-urlencoded data
    const formData = new URLSearchParams();
    formData.append("username", payload.username);
    formData.append("password", payload.password);

    const response = await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return {
      status: response.status,
      message: response.data?.message || "Login successful",
      token: response.data?.access_token || response.data?.token,
      tokenType: response.data?.token_type || "Bearer",
      user: response.data?.user,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.detail || error.response.data?.message || "Login failed",
      };
    }
    return {
      status: 500,
      message: "Network error. Please try again.",
    };
  }
}

export default api;
