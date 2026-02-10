"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

type Gender = {
  nom: string;
  description: string;
};

const gendersData: Gender[] = [
  {
    nom: "Homme",
    description: "Vêtements et accessoires conçus pour hommes.",
  },
  {
    nom: "Femme",
    description: "Vêtements et accessoires conçus pour femmes.",
  },
  {
    nom: "Enfant",
    description: "Vêtements et accessoires pour enfants et adolescents.",
  },
  {
    nom: "Unisexe",
    description: "Vêtements et accessoires adaptés à tous les genres.",
  },
];

interface GendersSectionProps {
  selectedNoms: string[];
  onSelect: (noms: string[]) => void;
}

export default function GendersSection({
  selectedNoms,
  onSelect,
}: GendersSectionProps) {
  const handleSelect = (nom: string) => {
    if (selectedNoms.includes(nom)) {
      onSelect(selectedNoms.filter((n) => n !== nom));
    } else {
      onSelect([...selectedNoms, nom]);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-genders">
      <AccordionItem value="filter-genders" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Genre
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0 overflow-visible">
          <div className="flex flex-col space-y-3 text-black/80">
            {gendersData.map((gender) => (
              <div className="relative group" key={gender.nom}>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`gender-${gender.nom}`}
                    checked={selectedNoms.includes(gender.nom)}
                    onChange={() => handleSelect(gender.nom)}
                  />
                  <label
                    htmlFor={`gender-${gender.nom}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {gender.nom}
                  </label>
                </div>
                <div className="absolute z-10 hidden group-hover:block w-64 bg-white border border-gray-200 shadow-md text-sm text-gray-700 p-2 rounded-md top-full mt-1 left-0">
                  {gender.description}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
