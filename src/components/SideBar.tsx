"use client";
import React from "react";
import { Home, Clock, Bookmark, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

const menu = [
  { label: "Primary", icon: <Home size={18} />, href: "/profile" },
  { label: "My History", icon: <Clock size={18} />, href: "/history" },
  { label: "Bookmarks", icon: <Bookmark size={18} />, href: "/bookmarks" },
  { label: "Favorite", icon: <Heart size={18} />, href: "/favorite" },
];

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all auth data
    logout();
    // Redirect to login page
    router.push("/login");
  };

  return (
    <aside className="w-60 bg-white border-r p-4 hidden md:block">
      <nav className="space-y-6">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 text-gray-700 hover:text-red-500 transition font-medium"
          >
            <span className="text-red-500">{item.icon}</span> {item.label}
          </Link>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-700 hover:text-red-500 transition font-medium w-full"
        >
          <span className="text-red-500"><LogOut size={18} /></span> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
