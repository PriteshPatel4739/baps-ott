"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();
  
  // Check if current page is an auth page (login/register)
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  // Hide footer on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="w-full py-4 bg-red-600 text-center text-sm text-white">
      <p className="px-4 leading-relaxed">
        © 1999-2025 Bochasanwasi Shri Akshar Purushottam Swaminarayan Sanstha,
        Swaminarayan Aksharpith |
        <Link href="/privacy-policy" className="underline mx-1">
          Privacy Policy
        </Link>
        |
        <Link href="/terms-conditions" className="underline mx-1">
          Terms & Conditions
        </Link>
        |
        <Link href="/feedback" className="underline mx-1">
          Feedback
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
