import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

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
        <Navbar />
        <div className="flex flex-col pt-40 container items-center px-10 min-h-screen overflow-x-hidden">
          {children}
          <footer className="flex justify-center items-center py-10">
            <p>All rights reserved.</p>
          </footer>
          </div>
      </body>
    </html>
  );
}
