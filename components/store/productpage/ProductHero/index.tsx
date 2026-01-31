"use client";

// UI Components
import Rating from "@/components/ui/Rating";

// Components
import PhotoSection from "./PhotoSection";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

// Utils & Types
import { cn } from "@/lib/utils";
import { ProductFromAPI } from "@/lib/types/product.types";

// Styles
import { integralCF } from "@/styles/fonts";
import { Flag, Store } from "lucide-react";
import Link from "next/link";

const ProductHero = ({ product }: { product: ProductFromAPI }) => {
  return (
    <section className="mb-11">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={product} />
        </div>
        <div className="relative">
          <h1
            className={cn([
              integralCF.className,
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
            ])}
          >
            {product.nom}
          </h1>

          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={product.noteMoyenne}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {product.noteMoyenne.toFixed(1)}
              <span className="text-black/60">/5</span>
            </span>
            <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
              {`(${product.totalEvaluations} avis)`}
            </span>
          </div>

          <span className="font-bold text-black text-2xl sm:text-[32px]">
            {product.prix} DA
          </span>

          <p className="text-sm sm:text-base text-black/60 mb-5">
            {product.objet}
          </p>

          <div className="flex items-center justify-between mb-4">
            {/* Profile Vendeur */}
            <div className="flex items-center relative group">
              <Store className="w-4 h-4 mr-2 text-gray-600" />
              {product.type === "boutique" ? (
                <>
                  <div className="text-xs xl:text-sm bg-[#F0EEED] text-black font-medium px-2.5 py-1 rounded-full">
                    Produit officiel
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 w-max max-w-[200px] text-center">
                    Vendu et expédié directement par notre boutique.
                  </div>
                </>
              ) : (
                <Link
                  href={`/shops/${product.vendeur!.id}`}
                  className="text-xs xl:text-sm bg-[#F0EEED] text-gray-700 font-medium px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Vendu par : {product.vendeur!.nomBoutique}
                </Link>
              )}
            </div>

            {/* Report */}
            <Link
              href={`/product/${product.id}/report`}
              className="flex items-center text-sm text-red-500 hover:text-red-700"
            >
              <Flag className="w-4 h-4 mr-1" />
              Signaler ce produit
            </Link>
          </div>

          <hr className="h-[1px] border-t-black/10 mb-5" />

          <ColorSelection colors={product.couleurs} />
          <hr className="h-[1px] border-t-black/10 my-5" />

          <SizeSelection sizes={product.tailles} />
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
          <AddToCardSection data={product} />
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
