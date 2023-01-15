import * as React from "react";
import Image, { type ImageProps } from "next/image";

const ImageBlur = ({ alt, src }: ImageProps) => {
  const [isLoading, setLoading] = React.useState(true);

  return (
    <div
      className={`relative flex overflow-hidden rounded-2xl bg-white/10 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <Image
        alt={alt}
        src={src}
        width={512}
        height={512}
        className={`rounded-2xl duration-700 ease-in-out ${
          isLoading
            ? "grayscale blur-2xl scale-110"
            : "grayscale-0 blur-0 scale-100"
        }`}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};

export default ImageBlur;
