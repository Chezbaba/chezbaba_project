"use client";

import { ProductFromAPI } from "@/lib/types/product.types";
import { getImageUrlFromPublicId, getVideoUrlFromPublicId } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Play } from "lucide-react";

const PhotoSection = ({ data }: { data: ProductFromAPI }) => {
  const [selectedType, setSelectedType] = useState<"image" | "video">("image");
  const [selectedId, setSelectedId] = useState<string>(
    data.images[0].imagePublicId
  );

  const hasMedia = data.images.length > 1 || !!data.video;

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
      {hasMedia && (
        <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit items-center lg:justify-start justify-center overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {data.images.map((image) => (
            <button
              key={image.id}
              type="button"
              className={`bg-[#F0EEED] rounded-[13px] xl:rounded-[20px] w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] xl:min-h-[167px] aspect-square overflow-hidden flex-shrink-0 border-2 transition-all ${selectedType === "image" && selectedId === image.imagePublicId
                  ? "border-black"
                  : "border-transparent"
                }`}
              onClick={() => {
                setSelectedType("image");
                setSelectedId(image.imagePublicId);
              }}
            >
              <Image
                src={getImageUrlFromPublicId(image.imagePublicId)}
                width={152}
                height={167}
                className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                alt={"product image"}
              />
            </button>
          ))}

          {data.video && (
            <button
              key={data.video.id}
              type="button"
              className={`bg-[#F0EEED] rounded-[13px] xl:rounded-[20px] w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] xl:min-h-[167px] aspect-square overflow-hidden flex-shrink-0 border-2 transition-all relative group ${selectedType === "video" ? "border-black" : "border-transparent"
                }`}
              onClick={() => {
                setSelectedType("video");
                setSelectedId(data.video!.videoPublicId);
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors z-10">
                <Play className="text-white w-8 h-8 fill-current" />
              </div>
              <video
                src={getVideoUrlFromPublicId(data.video.videoPublicId)}
                className="w-full h-full object-cover"
                muted
              />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-center bg-[#F0EEED] rounded-[13px] sm:rounded-[20px] w-full sm:w-96 md:w-full mx-auto h-full max-h-[530px] min-h-[330px] lg:min-h-[380px] xl:min-h-[530px] overflow-hidden mb-3 lg:mb-0 relative">
        {selectedType === "image" ? (
          <Image
            src={getImageUrlFromPublicId(selectedId)}
            width={444}
            height={530}
            className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
            alt={"product image"}
            priority
            unoptimized
          />
        ) : (
          <video
            src={getVideoUrlFromPublicId(selectedId)}
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            loop
          />
        )}
      </div>
    </div>
  );
};

export default PhotoSection;
