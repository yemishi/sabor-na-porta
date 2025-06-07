"use client";
import { clsMerge } from "@/helpers";
import NextImage, { StaticImageData } from "next/image";
import { HTMLAttributes, useState } from "react";

interface ImgProps extends HTMLAttributes<HTMLImageElement> {
  src: string | StaticImageData;
  alt?: string;
  priority?: boolean;
}

export default function Image({ priority, src, alt, ...props }: ImgProps) {
  const { className = "", ...rest } = props;
  const [isLoading, setIsLoading] = useState(true);

  const generateAltText = (imageSrc: string): string => {
    try {
      const decoded = decodeURIComponent(imageSrc);
      const filename = decoded.substring(decoded.lastIndexOf("/") + 1);
      const filenameWithoutExtension = filename.split(".").slice(0, -1).join(" ");
      return filenameWithoutExtension.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    } catch {
      return "Imagem";
    }
  };

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return value.startsWith("/");
    }
  };

  const isStaticImage = typeof src === "object" && "src" in src;

  const imgSrc = isStaticImage ? src : typeof src === "string" && isValidUrl(src) ? src : null;

  if (!imgSrc) {
    return (
      <div
        className={clsMerge(className, "bg-gray-100 text-sm text-gray-400 p-4 rounded-md self-center justify-center")}
      >
        Imagem inválida
      </div>
    );
  }

  return (
    <NextImage
      {...rest}
      src={imgSrc}
      alt={alt || (typeof imgSrc === "string" ? generateAltText(imgSrc) : "Imagem")}
      priority={priority}
      quality={75}
      height={500}
      width={500}
      onLoad={() => setIsLoading(false)}
      className={`${className} ${isLoading ? "brightness-50" : ""} transition-all`}
    />
  );
}
