"use client";

import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { ProductFromAPI } from "@/lib/types/product.types";
import { getImageUrlFromPublicId } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import QuickAddToCartButton from "./QuickAddToCartButton";

type ProductCardProps = {
  data: ProductFromAPI;
  showFavorite?: boolean;
  showAddToCart?: boolean;
};

const ProductCard = ({ data, showFavorite = true, showAddToCart = true }: ProductCardProps) => {
  return (
    <div className="relative flex flex-col items-start justify-start aspect-auto">
      {/* Action Buttons - Top Right */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        {showFavorite && (
          <FavoriteButton
            productId={data.id}
            initialIsFavorite={(data as { isFavorite?: boolean }).isFavorite}
            size="sm"
          />
        )}
        {showAddToCart && (
          <QuickAddToCartButton
            productId={data.id}
            productName={data.nom}
            productPrice={data.prixPromo || data.prix}
            productImagePublicId={data.images[0]?.imagePublicId || null}
            size="sm"
          />
        )}
      </div>

      <Link
        href={`/product/${data.id}`}
        className="flex flex-col items-start justify-start w-full relative"
      >
        <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden relative">
          {/* Badge New */}
          {new Date(data.dateCreation) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <span className="absolute top-2 left-2 bg-[#EA9010] text-white text-[10px] xl:text-xs font-bold px-2 py-1 rounded-full z-20">
              New
            </span>
          )}

          <Image
            src={
              data.images[0]?.imagePublicId
                ? getImageUrlFromPublicId(data.images[0].imagePublicId)
                : "/images/placeholder.png"
            }
            width={295}
            height={298}
            className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
            alt={data.nom}
            priority
          />
        </div>

        {/* Vendeur / Boutique Name */}
        {data.vendeur?.nomBoutique && (
          <span className="text-gray-500 text-xs mb-1 block">
            {data.vendeur.nomBoutique}
          </span>
        )}


        <strong className="text-black xl:text-xl text-start line-clamp-1" title={data.nom}>{data.nom}</strong>

        <div className="w-full flex flex-col sm:flex-row justify-between items-start mb-1 xl:mb-2">
          {/* Rating removed for brevity if needed, or kept */}
          <div className="flex items-center">
            <Rating
              initialValue={data.noteMoyenne}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={16}
              readonly
            />
            <span className="text-black text-xs xl:text-sm ml-1 pb-0.5 xl:pb-0">
              {data.noteMoyenne.toFixed(1)} <span className="text-black/60">/5</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col w-full">
          {data.prixPromo && data.prixPromo > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FD6C9E] text-xl xl:text-2xl">
                  {data.prixPromo} FCFA
                </span>
                <span className="text-xs font-bold bg-[#FD6C9E]/10 text-[#FD6C9E] px-1.5 py-0.5 rounded">
                  -{Math.round(((data.prix - data.prixPromo) / data.prix) * 100)}%
                </span>
              </div>
              <span className="text-gray-400 text-sm line-through">
                {data.prix} FCFA
              </span>
            </div>
          ) : (
            <span className="font-bold text-black text-xl xl:text-2xl">
              {data.prix} FCFA
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
