"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSliders } from "react-icons/fi";

import BreadcrumbShop from "@/components/store/catalogpage/BreadcrumbShop";
import CatalogProducts from "@/components/store/catalogpage/CatalogProducts";
import Filters from "@/components/store/catalogpage/filters";
import { ProductFromAPI } from "@/lib/types/product.types";
import { PaginatedApiResponse } from "@/lib/types/apiResponse.types";

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<ProductFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 9,
  });

  // Local filter states for desktop
  const [localGender, setLocalGender] = useState<string[]>(
    searchParams?.get("gender") ? searchParams.get("gender")!.split(",") : []
  );
  const [localCategory, setLocalCategory] = useState<string[]>(
    searchParams?.get("category") ? searchParams.get("category")!.split(",") : []
  );
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    parseInt(searchParams?.get("minPrice") || "0"),
    parseInt(searchParams?.get("maxPrice") || "20000"),
  ]);
  const [localColor, setLocalColor] = useState<string[]>(
    searchParams?.get("color") ? searchParams.get("color")!.split(",") : []
  );
  const [localSize, setLocalSize] = useState<string[]>(
    searchParams?.get("size") ? searchParams.get("size")!.split(",") : []
  );
  const [localShoeSize, setLocalShoeSize] = useState<string[]>(
    searchParams?.get("shoeSize") ? searchParams.get("shoeSize")!.split(",") : []
  );
  const [localMinRating, setLocalMinRating] = useState<number>(
    parseInt(searchParams?.get("minRating") || "0")
  );
  const [localPromo, setLocalPromo] = useState<boolean>(
    searchParams?.get("promo") === "true"
  );

  // Sync local state with searchParams when they change
  useEffect(() => {
    if (!searchParams) return;
    const genderParam = searchParams.get("gender");
    setLocalGender(genderParam ? genderParam.split(",") : []);
    const catParam = searchParams.get("category");
    setLocalCategory(catParam ? catParam.split(",") : []);
    setLocalPriceRange([
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "20000"),
    ]);
    const colorParam = searchParams.get("color");
    setLocalColor(colorParam ? colorParam.split(",") : []);
    const sizeParam = searchParams.get("size");
    setLocalSize(sizeParam ? sizeParam.split(",") : []);
    const shoeSizeParam = searchParams.get("shoeSize");
    setLocalShoeSize(shoeSizeParam ? shoeSizeParam.split(",") : []);
    setLocalMinRating(parseInt(searchParams.get("minRating") || "0"));
    setLocalPromo(searchParams.get("promo") === "true");
  }, [searchParams]);

  // Fetch products based on URL search parameters
  useEffect(() => {
    if (!searchParams) return;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = `/api/products/search?${searchParams.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const jsonData: PaginatedApiResponse<ProductFromAPI[]> =
          await response.json();
        setAllProducts(jsonData.data);
        setPagination(jsonData.pagination);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  // Handler functions to update URL parameters
  const handlePageChange = (newPage: number) => {
    if (!searchParams) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    if (!searchParams) return;
    const sortOptions = [
      { value: "most-popular", sortBy: "noteMoyenne", sortOrder: "desc" },
      { value: "low-price", sortBy: "prix", sortOrder: "asc" },
      { value: "high-price", sortBy: "prix", sortOrder: "desc" },
      { value: "newest", sortBy: "dateCreation", sortOrder: "desc" },
      { value: "oldest", sortBy: "dateCreation", sortOrder: "asc" },
    ];
    const selectedOption = sortOptions.find((option) => option.value === value);
    if (selectedOption) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("sortBy", selectedOption.sortBy);
      newSearchParams.set("sortOrder", selectedOption.sortOrder);
      newSearchParams.set("page", "1");
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleApplyFilters = ({
    gender,
    category,
    priceRange,
    color,
    size,
    shoeSize,
    minRating,
    promo,
  }: {
    gender: string[];
    category: string[];
    priceRange: [number, number];
    color: string[];
    size: string[];
    shoeSize: string[];
    minRating: number;
    promo: boolean;
  }) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || "");
    // Preserve existing query parameter if present
    const query = searchParams?.get("query");
    if (query) newSearchParams.set("query", query);

    // Update filter parameters
    if (gender && gender.length > 0) newSearchParams.set("gender", gender.join(","));
    else newSearchParams.delete("gender");

    if (category && category.length > 0) newSearchParams.set("category", category.join(","));
    else newSearchParams.delete("category");

    newSearchParams.set("minPrice", priceRange[0].toString());
    newSearchParams.set("maxPrice", priceRange[1].toString());

    if (color && color.length > 0) newSearchParams.set("color", color.join(","));
    else newSearchParams.delete("color");

    if (size && size.length > 0) newSearchParams.set("size", size.join(","));
    else newSearchParams.delete("size");

    if (shoeSize && shoeSize.length > 0) newSearchParams.set("shoeSize", shoeSize.join(","));
    else newSearchParams.delete("shoeSize");

    if (minRating > 0) newSearchParams.set("minRating", minRating.toString());
    else newSearchParams.delete("minRating");

    if (promo) newSearchParams.set("promo", "true");
    else newSearchParams.delete("promo");

    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleResetFilters = () => {
    const newSearchParams = new URLSearchParams();
    router.push(`?${newSearchParams.toString()}`);
    console.log("newSearchParams", newSearchParams.toString());
  };

  return (
    <main className="py-5">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-stretch">
          <div className="hidden md:block min-w-[270px] max-w-[270px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filtres</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
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
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          <CatalogProducts
            products={allProducts}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            isLoading={isLoading}
            selectedGender={searchParams?.get("gender") ? searchParams.get("gender")!.split(",") : []}
            selectedCategory={searchParams?.get("category") ? searchParams.get("category")!.split(",") : []}
            priceRange={[
              parseInt(searchParams?.get("minPrice") || "0"),
              parseInt(searchParams?.get("maxPrice") || "20000"),
            ]}
            selectedColor={searchParams?.get("color") ? searchParams.get("color")!.split(",") : []}
            selectedSize={searchParams?.get("size") ? searchParams.get("size")!.split(",") : []}
            selectedShoeSize={searchParams?.get("shoeSize") ? searchParams.get("shoeSize")!.split(",") : []}
            selectedMinRating={parseInt(searchParams?.get("minRating") || "0")}
            selectedPromo={searchParams?.get("promo") === "true"}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </main>
  );
}
