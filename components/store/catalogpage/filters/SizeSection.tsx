"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SizeFromAPI } from "@/lib/types/size.types";

const sizes: SizeFromAPI[] = [
  { id: "1", nom: "Standart" },
  { id: "2", nom: "S" },
  { id: "3", nom: "M" },
  { id: "4", nom: "L" },
  { id: "5", nom: "XL" },
  { id: "6", nom: "XXL" },
  { id: "7", nom: "3XL" },
  { id: "8", nom: "2Y" },
  { id: "9", nom: "3Y" },
  { id: "10", nom: "4Y" },
  { id: "11", nom: "5Y" },
  { id: "12", nom: "6Y" },
];

interface SizeSectionProps {
  selectedNoms: string[];
  onSelect: (noms: string[]) => void;
}

export default function SizeSection({
  selectedNoms,
  onSelect,
}: SizeSectionProps) {
  const handleSelect = (nom: string) => {
    if (selectedNoms.includes(nom)) {
      onSelect(selectedNoms.filter((n) => n !== nom));
    } else {
      onSelect([...selectedNoms, nom]);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Tailles Vêtements
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizes.map((size) => (
              <button
                key={size.nom}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                  selectedNoms.includes(size.nom) && "bg-black font-medium text-white",
                ])}
                onClick={() => handleSelect(size.nom)}
              >
                {size.nom}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
