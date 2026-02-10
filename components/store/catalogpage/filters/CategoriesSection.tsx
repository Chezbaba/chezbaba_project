"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  id: string;
  nom: string;
  description: string | null;
  sousCategories?: Category[];
};

interface CategoriesSectionProps {
  selectedCategories: string[];
  onSelect: (categories: string[]) => void;
}

export default function CategoriesSection({
  selectedCategories,
  onSelect,
}: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error loading categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCheckboxChange = (nom: string, checked: boolean) => {
    if (checked) {
      onSelect([...selectedCategories, nom]);
    } else {
      onSelect(selectedCategories.filter((c) => c !== nom));
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren =
      category.sousCategories && category.sousCategories.length > 0;
    const isExpanded = expanded.includes(category.id);
    const isSelected = selectedCategories.includes(category.nom);

    return (
      <div key={category.id} className="select-none">
        <div
          className={`flex items-center space-x-2 py-1 ${level > 0 ? "ml-4 border-l pl-2 border-gray-200" : ""
            }`}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(category.id)}
              className="mr-1 text-gray-500 hover:text-black"
            >
              {isExpanded ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
            </button>
          ) : (
            <div className="w-4 mr-1"></div> // Spacer
          )}

          <Checkbox
            id={`cat-${category.id}`}
            checked={isSelected}
            onChange={(e) =>
              handleCheckboxChange(category.nom, e.target.checked)
            }
          />
          <Label
            htmlFor={`cat-${category.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
          >
            {category.nom}
          </Label>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.sousCategories?.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-categories">
      <AccordionItem value="filter-categories" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Catégories
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="text-sm text-gray-500">Chargement...</div>
          ) : (
            <div className="flex flex-col space-y-2">
              {categories.map((category) => renderCategory(category))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
