"use client";

import CartCounter from "@/components/ui/CartCounter";
import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { ProductFromAPI } from "@/lib/types/product.types";

const AddToCardSection = ({ data }: { data: ProductFromAPI }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-[60px] md:bottom-0 left-0 p-4 md:p-0 z-40 flex items-center justify-between sm:justify-start md:justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
      <CartCounter onAdd={setQuantity} onRemove={setQuantity} />
      <AddToCartBtn data={{ ...data, quantity }} />
    </div>
  );
};

export default AddToCardSection;
