"use client";

import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import SideBar from "../../components/SideBar";
import { useRouter } from "next/navigation";
import api, { getAuthHeaders, isAuthenticated } from "@/lib/api";

interface HistoryItem {
  content_id: number;
  title: string;
  thumbnail_horizontal_url: string | null;
}

const History = () => {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/user/history", {
          headers: getAuthHeaders(),
        });
        setHistory(data || []);
      } catch (e) {
        console.error("Error fetching history:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
        <SideBar />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-black">My History</h1>
          <div className="h-px bg-gray-300 mt-2 mb-6"></div>

          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No watch history yet. Start watching some content!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {history.map((item, index) => (
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

export default History;
