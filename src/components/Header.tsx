"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import HeaderDropdown, { DropdownOption } from "./HeaderDropdown";
import {
  fetchCategories,
  fetchAudiences,
  fetchLanguages,
  isAuthenticated,
} from "@/lib/api";
import type { MasterCategory, MasterAudience, MasterLanguage } from "@/lib/types";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<DropdownOption[]>([]);
  const [audiences, setAudiences] = useState<DropdownOption[]>([]);
  const [languages, setLanguages] = useState<DropdownOption[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading

  // Check if current page is an auth page (login/register)
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  useEffect(() => {
    // Check if user is logged in using the isAuthenticated helper
    setIsLoggedIn(isAuthenticated());
  }, [pathname]);

  useEffect(() => {
    const fetchMasters = async () => {
      // Fetch categories
      try {
        const catData = await fetchCategories();
        const mappedCategories = (catData || []).map((cat: MasterCategory) => ({
          id: cat.master_id,
          title: cat.title,
        }));
        setCategories(mappedCategories);
      } catch {
        // Failed to fetch categories
      }

      // Fetch audiences
      try {
        const audData = await fetchAudiences();
        const mappedAudiences = (audData || []).map((aud: MasterAudience) => ({
          id: aud.master_id,
          title: aud.title,
        }));
        setAudiences(mappedAudiences);
      } catch {
        // Failed to fetch audiences
      }

      // Fetch languages
      try {
        const langData = await fetchLanguages();
        const mappedLanguages = (langData || []).map((lang: MasterLanguage) => ({
          id: lang.master_id,
          title: lang.title,
        }));
        setLanguages(mappedLanguages);
      } catch {
        // Failed to fetch languages
      }
    };

    fetchMasters();
  }, []);

  // Hide header on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/logo.png"
              alt="BAPS OTT"
              className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="h-8 w-px bg-gray-300" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="text-red-500 hover:text-red-600 transition-colors">
            Home
          </Link>
          <HeaderDropdown
            label="Categories"
            options={categories}
            basePath="/category"
          />
          <HeaderDropdown
            label="Audience"
            options={audiences}
            basePath="/audience"
          />
          <HeaderDropdown
            label="Language"
            options={languages}
            basePath="/language"
          />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/search")}
            className="text-gray-700 hover:text-red-600 transition-colors"
          >
            <IoSearch size="1.5em" />
          </button>

          {/* Show profile only when logged in, Login button when not logged in */}
          {isLoggedIn === null ? (
            // Loading state - show nothing or a placeholder
            <div className="h-9 w-9" />
          ) : isLoggedIn ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/assets/images/profile.png"
              alt="Profile"
              onClick={() => router.push("/profile")}
              className="h-9 w-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-red-500 transition-all"
            />
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
