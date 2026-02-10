"use client";
import Filter from "@/components/Filter";

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">Search</h1>
        <Filter />
      </div>
    </div>
  );
};

export default SearchPage;
