"use client";

import { useEffect, useRef, useState } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import { ProductFromAPI } from "@/lib/types/product.types";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import Image from "next/image";

const ProductsSec = () => {
  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shopProducts, setShopProducts] = useState<ProductFromAPI[] | null>(
    null
  );
  const [marketplaceProducts, setMarketplaceProducts] = useState<
    ProductFromAPI[] | null
  >(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProducts = async () => {
      try {
        const [shopRes, marketRes] = await Promise.all([
          fetchPaginatedDataFromAPI<ProductFromAPI[]>(
            `/api/products?sortBy=noteMoyenne&sortOrder=desc&page=1&pageSize=4&type=boutique`
          ),
          fetchPaginatedDataFromAPI<ProductFromAPI[]>(
            `/api/products?sortBy=noteMoyenne&sortOrder=desc&page=1&pageSize=4&type=marketplace`
          ),
        ]);

        if (
          shopRes.error ||
          !shopRes.data?.data ||
          marketRes.error ||
          !marketRes.data?.data
        ) {
          setHasError(true);
        } else {
          setShopProducts(shopRes.data.data);
          setMarketplaceProducts(marketRes.data.data);
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-20 gap-4 text-gray-700">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Chargement des produits...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-20 gap-4 text-[#f74951]">
        {/* Error icon: Circle with an X mark */}
        <Image
          src="/icons/error.png"
          alt="Error Icon"
          width={50}
          height={50}
          className="h-15 w-15"
        />
        <p className="text-lg font-semibold text-center my-5">
          Une erreur est survenue lors du chargement des produits.
          <br />
          Veuillez réessayer plus tard.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <section className="my-[50px] sm:my-[72px]">
      <ProductListSec
        title="Explorez Notre Boutique"
        description="Produits vendus et expédiés directement par nous"
        data={shopProducts ?? []}
        viewAllLink="/catalog?type=boutique"
      />
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec
          title="Explorez Notre Marketplace"
          description="Produits proposés par nos vendeurs partenaires"
          data={marketplaceProducts ?? []}
          viewAllLink="/catalog?type=marketplace"
        />
      </div>
    </section>
  );
};

export default ProductsSec;
