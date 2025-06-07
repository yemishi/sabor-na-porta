"use client";

import { InputHTMLAttributes } from "react";
import Input from "./Input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
  bgColor?: string;
  disableErrorMsg?: boolean;
}

export default function InputPhone(props: InputProps) {
  return (
    <Input
      type="number"
      min={0 || props.min}
      inputMode="numeric"
      pattern="[0-9]*"
      onKeyDown={(e) => {
        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
      }}
      {...props}
    />
  );
}
