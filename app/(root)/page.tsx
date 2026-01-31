// Components
import HeroSec from "@/components/store/homepage/HeroSec";
import ProductsSec from "@/components/store/homepage/ProductsSec";
import TestimonialsSec from "@/components/store/homepage/TestimonialsSec";
import NewsLetterSection from "@/components/store/homepage/NewsLetterSecc";

// Data
import { testimonialsData } from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      <HeroSec />
      <ProductsSec />
      <TestimonialsSec data={testimonialsData} />
      <NewsLetterSection />
    </main>
  );
}
