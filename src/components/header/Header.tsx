import { Image } from "@/ui";

import patties from "./assets/patties.svg";
import user from "./assets/user.svg";
import Link from "next/link";
import { Cart } from "@/components";

export default function Header() {
  return (
    <header className="h-16 p-2 z-1  flex justify-between items-center border-b border-b-dark/50 backdrop-blur-lg sticky top-0">
      <Image className="size-8" src={user} />
      <Link href="/products">
        <Image className="size-10 rotate-60" src={patties} />
      </Link>
      <Cart />
    </header>
  );
}
