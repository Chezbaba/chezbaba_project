"use client";

import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/carts/cartsSlice";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";

type QuickAddToCartButtonProps = {
    productId: string;
    productName: string;
    productPrice: number;
    productImagePublicId: string | null;
    className?: string;
    size?: "sm" | "md" | "lg";
};

export default function QuickAddToCartButton({
    productId,
    productName,
    productPrice,
    productImagePublicId,
    className = "",
    size = "md",
}: QuickAddToCartButtonProps) {
    const dispatch = useAppDispatch();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(
            addToCart({
                id: productId,
                name: productName,
                imagePublicId: productImagePublicId || "",
                price: productPrice,
                quantity: 1,
            })
        );

        toast.success("Produit ajouté au panier", {
            description: productName,
            duration: 2000,
        });
    };

    const sizeClasses = {
        sm: "w-7 h-7 text-sm",
        md: "w-9 h-9 text-base",
        lg: "w-11 h-11 text-lg",
    };

    const iconSize = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    return (
        <button
            onClick={handleAddToCart}
            className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-black text-white
        shadow-md
        transition-all duration-200
        hover:scale-110 hover:bg-gray-800
        active:scale-95
        ${className}
      `}
            aria-label="Ajouter au panier"
            title="Ajouter au panier"
        >
            <FiShoppingCart size={iconSize[size]} />
        </button>
    );
}
