"use client";

import React from "react";
import Card from "../../components/Card";
import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { getAuthHeaders, isAuthenticated } from "@/lib/api";

interface FavoriteItem {
  content_id: number;
  title: string;
  thumbnail_horizontal_url: string | null;
}

const Favorite = () => {
  const router = useRouter();
  const [favorites, setFavorite] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data } = await api.get("/user/preferences/favorites", {
          headers: getAuthHeaders(),
        });
        setFavorite(data || []);
      } catch (e) {
        console.error("Error fetching favorites:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <SideBar />

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-black">My Choice</h1>
          <div className="h-px bg-gray-300 mt-2 mb-6"></div>

          {/* Cards Section */}
          {favorites.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No favorites yet. Start adding your favorite content!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item, index) => (
                <Card
                  key={index}
                  image={item.thumbnail_horizontal_url || ""}
                  title={item.title}
                  onCardClick={() => router.push(`/content/${item.content_id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorite;
