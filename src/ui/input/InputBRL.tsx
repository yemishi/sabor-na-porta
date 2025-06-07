"use client";

import Input from "./Input";

interface InputBRLProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  bgColor?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

const parseBRL = (str: string): number => {
  const cleaned = str.replace(/\D/g, "");
  return parseFloat((parseInt(cleaned || "0") / 100).toFixed(2));
};

export default function InputBRL(props: InputBRLProps) {
  const { value, bgColor, onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = String(parseBRL(raw));

    onChange({
      target: {
        name: e.target.name,
        value: parsed,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return <Input bgColor={bgColor} inputMode="numeric" value={formatBRL(value)} onChange={handleChange} {...rest} />;
}
