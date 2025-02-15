import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../../components/Sidebar";
import prisma from "../../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes Nest Dashboard",
  description:
    "Your AI Powered Daily Note Taking App| Dashboard the place all things work",
};

async function getData({
  email,
  id,
  firstName,
  lastName,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
}) {
  noStore();
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true, stripeCustomerId: true, colorScheme: true },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: (firstName ?? "") + " " + (lastName ?? ""),
      },
    });
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  await getData({
    email: user.email as string,
    id: user.id as string,
    firstName: user.given_name as string,
    lastName: user.family_name as string,
  });
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="flex">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
