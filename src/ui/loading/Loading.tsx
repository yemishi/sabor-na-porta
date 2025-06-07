import { clsMerge } from "@/helpers";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  isPage?: boolean;
}

export default function Loading({ isPage = true, ...props }: Props) {
  const { className, ...rest } = props;

  return (
    <div
      {...rest}
      className={clsMerge(
        className,
        `flex justify-center items-center ${
          isPage ? "absolute h-full w-full" : ""
        } top-0 left-0 bg-background/60 backdrop-blur-xs z-10`
      )}
      role="status"
    >
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
