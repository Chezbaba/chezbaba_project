"use client";

import { Button } from "@/components/ui/button";
import CategoriesSection from "@/components/store/catalogpage/filters/CategoriesSection";
import ColorsSection from "@/components/store/catalogpage/filters/ColorsSection";
import PriceSection from "@/components/store/catalogpage/filters/PriceSection";
import SizeSection from "@/components/store/catalogpage/filters/SizeSection";
import GendersSection from "@/components/store/catalogpage/filters/GendersSection";
import ShoesSizeSection from "@/components/store/catalogpage/filters/ShoesSizeSection";
import { Star } from "lucide-react";

interface FiltersProps {
  localGender: string[];
  setLocalGender: (value: string[]) => void;
  localCategory: string[];
  setLocalCategory: (value: string[]) => void;
  localPriceRange: [number, number];
  setLocalPriceRange: (value: [number, number]) => void;
  localColor: string[];
  setLocalColor: (value: string[]) => void;
  localSize: string[];
  setLocalSize: (value: string[]) => void;
  localShoeSize: string[];
  setLocalShoeSize: (value: string[]) => void;
  localMinRating: number;
  setLocalMinRating: (value: number) => void;
  localPromo: boolean;
  setLocalPromo: (value: boolean) => void;
  onApplyFilters: (filters: {
    gender: string[];
    category: string[];
    priceRange: [number, number];
    color: string[];
    size: string[];
    shoeSize: string[];
    minRating: number;
    promo: boolean;
  }) => void;
  onResetFilters: () => void;
}

export default function Filters({
  localGender,
  setLocalGender,
  localCategory,
  setLocalCategory,
  localPriceRange,
  setLocalPriceRange,
  localColor,
  setLocalColor,
  localSize,
  setLocalSize,
  localShoeSize,
  setLocalShoeSize,
  localMinRating,
  setLocalMinRating,
  localPromo,
  setLocalPromo,
  onApplyFilters,
  onResetFilters,
}: FiltersProps) {
  const handleApplyFilters = () => {
    onApplyFilters({
      gender: localGender,
      category: localCategory,
      priceRange: localPriceRange,
      color: localColor,
      size: localSize,
      shoeSize: localShoeSize,
      minRating: localMinRating,
      promo: localPromo,
    });
  };

  const handleResetFilters = () => {
    setLocalGender([]);
    setLocalCategory([]);
    setLocalPriceRange([0, 20000]);
    setLocalColor([]);
    setLocalSize([]);
    setLocalShoeSize([]);
    setLocalMinRating(0);
    setLocalPromo(false);
    onResetFilters();
  };

  const ratingOptions = [
    { label: "Toutes les notes", value: 0 },
    { label: "1+ étoile", value: 1 },
    { label: "2+ étoiles", value: 2 },
    { label: "3+ étoiles", value: 3 },
    { label: "4+ étoiles", value: 4 },
    { label: "5 étoiles", value: 5 },
  ];

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection
        selectedCategories={localCategory}
        onSelect={setLocalCategory}
      />

      <hr className="border-t-black/10" />
      <GendersSection selectedNoms={localGender} onSelect={setLocalGender} />

      <hr className="border-t-black/10" />
      <PriceSection value={localPriceRange} onChange={setLocalPriceRange} />

      <hr className="border-t-black/10" />
      <ColorsSection selectedNoms={localColor} onSelect={setLocalColor} />

      <hr className="border-t-black/10" />
      <SizeSection selectedNoms={localSize} onSelect={setLocalSize} />

      <hr className="border-t-black/10" />
      <ShoesSizeSection selectedNoms={localShoeSize} onSelect={setLocalShoeSize} />

      {/* Rating & Promo Section */}
      <hr className="border-t-black/10" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-black/40" />
          <span className="font-bold text-black text-sm">Note minimum</span>
        </div>
        <select
          value={localMinRating}
          onChange={(e) => setLocalMinRating(Number(e.target.value))}
          className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm focus:ring-2 focus:ring-black/20 focus:outline-none bg-white"
        >
          {ratingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={localPromo}
            onChange={(e) => setLocalPromo(e.target.checked)}
            className="w-4 h-4 rounded border-black/20 text-black focus:ring-black accent-black"
          />
          <span className="text-sm font-medium text-black">En promotion</span>
        </label>
      </div>

      <hr className="border-t-black/10" />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
        onClick={handleApplyFilters}
      >
        Appliquer les filtres
      </Button>

      <Button
        type="button"
        className="bg-gray-200 text-black w-full rounded-full text-sm font-medium py-4 h-12"
        onClick={handleResetFilters}
      >
        Réinitialiser les filtres
      </Button>
    </>
  );
}
