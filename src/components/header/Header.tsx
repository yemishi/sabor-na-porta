import { Image } from "@/ui";

import Link from "next/link";
import { Cart, UserMenu } from "@/components";

export default function Header() {
  return (
    <header
      className="h-16 md:h-20 p-2 z-10 bg-cream flex justify-between items-center border-b border-b-dark/50 backdrop-blur-lg
     sticky top-0"
    >
      <UserMenu />
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <h1 className="text-3xl font-extrabold tracking-tight relative">
            Sabor na Porta
            <span className="absolute -top-2 -right-6">
              <Image className="size-6 rotate-90 hover:rotate-45" src={"/favicon.svg"} />
            </span>
          </h1>
        </Link>
      </div>

      <Link href="/" className="md:hidden">
        <Image className="size-10 rotate-60 hover:rotate-45" src={"/favicon.svg"} />
      </Link>
      <Cart />
    </header>
  );
}
