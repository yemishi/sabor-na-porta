"use client";

import Input from "./Input";

interface InputPhoneProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
}

const formatPhone = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 11);

  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 7);
  const part3 = digits.slice(7, 11);

  if (digits.length < 3) return `(${part1}`;
  if (digits.length < 8) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
};

export default function InputPhone(props: InputPhoneProps) {
  const { onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhone(raw);

    onChange({
      target: {
        name: e.target.name,
        value: formatted,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Input
      type="tel"
      inputMode="tel"
      maxLength={15}
      pattern="\(\d{2}\)\s9\d{4}-\d{4}"
      onChange={handleChange}
      {...rest}
    />
  );
}
