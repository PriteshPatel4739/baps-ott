import { Suspense } from "react";
import Link from "next/link";
import { fetchContentDetail } from "@/lib/api";
import ContentDetailView from "@/components/ContentDetailView";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ contentId: string }>;
  searchParams: Promise<{ episode?: string }>;
}

// Generate dynamic metadata based on content
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { contentId } = await params;
  try {
    const content = await fetchContentDetail(contentId);
    return {
      title: `${content.title} | BAPS OTT`,
      description: content.description || `Watch ${content.title} on BAPS OTT`,
    };
  } catch {
    return {
      title: "Content | BAPS OTT",
    };
  }
}

// Loading component for suspense
function ContentLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-pulse">
        <div className="aspect-video w-full bg-gray-300" />
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-300 rounded w-full mb-2" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

// Error component
function ContentError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Content Not Found
        </h1>
        <p className="text-gray-600">{message}</p>
        <Link
          href="/"
          className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Server component to fetch and render content
async function ContentPage({ params, searchParams }: PageProps) {
  const { contentId } = await params;
  const { episode } = await searchParams;
  
  // Validate contentId
  const parsedContentId = Number(contentId);
  if (isNaN(parsedContentId)) {
    return <ContentError message="Invalid content ID" />;
  }

  try {
    const contentData = await fetchContentDetail(parsedContentId);
    
    // Parse episode ID from query params
    const selectedEpisodeId = episode ? Number(episode) : undefined;
    const validEpisodeId = selectedEpisodeId && !isNaN(selectedEpisodeId) 
      ? selectedEpisodeId 
      : undefined;

    return (
      <ContentDetailView 
        content={contentData} 
        initialEpisodeId={validEpisodeId} 
      />
    );
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return <ContentError message="Failed to load content. Please try again later." />;
  }
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<ContentLoading />}>
      <ContentPage {...props} />
    </Suspense>
  );
}
