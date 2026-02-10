import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  fetchCategories,
  fetchAudiences,
  fetchLanguages,
  fetchContentByFilter,
  findMasterByTitle,
  slugToTitle,
} from "@/lib/api";
import type { CategoryContentItem, FilterType } from "@/lib/types";
import type { Metadata } from "next";
import CategoryContentGrid from "@/components/CategoryContentGrid";

// Valid filter types
const VALID_FILTER_TYPES = ["category", "audience", "language"] as const;

interface PageProps {
  params: Promise<{ filterType: string; slug: string }>;
}

// Type guard to check if filterType is valid
function isValidFilterType(type: string): type is FilterType {
  return VALID_FILTER_TYPES.includes(type as FilterType);
}

// Get display label for filter type
function getFilterTypeLabel(type: FilterType): string {
  const labels: Record<FilterType, string> = {
    category: "Category",
    audience: "Audience",
    language: "Language",
  };
  return labels[type];
}

// Get emoji for filter type
function getFilterTypeEmoji(type: FilterType): string {
  const emojis: Record<FilterType, string> = {
    category: "📂",
    audience: "👥",
    language: "🌐",
  };
  return emojis[type];
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { filterType, slug } = await params;
  const title = slugToTitle(slug);
  const typeLabel = isValidFilterType(filterType) ? getFilterTypeLabel(filterType as FilterType) : "";

  return {
    title: `${title} - ${typeLabel} | BAPS OTT`,
    description: `Browse ${title} content on BAPS OTT`,
  };
}

// Loading skeleton
function FilterLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error/Not Found component
function FilterNotFound({ 
  filterType, 
  name 
}: { 
  filterType: string; 
  name: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          The {filterType} &quot;{name}&quot; does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Empty state component
function FilterEmpty({ 
  filterType, 
  name 
}: { 
  filterType: FilterType; 
  name: string;
}) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-4xl">{getFilterTypeEmoji(filterType)}</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No Content Yet</h2>
      <p className="text-gray-600 max-w-md">
        There is no content available for &quot;{name}&quot; at the moment.
        Check back later for updates!
      </p>
    </div>
  );
}

// Fetch master data based on filter type
async function fetchMasterData(filterType: FilterType) {
  switch (filterType) {
    case "category":
      return fetchCategories();
    case "audience":
      return fetchAudiences();
    case "language":
      return fetchLanguages();
  }
}

// Server component to fetch and display filtered content
async function FilterPage({ params }: PageProps) {
  const { filterType, slug } = await params;
  const itemTitle = slugToTitle(slug);

  // Validate filter type
  if (!isValidFilterType(filterType)) {
    notFound();
  }

  const validFilterType = filterType as FilterType;

  // Fetch master data to find the matching item
  let masterData: { master_id: number; title: string }[] = [];
  try {
    masterData = await fetchMasterData(validFilterType);
  } catch (error) {
    console.error(`Failed to fetch ${filterType} data:`, error);
    return <FilterNotFound filterType={filterType} name={itemTitle} />;
  }

  // Find the item by title
  const masterItem = findMasterByTitle(masterData, itemTitle);
  if (!masterItem) {
    return <FilterNotFound filterType={filterType} name={itemTitle} />;
  }

  // Fetch content using filter API
  let content: CategoryContentItem[] = [];
  try {
    content = await fetchContentByFilter(validFilterType, masterItem.master_id);
  } catch (error) {
    console.error(`Failed to fetch ${filterType} content:`, error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium mb-1">
                {getFilterTypeLabel(validFilterType)}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {masterItem.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {content.length} {content.length === 1 ? "item" : "items"} available
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {content.length === 0 ? (
          <FilterEmpty filterType={validFilterType} name={masterItem.title} />
        ) : (
          <CategoryContentGrid items={content} />
        )}
      </div>
    </div>
  );
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<FilterLoading />}>
      <FilterPage {...props} />
    </Suspense>
  );
}
