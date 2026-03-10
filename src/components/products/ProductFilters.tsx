"use client";

import { CATEGORY_LABELS, STONE_LABELS, METAL_LABELS } from "@/lib/constants";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedStone: string;
  selectedMetal: string;
  sortBy: string;
  onCategoryChange: (val: string) => void;
  onStoneChange: (val: string) => void;
  onMetalChange: (val: string) => void;
  onSortChange: (val: string) => void;
}

export default function ProductFilters({
  selectedCategory,
  selectedStone,
  selectedMetal,
  sortBy,
  onCategoryChange,
  onStoneChange,
  onMetalChange,
  onSortChange,
}: ProductFiltersProps) {
  const selectClass =
    "font-ui text-sm text-ocean bg-white border border-gold/20 rounded px-3 py-2 focus:outline-none focus:border-gold appearance-none cursor-pointer";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All Categories</option>
        {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={selectedStone}
        onChange={(e) => onStoneChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All Stones</option>
        {Object.entries(STONE_LABELS).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={selectedMetal}
        onChange={(e) => onMetalChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All Metals</option>
        {Object.entries(METAL_LABELS).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={selectClass}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );
}
