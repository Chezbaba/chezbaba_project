import Link from "next/link";
import Image from "next/image";

// Components
import NewsLetterCard from "./NewsLetterCard";

const NewsLetterSection = () => {
  return (
    <section className="mt-10">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-[#F0F0F0]"></div>
        <div className="px-4">
          <NewsLetterCard />
        </div>
      </div>

      <div className="pt-8 md:pt-[50px] bg-[#F0F0F0] px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <div className="text-center mb-8 flex justify-center items-center">
            <p className="text-black/60 max-w-[600px] text-center text-lg">
              Découvrez sur ChezBaba une large sélection de produits, proposée par des vendeurs de confiance, pour tous vos besoins du quotidien.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetterSection;
