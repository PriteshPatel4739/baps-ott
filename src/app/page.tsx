import Carousel from "@/components/Carousel";
import CardSlider from "@/components/CardSlider";
import { fetchHomeSections } from "@/lib/api";
import type { ContentItem, CardItemProps } from "@/lib/types";

/**
 * Convert API content items to card display format
 */
function toCardItems(items: ContentItem[]): CardItemProps[] {
  return items.map((item) => ({
    contentId: item.content_id,
    title: item.title,
    subTitle: item.sub_title,
    // Use thumbnail from API or fallback to default image
    image:
      item.thumbnail_horizontal_url ||
      item.thumbnail_vertical_url ||
      "/assets/images/default.jpg",
  }));
}

/**
 * Convert slider items to banner format for carousel
 */
function toBannerItems(items: ContentItem[]) {
  return items.map((item) => ({
    id: `banner-${item.content_id}`,
    contentId: item.content_id,
    title: item.title,
    description: item.sub_title || undefined,
    // Use provided thumbnail or generate one
    image:
      item.thumbnail_horizontal_url ||
      item.thumbnail_vertical_url ||
      "/assets/images/default.jpg",
  }));
}

export default async function Home() {
  // Fetch home sections from API
  const data = await fetchHomeSections();

  // Use slider data for carousel if available, otherwise use fallback
  const carouselItems = data.slider?.length
    ? toBannerItems(data.slider)
    : [
        {
          id: "banner-1",
          title: "Pramukh Swami Maharaj - In Commemoration",
          description: "A tribute to a great spiritual leader",
          image: "/assets/images/fik_1.jpg",
        },
        {
          id: "banner-2",
          title: "First Of It's Kind",
          description: "Unique documentary series",
          image: "/assets/images/fik_2.jpg",
        },
        {
          id: "banner-3",
          title: "Guruhari Darshan",
          description: "Daily spiritual guidance",
          image: "/assets/images/psm_2.jpg",
        },
      ];

  // Build sections with data - only include sections with content
  const sections = [
    data.trending?.length && {
      title: "Trending",
      items: toCardItems(data.trending),
    },
    data.recommended?.length && {
      title: "Recommended",
      items: toCardItems(data.recommended),
    },
    data.new_releases?.length && {
      title: "New Releases",
      items: toCardItems(data.new_releases),
    },
  ].filter(Boolean) as { title: string; items: CardItemProps[] }[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <div className="px-4 md:px-6 pt-4">
        <div className="rounded-xl overflow-hidden">
          <Carousel items={carouselItems} autoPlayInterval={5000} />
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 md:px-6 pt-4 space-y-6">
        {sections.map((section, index) => (
          <CardSlider
            key={`section-${section.title}-${index}`}
            heading={section.title}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
}
