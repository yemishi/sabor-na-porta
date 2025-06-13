"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Image } from "@/ui";
import userIcon from "./assets/user.svg";
import Login from "../login/Login";
import Link from "next/link";
import ChangePassword from "../changePassword/ChangePassword";
import { clsMerge } from "@/helpers";

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPasswordForm, setIsPasswordForm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  const baseClass = "px-4 py-3 text-left hover:bg-primary hover:text-white cursor-pointer";
  return (
    <div ref={ref} className="relative inline-block ">
      {isLogin && <Login onClose={() => setIsLogin(false)} />}
      {isPasswordForm && (
        <ChangePassword userPhone={session?.user.phone as string} onClose={() => setIsPasswordForm(false)} />
      )}
      <button
        aria-label="menu"
        onClick={() => {
          if (!session) {
            setIsLogin(true);
            return;
          }
          setOpen((o) => !o);
        }}
        className="cursor-pointer hover:brightness-110 focus:outline-none flex items-center gap-2 md:bg-dark md:px-4 md:py-1 md:rounded-full"
      >
        <Image src={userIcon} className="size-8 md:invert md:brightness-0" />
        <span className="hidden md:inline text-lg font-semibold text-white">{session?.user.name ?? "Login"}</span>
      </button>

      {open && (
        <div className="absolute -left-2 md:left-auto md:text-lg  mt-3 md:mt-5 w-48 md:w-56 bg-cream border border-dark/40 rounded shadow-lg animate-dropDown">
          {session && (
            <div className="flex flex-col font-medium">
              <button
                onClick={() => {
                  router.push("/orders");
                  setOpen(false);
                }}
                className={baseClass}
              >
                Meus pedidos
              </button>
              {session.user.isAdmin && (
                <Link onClick={() => setOpen(false)} className={baseClass} href={"/dashboard/products"}>
                  Painel de controle
                </Link>
              )}
              <button
                onClick={() => {
                  setIsPasswordForm(true);
                }}
                className={baseClass}
              >
                Mudar senha
              </button>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className={clsMerge("bg-dark hover:bg-primary text-white text-left rounded-b", baseClass)}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
