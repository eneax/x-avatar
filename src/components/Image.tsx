import * as React from "react";
import NextImage from "next/image";

type ImageProps = {
  alt: string;
  src: string;
  isGenerating?: boolean;
};

const Image = ({ alt, src, isGenerating }: ImageProps) => (
  <div
    className={`relative flex overflow-hidden rounded-2xl bg-white/10 ${
      isGenerating ? "animate-pulse" : ""
    }`}
  >
    <NextImage
      alt={alt}
      src={src}
      width={512}
      height={512}
      className={`rounded-2xl duration-700 ease-in-out ${
        isGenerating
          ? "grayscale blur-2xl scale-110"
          : "grayscale-0 blur-0 scale-100"
      }`}
    />
  </div>
);

export default Image;
