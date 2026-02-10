"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FiSliders } from "react-icons/fi";
import Filters from ".";

interface MobileFiltersProps {
  selectedGender: string[];
  selectedCategory: string[];
  priceRange: [number, number];
  selectedColor: string[];
  selectedSize: string[];
  selectedShoeSize: string[];
  selectedMinRating: number;
  selectedPromo: boolean;
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

const MobileFilters = ({
  selectedGender,
  selectedCategory,
  priceRange,
  selectedColor,
  selectedSize,
  selectedShoeSize,
  selectedMinRating,
  selectedPromo,
  onApplyFilters,
  onResetFilters,
}: MobileFiltersProps) => {
  const [localGender, setLocalGender] = useState<string[]>(selectedGender);
  const [localCategory, setLocalCategory] = useState<string[]>(
    selectedCategory
  );
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(priceRange);
  const [localColor, setLocalColor] = useState<string[]>(selectedColor);
  const [localSize, setLocalSize] = useState<string[]>(selectedSize);
  const [localShoeSize, setLocalShoeSize] = useState<string[]>(selectedShoeSize);
  const [localMinRating, setLocalMinRating] = useState<number>(selectedMinRating);
  const [localPromo, setLocalPromo] = useState<boolean>(selectedPromo);

  // Sync local state with searchParams props when they change
  useEffect(() => {
    setLocalGender(selectedGender);
    setLocalCategory(selectedCategory);
    setLocalPriceRange(priceRange);
    setLocalColor(selectedColor);
    setLocalSize(selectedSize);
    setLocalShoeSize(selectedShoeSize);
    setLocalMinRating(selectedMinRating);
    setLocalPromo(selectedPromo);
  }, [
    selectedGender,
    selectedCategory,
    priceRange,
    selectedColor,
    selectedSize,
    selectedShoeSize,
    selectedMinRating,
    selectedPromo,
  ]);

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <button
            type="button"
            className="h-8 w-8 rounded-full bg-[#F0F0F0] text-black p-1 md:hidden"
          >
            <FiSliders className="text-base mx-auto" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filtres</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <DrawerTitle className="hidden">Filtres</DrawerTitle>
            <DrawerDescription className="hidden">
              Sélectionnez vos filtres
            </DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[90%] overflow-y-auto w-full px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <Filters
              localGender={localGender}
              setLocalGender={setLocalGender}
              localCategory={localCategory}
              setLocalCategory={setLocalCategory}
              localPriceRange={localPriceRange}
              setLocalPriceRange={setLocalPriceRange}
              localColor={localColor}
              setLocalColor={setLocalColor}
              localSize={localSize}
              setLocalSize={setLocalSize}
              localShoeSize={localShoeSize}
              setLocalShoeSize={setLocalShoeSize}
              localMinRating={localMinRating}
              setLocalMinRating={setLocalMinRating}
              localPromo={localPromo}
              setLocalPromo={setLocalPromo}
              onApplyFilters={onApplyFilters}
              onResetFilters={onResetFilters}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileFilters;
