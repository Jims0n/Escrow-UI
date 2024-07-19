import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ContextProvider } from "@/contexts/ContextProvider";
import App from "./_app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deposito - Send | Hold | Receive",
  description: "Escrow at its finest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App>{children}</App>
      </body>
    </html>
  );
}
