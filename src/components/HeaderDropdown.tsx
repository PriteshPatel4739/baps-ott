"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  id: number;
  title: string;
  href?: string;
}

interface HeaderDropdownProps {
  label: string;
  options: DropdownOption[];
  basePath?: string; // e.g., "/category" for category links
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  label,
  options,
  basePath,
}) => {
  const [open, setOpen] = useState(false);

  // Generate URL-friendly slug from title
  const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 hover:text-gray-900 transition-colors py-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 top-full min-w-48 z-[100]">
          {/* Invisible bridge to prevent gap issues */}
          <div className="h-1" />
          <div className="rounded-lg border border-gray-200 bg-white py-2 shadow-lg max-h-64 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : (
              options.map((option) => {
                const href =
                  option.href || (basePath ? `${basePath}/${toSlug(option.title)}` : "#");

                return (
                  <Link
                    key={option.id}
                    href={href}
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {option.title}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
