"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface PriceSectionProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function PriceSection({ value, onChange }: PriceSectionProps) {
  const [minPrice, setMinPrice] = useState(value[0]);
  const [maxPrice, setMaxPrice] = useState(value[1]);

  useEffect(() => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMinPrice(val);
    onChange([val, maxPrice]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMaxPrice(val);
    onChange([minPrice, val]);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Prix (FCFA)
        </AccordionTrigger>
        <AccordionContent className="pt-4 px-1">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-1 block">Min</label>
              <Input
                type="number"
                min={0}
                value={minPrice}
                onChange={handleMinChange}
                className="w-full"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-1 block">Max</label>
              <Input
                type="number"
                min={0}
                value={maxPrice}
                onChange={handleMaxChange}
                className="w-full"
                placeholder="Max"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
