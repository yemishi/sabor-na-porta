
export default function Page(){
  return <div>
    
  </div>
}
/* "use client";

import { Suspense, useEffect, useState } from "react";
import { Button, Input, Loading } from "@/ui";

type Schedule = {
  id?: string;
  day: number;
  openTime: string;
  closeTime: string;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export default function PageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <SchedulePage />
    </Suspense>
  );
}

function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data) => {
        const allDays: Schedule[] = Array.from({ length: 7 }, (_, day) => {
          const existing = data.find((s: Schedule) => s.day === day);
          return (
            existing ?? {
              day,
              openTime: "",
              closeTime: "",
            }
          );
        });

        setSchedules(allDays);
        setLoading(false);
      });
  }, []);

  const updateSchedule = async (day: number) => {
    const schedule = schedules.find((s) => s.day === day);
    if (!schedule) return;

    const res = await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify(schedule),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
    console.log(res);
  };

  const handleChange = (day: number, field: "openTime" | "closeTime", value: string) => {
    console.log(day, value);
    setSchedules((prev) => prev.map((s) => (s.day === day ? { ...s, [field]: value } : s)));
  };

  const getTime = (day: number, field: "openTime" | "closeTime") => schedules.find((s) => s.day === day)?.[field] ?? "";

  if (loading) return <p>Carregando horários...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="title md:hidden">Horário de Funcionamento</h1>{" "}
      <h2 className="title hidden md:block">Horário de Funcionamento</h2>
      <div className="space-y-6">
        {WEEKDAYS.map((label, index) => (
          <div key={index} className="flex  flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-28 font-medium mr-auto">{label}</div>
            <div className="flex gap-2 items-center ">
              <Input
                label=" "
                type="time"
                value={getTime(index, "openTime")}
                onChange={(e) => {
                  handleChange(index, "openTime", e.target.value);
                }}
              />
              <span>→</span>
              <Input
                label=" "
                type="time"
                value={getTime(index, "closeTime")}
                onChange={(e) => handleChange(index, "closeTime", e.target.value)}
              />
            </div>
            <Button className="ml-auto" onClick={() => updateSchedule(index)}>
              Salvar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
 */