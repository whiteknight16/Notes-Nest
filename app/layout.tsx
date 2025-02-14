import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../provider/ThemeProvider";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../provider/AuthProvider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes Nest",
  description: "Your AI Powered Daily Note Taking App",
};

async function getData(id) {
  const data = await prisma.user.findUnique({
    where: { id: id as string },
    select: { colorScheme: true },
  });
  return data;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let data;
  if (user) {
    data = await getData(user.id);
  }
  console.log(data);
  return (
    <AuthProvider>
      <html lang="en">
        <body
          supressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${
            data?.colorScheme ?? "theme-orange"
          }`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
