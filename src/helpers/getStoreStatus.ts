import { Schedule } from "@/types";

function to12HourFormat(time: string) {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute}${period}`;
}

export default function getStoreStatus(schedules: Schedule[]): {
  open: boolean;
  message: string;
} {
  const now = new Date();
  const today = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);

  const todaySchedule = schedules.find((s) => s.day === today);

  if (todaySchedule && todaySchedule.openTime && todaySchedule.closeTime) {
    const openTime = todaySchedule.openTime;
    const closeTime = todaySchedule.closeTime;

    const isOvernight = closeTime < openTime || closeTime === "00:00";

    const displayClose = closeTime === "00:00" ? "meia-noite" : to12HourFormat(closeTime);

    const isOpen =
      (isOvernight && (currentTime >= openTime || currentTime < closeTime)) ||
      (!isOvernight && currentTime >= openTime && currentTime < closeTime);

    if (isOpen) {
      return {
        open: true,
        message: `Aberto até ${displayClose}`,
      };
    }

    if (!isOvernight && currentTime < openTime) {
      return {
        open: false,
        message: `Abre hoje às ${openTime}`,
      };
    }

    if (isOvernight && currentTime < openTime) {
      return {
        open: false,
        message: `Abre hoje às ${openTime}`,
      };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextDay = (today + i) % 7;
    const nextSchedule = schedules.find((s) => s.day === nextDay);
    if (nextSchedule?.openTime) {
      const label = i === 1 ? "amanhã" : `em ${i} dias`;
      return {
        open: false,
        message: `Abre ${label} às ${nextSchedule.openTime}`,
      };
    }
  }

  return {
    open: false,
    message: "Horário de funcionamento indisponível",
  };
}
