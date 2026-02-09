"use client";

import Image from "next/image";
import { Store, Star, Package, MessageCircle, Calendar, ShieldCheck } from "lucide-react";
import { getImageUrlFromPublicId } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShopHeaderProps {
    shop: {
        id: string;
        nomBoutique: string;
        description: string | null;
        imagePublicId: string | null;
        proprietaire: {
            nom: string;
            prenom: string;
        };
        dateCreation: string;
        stats: {
            totalProduits: number;
            noteMoyenne: number;
            totalAvis: number;
        };
    };
}

const ShopHeader = ({ shop }: ShopHeaderProps) => {
    const memberSince = new Date(shop.dateCreation).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
    });

    return (
        <section className="relative overflow-hidden bg-white border-b border-gray-100">
            {/* Hero Background with glassmorphism effect */}
            <div className="h-48 md:h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900">
                    <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 overflow-hidden"
                    >
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-24 md:-mt-32 pb-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                        {/* Logo Shop avec Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="relative group"
                        >
                            <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden border-[6px] border-white shadow-2xl bg-gray-50 flex items-center justify-center">
                                <Image
                                    src={
                                        shop.imagePublicId
                                            ? getImageUrlFromPublicId(shop.imagePublicId)
                                            : "/icons/user.svg"
                                    }
                                    alt={shop.nomBoutique}
                                    width={208}
                                    height={208}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-black text-white p-3 rounded-xl shadow-lg border-2 border-white">
                                <Store className="w-6 h-6" />
                            </div>
                        </motion.div>

                        {/* Shop Details */}
                        <div className="flex-1 text-center md:text-left pt-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                                <h1 className={cn([integralCF.className, "text-3xl md:text-5xl text-gray-900"])}>
                                    {shop.nomBoutique}
                                </h1>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100 self-center md:self-auto">
                                    <ShieldCheck className="w-4 h-4" />
                                    Vendeur Vérifié
                                </div>
                            </div>

                            <p className="text-gray-600 text-base md:text-lg mb-6 max-w-2xl mx-auto md:mx-0 leading-relaxed italic">
                                {shop.description || "Une boutique passionnée par la mode et la qualité sur MEGA SHOP."}
                            </p>

                            {/* Stats Bar */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6">
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Produits</span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                        <Package className="w-4 h-4 text-black" />
                                        <span className="font-bold text-gray-900">{shop.stats.totalProduits}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Note</span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-gray-900">{shop.stats.noteMoyenne.toFixed(1)}</span>
                                        <span className="text-gray-400 text-sm">/5</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avis</span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                        <MessageCircle className="w-4 h-4 text-black" />
                                        <span className="font-bold text-gray-900">{shop.stats.totalAvis}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ancienneté</span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                        <Calendar className="w-4 h-4 text-black" />
                                        <span className="text-sm font-medium text-gray-600">{memberSince}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopHeader;
