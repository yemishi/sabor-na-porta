"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components";
import { Input, Button, Loading } from "@/ui";
import { useForm } from "@/hooks";
import exit from "@/assets/icons/exit.svg";
import { Image } from "@/ui";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  onClose: () => void;
  userPhone: string;
};

export default function ChangePassword({ onClose, userPhone }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { values, errors, onChange, validateAll, setError } = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    password: { value: "", min: 3, max: 20 },
    confirmPassword: {
      value: "",
      compareField: "password",
      min: 3,
      max: 20,
    },
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      setIsLoading(true);
      const userInfo = await fetch(`/api/auth?phone=${userPhone}`).then((res) => res.json());
      const res = await fetch(`/api/users/${userInfo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
      });

      const result = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError("password", result.message || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("Failed to change password:", err);
      setIsLoading(false);
      setError("password", "Unexpected error. Try again.");
    }
  };

  return (
    <Modal
      className="w-full mx-auto max-w-md md:max-w-2xl h-fit my-auto bg-background rounded-xl p-6 md:p-10 flex flex-col relative shadow-lg"
      onClose={onClose}
    >
      {isLoading && <Loading className="rounded-xl" />}
      <button
        onClick={onClose}
        className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
      >
        <Image src={exit} />
      </button>

      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Mudar a senha 🔒</h2>
      <p className="text-sm md:text-base text-secondary mb-6 text-center">Escolha algo fácil de lembrar.</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 md:px-20">
        <Input
          label="New Password"
          name="password"
          isPassword
          autoFocus
          value={values.password}
          error={errors.password || ""}
          onChange={onChange}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          isPassword
          value={values.confirmPassword}
          error={errors.confirmPassword || ""}
          onChange={onChange}
        />

        <AnimatePresence>
          {success && (
            <motion.div
              key="success"
              className="text-green-600 text-sm mt-2 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              🎉 Senha modificada com sucesso!
            </motion.div>
          )}
        </AnimatePresence>

        <Button className="mt-4 self-center w-full md:w-auto px-8" type="submit">
          Mudar senha
        </Button>
      </form>
    </Modal>
  );
}
