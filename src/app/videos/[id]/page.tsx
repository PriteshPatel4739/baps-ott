import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ videoId?: string }>;
}

/**
 * Legacy route handler - redirects to new /content/[contentId] route
 * This maintains backward compatibility for old URLs
 */
export default async function LegacyVideoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { videoId } = await searchParams;

  // Build the new URL
  let newUrl = `/content/${id}`;
  if (videoId) {
    newUrl += `?episode=${videoId}`;
  }

  // Redirect to new content route
  redirect(newUrl);
}
