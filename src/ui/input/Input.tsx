"use client";
import { clsMerge } from "@/helpers";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Image } from "@/ui";
import eye from "./assets/eye.svg";
import eyeClosed from "./assets/eye-closed.svg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
  bgColor?: string;
  disableErrorMsg?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, bgColor, className, placeholder, id, isPassword, error, disableErrorMsg, ...rest } = props;
  const [isPass, setIsPass] = useState(isPassword);
  const type = isPass ? "password" : rest.type || "text";

  const hasValue = rest.value !== null && rest.value !== undefined && rest.value !== "";
  return (
    <div
      className={`${clsMerge(
        className,
        ` ${
          rest.disabled ? "pointer-none opacity-60" : ""
        } flex border-2 lg:text-lg flex-col group focus-within:border-secondary gap-1 font-kanit relative p-3 
          rounded-xl group focus-within:border-secondary-400`
      )} ${error ? "border-red-400 text-red-400" : ""} ${hasValue ? "border-accent" : "border-dark"} `}
    >
      <label
        htmlFor={id || rest.name}
        className={`absolute left-4  bottom-2.5 origin-left transition-all opacity-50  ${
          hasValue
            ? `px-2 -translate-y-6 scale-90 translate-x-1.5 ${bgColor ?? "bg-background"}`
            : "pointer-events-none"
        }`}
      >
        {label || placeholder}
      </label>

      <input
        type={type}
        id={id || rest.name}
        className={`w-full h-full  outline-none px-1 ${isPass ? "" : "pr-6"}`}
        ref={ref}
        {...rest}
      />

      {isPassword && (
        <span onClick={() => setIsPass(!isPass)} className="absolute top-2/4 -translate-y-2/4 right-3 cursor-pointer">
          <Image src={isPass ? eyeClosed : eye} className="size-6" />
        </span>
      )}
      {error && !disableErrorMsg && (
        <span
          className="ml-1 text-sm lg:text-lg bg-background px-1 text-red-500 absolute -top-3.5 right-5 scale-90 origin-right
         md:right-7 md:text-base"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
