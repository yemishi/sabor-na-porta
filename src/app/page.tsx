"use client"
import { Modal } from "@/components";
import Login from "@/components/login/Login";
import { useState } from "react";

export default function Home() {
  const [test, setTest] = useState(false);
  return (
    <div className="h-full w-full flex">
      home page
      <button onClick={() => setTest(true)}>AA</button>
      {test && <Login onClose={() => {}} />}
    </div>
  );
}
