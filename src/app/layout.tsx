import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MF Planejados - Móveis Sob Medida | Qualidade e Inovação",
  description: "Transforme seus sonhos em realidade com móveis planejados sob medida. Mais de 15 anos de experiência criando ambientes únicos e funcionais. Solicite seu orçamento!",
  keywords: "móveis planejados, móveis sob medida, cozinha planejada, quarto planejado, sala planejada, marcenaria, design de interiores",
  authors: [{ name: "MF Planejados" }],
  creator: "Marcus-devfs",
  openGraph: {
    title: "MF Planejados - Móveis Sob Medida",
    description: "Transforme seus sonhos em realidade com móveis planejados sob medida. Qualidade, inovação e design exclusivo.",
    type: "website",
    locale: "pt_BR",
    siteName: "MF Planejados",
  },
  twitter: {
    card: "summary_large_image",
    title: "MF Planejados - Móveis Sob Medida",
    description: "Transforme seus sonhos em realidade com móveis planejados sob medida.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#FF7C7C',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
