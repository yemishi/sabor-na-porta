import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/context/Provider";
import { Header, StoreStatusBanner } from "@/components";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Sabor na Porta - Delivery de Comida Rápida e Saborosa",
  description: "Seu delivery favorito de comida saborosa e fresquinha direto na sua porta.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  session: never;
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
 {/*      <Provider session={session}> */}
        <body className="min-h-screen flex flex-col overflow-x-hidden">
{/*           <Header /> */}
    {/*       <StoreStatusBanner /> */}
          <main className="w-full min-h-full max-w-7xl mx-auto">{children}</main>
          <Footer />
          <div className="w-full" id="modal" />
        </body>
{/*       </Provider> */}
    </html>
  );
}
