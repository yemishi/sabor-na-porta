import { Image } from "@/ui";
import itgIcon from "./assets/instagram.svg";
import wppIcon from "./assets/wpp.svg";

export default function Footer() {
  const wppPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "naportasabor@gmail.com";

  const formatPhone = (phone: string) => {
    const match = phone.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    if (!match) return phone;
    const [, ddd, part1, part2] = match;
    return `(${ddd}) ${part1}-${part2}`;
  };

  return (
    <footer className="bg-dark text-cream py-6 mt-auto border-t border-muted">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-12">
        <div className="text-center md:text-left space-y-1 md:space-y-2">
          <p className="text-xl md:text-2xl font-title">Sabor na porta 🍟</p>
          <p className="text-sm md:text-base text-muted">📞 {formatPhone(wppPhone || "")}</p>
          <p className="text-sm md:text-base text-muted">
            ✉️{" "}
            <a
              href={`mailto:${email}`}
              className="underline hover:text-cream transition-colors"
              title="Envie um e-mail"
            >
              {email}
            </a>
          </p>
          <p className="text-sm md:text-base text-muted">📍 Barra de Santa Rosa - PB</p>
          <p className="text-sm md:text-base text-muted">© {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-sm md:text-base text-muted hidden md:block">Siga-nos:</p>
          <div className="flex gap-6 text-xl items-center">
            <a
              href={`https://wa.me/${wppPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Fale conosco no WhatsApp"
            >
              <Image className="size-8 md:size-9" src={wppIcon} />
            </a>
            <a
              href="https://www.instagram.com/sabornaportta_/"
              target="_blank"
              rel="noopener noreferrer"
              title="Nos siga no Instagram"
            >
              <Image className="size-10 md:size-12" src={itgIcon} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
