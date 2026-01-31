// Components
import HeroSec from "@/components/store/homepage/HeroSec";
import BrandsSec from "@/components/store/homepage/BrandsSec";
import ProductsSec from "@/components/store/homepage/ProductsSec";
import TestimonialsSec from "@/components/store/homepage/TestimonialsSec";
import NewsLetterSection from "@/components/store/homepage/NewsLetterSecc";

// Data & Prisma
import { testimonialsData } from "@/lib/data";
import { prisma } from "@/lib/utils/prisma";
import { ReviewFromAPI } from "@/lib/types/review.types";
import { UserRole } from "@prisma/client";

// Helpers
import { formatReviewData, getReviewSelect } from "@/lib/helpers/reviews";

export default async function HomePage() {
  let displayTestimonials: ReviewFromAPI[] = [];

  try {
    const [dbTestimonials, dbEvaluations] = await Promise.all([
      prisma.temoignage.findMany({
        orderBy: { date: "desc" },
      }),
      prisma.evaluation.findMany({
        select: getReviewSelect(),
        orderBy: { date: "desc" },
        take: 10,
      }),
    ]);

    const formattedTestimonials: ReviewFromAPI[] = dbTestimonials.map((t) => ({
      id: t.id,
      note: t.note,
      text: t.texte,
      date: new Date(t.date),
      produitId: "",
      user: {
        id: t.id,
        nom: t.nom,
        prenom: t.prenom,
        imagePublicId: t.imagePublicId,
        role: UserRole.CLIENT,
      },
      reponses: [],
    }));

    const formattedEvaluations: ReviewFromAPI[] = dbEvaluations.map((e) =>
      formatReviewData(e as any)
    );

    displayTestimonials = [...formattedTestimonials, ...formattedEvaluations].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    if (displayTestimonials.length === 0) {
      displayTestimonials = testimonialsData;
    }
  } catch (error) {
    console.error("Error fetching testimonials or evaluations:", error);
    displayTestimonials = testimonialsData;
  }

  return (
    <main>
      <HeroSec />
      <BrandsSec />
      <ProductsSec />
      <TestimonialsSec data={displayTestimonials} />
      <NewsLetterSection />
    </main>
  );
}
