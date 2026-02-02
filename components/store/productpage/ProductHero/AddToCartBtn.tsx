"use client";

// Redux
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AddToCartBtn = ({
  data,
}: {
  data: ProductFromAPI & { quantity: number };
}) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  return (
    <button
      type="button"
      className={cn(
        "bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white transition-all active:scale-95",
        {
          "hover:bg-black/80 cursor-pointer": data.quantity > 0,
          "bg-gray-400 cursor-not-allowed opacity-60": data.quantity === 0,
        }
      )}
      disabled={data.quantity === 0}
      onClick={() => {
        dispatch(
          addToCart({
            id: data.id,
            name: data.nom,
            imagePublicId: data.images[0].imagePublicId,
            price: data.prix,
            color: colorSelection.id
              ? { id: colorSelection.id, name: colorSelection.nom }
              : undefined,
            size: sizeSelection.id
              ? { id: sizeSelection.id, name: sizeSelection.nom }
              : undefined,
            quantity: data.quantity,
          })
        );
        toast.success("Produit ajouté au panier");
      }}
    >
      Ajouter au panier
    </button>
  );
};

export default AddToCartBtn;
