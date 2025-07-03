import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/authContext";
import dbConnect from "@/dbConnect";

const inter = Inter({ subsets: ["latin"] });
dbConnect()

export const metadata: Metadata = {
  title: "Luxury Stays | Book Your Perfect Hotel",
  description: "Discover and book luxury accommodations worldwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <main className="flex-grow">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
