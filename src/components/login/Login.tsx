"use client";

import { signIn } from "next-auth/react";
import exit from "@/assets/icons/exit.svg";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useForm } from "@/hooks";
import { Image, Input, Loading, StepDesc, InputPhone, Button } from "@/ui";
import { Modal } from "@/components";

export default function Login({ onClose }: { onClose: () => void }) {
  const [userState, setUserState] = useState<"hasPassword" | "newUser">();
  const [isLoading, setIsLoading] = useState(false);
  const { values, setError, onChange, errors, validate } = useForm<{
    phone: string;
    password: string;
    name: string;
  }>({
    phone: {
      value: "",
      validate: (val) => {
        const regex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        return regex.test(val as string) ? null : "Número precisa estar no formato (99) 99999-9999";
      },
    },
    password: { value: "", min: 3 },
    name: { value: "", min: 3 },
  });

  const signInFn = async () => {
    const response = await signIn("credentials", {
      phone: values.phone,
      name: values.name,
      password: values.password,
      redirect: false,
    });
    if (response && !response.ok) {
      setError("phone", "Incorrect phone or password.");
      return;
    }
    onClose();
    return;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid =
      validate("phone") &&
      (userState !== "hasPassword" || validate("password")) &&
      (userState !== "newUser" || validate("name"));

    if (!isValid) return;

    if (!userState) {
      try {
        setIsLoading(true);
        const result = await fetch(`/api/auth?phone=${values.phone}`);
        const response = await result.json();
        setIsLoading(false);
        if (!result.ok) {
          setError("phone", response.message);
          return;
        }

        if (!response.exists) {
          setUserState("newUser");
          return;
        }

        if (response.hasPassword) {
          setUserState("hasPassword");
          return;
        }
        setIsLoading(true);
        await signInFn();
        setIsLoading(false);
      } catch (err) {
        console.error("Auth API call failed:", err);
        setError("phone", "Something went wrong. Try again");
      }
      return;
    }

    await signInFn();
  };
  const desc = {
    phoneDesc: "Começamos pelo seu número 📞",
    hasPassword: "Tem uma senha guardada aí na memória?",
    newUser: "Como devemos te chamar por aqui?",
  }[userState || "phoneDesc"];
  const submitText = {
    phoneDesc: "Continuar",
    hasPassword: "Entrar",
    newUser: "Criar conta",
  }[userState || "phoneDesc"];

  return (
    <Modal
      className="w-full h-full max-w-2xl md:h-[600px] md:rounded-xl mx-auto relative my-auto animate-dropDown bg-background flex flex-col gap-4  px-6 pt-10 md:pt-12"
      onClose={onClose}
    >
      {isLoading && <Loading className="md:rounded-xl" />}
      <button
        onClick={onClose}
        className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
      >
        <Image src={exit} />
      </button>

      <h2 className="text-4xl font-title mt-14 sm:mt-24 md:mt-40">Bem-vindo ao Sabor</h2>
      <StepDesc desc={desc} />
      <form onSubmit={onSubmit} className="flex flex-col gap-4 h-full py-6 ">
        <InputPhone
          autoFocus
          disabled={!!userState}
          error={errors.phone || ""}
          name="phone"
          label="Tel número"
          value={values.phone}
          onChange={onChange}
        />

        <AnimatePresence mode="wait">
          {userState === "hasPassword" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                autoFocus
                label="Senha"
                name="password"
                isPassword
                error={errors.password || ""}
                value={values.password}
                onChange={onChange}
              />
            </motion.div>
          )}

          {userState === "newUser" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                autoFocus
                label="Nome"
                name="name"
                error={errors.name || ""}
                value={values.name}
                onChange={onChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Button className="mt-auto mb-10 self-center" type="submit">
          {submitText}
        </Button>
      </form>
    </Modal>
  );
}
