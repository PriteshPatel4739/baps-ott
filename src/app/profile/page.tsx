"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/SideBar";
import ProfileCard from "../../components/ProfileCard";
import AddProfileCard from "../../components/AddProfileCard";
import api, { getAuthHeaders, isAuthenticated } from "@/lib/api";

interface ProfileItem {
  user_id: number;
  name: string;
  email: string;
}

const Profile = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchProfiles = async () => {
      try {
        const { data } = await api.get("/users/me", {
          headers: getAuthHeaders(),
        });
        setProfiles([data]);
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
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
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          <div className="h-px bg-gray-300 mt-2 mb-6"></div>

          <div className="flex gap-6 flex-wrap md:flex-nowrap overflow-x-auto pb-4 scrollbar-hide">
            {profiles.map((p) => (
              <ProfileCard
                key={p.user_id}
                image="/assets/images/psm_1.jpg"
                name={p.name}
                email={p.email}
                id={p.user_id.toString()}
              />
            ))}

            <AddProfileCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
