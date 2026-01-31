import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LookChoicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">Votre look, votre choix</h1>
      <p className="mb-8 text-lg text-gray-600">Découvrez notre sélection et trouvez le style qui vous correspond.</p>
      <Button className="rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" asChild>
        <Link href="/catalog">Commencer le shopping</Link>
      </Button>
    </div>
  );
}
