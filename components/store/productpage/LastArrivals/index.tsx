import ProductListSec from "@/components/common/ProductListSec";
import { ProductFromAPI } from "@/lib/types/product.types";
import React from "react";

interface LastArrivalsProps {
  products: ProductFromAPI[];
}

export default function LastArrivals({ products }: LastArrivalsProps) {
  return (
    <div className="mb-[50px] sm:mb-20">
      <ProductListSec title="Nos derniers arrivages" data={products} />
    </div>
  );
}
