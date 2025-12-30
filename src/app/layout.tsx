import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Ayoola Property Management",
  description: "Luxury Property Management and Sourcing Services",
};

import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let ticketCount = 0;
  if (session?.user) {
    const role = (session.user as any).role;
    const userId = (session.user as any).id; // standard session.user.id should work but casting safe

    if (role === 'ADMIN' || role === 'STAFF') {
      try {
        ticketCount = await prisma.ticket.count({
          where: { status: { in: ['PENDING', 'IN_PROGRESS', 'AWAITING_CONFIRMATION'] } }
        });
      } catch (error) {
        console.error("Failed to fetch admin ticket count:", error);
      }
    } else if (role === 'TENANT') {
      try {
        ticketCount = await prisma.ticket.count({
          where: {
            userId: session.user.id,
            status: { in: ['PENDING', 'IN_PROGRESS', 'AWAITING_CONFIRMATION'] }
          }
        });
      } catch (error) {
        console.error("Failed to fetch tenant ticket count:", error);
      }
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, playfair.variable, "font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper>
            <Navbar user={session?.user} ticketCount={ticketCount} />
            <div className="pt-24">
              {children}
            </div>
          </SessionProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
