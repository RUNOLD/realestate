import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: "Ayoola Property Management | Luxury Real Estate & Sourcing",
    template: "%s | Ayoola Property Management"
  },
  description: "Premier real estate sourcing and property management services in Nigeria. Find your dream home with Ayoola Property.",
  keywords: ["Real Estate Nigeria", "Property Management Ibadan", "Luxury Apartments Rent", "Ayoola Property", "House Sourcing Ibadan"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://ayoolarealestate.com",
    siteName: "Ayoola Property Management",
  },
  alternates: {
    canonical: "https://ayoolarealestate.com",
  },
  verification: {
    google: "QwgTHB7_d7ejDTk_M8ksKsyFb0qGy5Mscl2jfqzN47k",
  }
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
          where: { status: { notIn: ['RESOLVED', 'CLOSED'] } }
        });
      } catch (error) {
        console.error("Failed to fetch admin ticket count:", error);
        // Fallback to 0 if database is unreachable
        ticketCount = 0;
      }
    } else if (role === 'TENANT') {
      try {
        ticketCount = await prisma.ticket.count({
          where: {
            userId: session.user.id,
            status: { notIn: ['RESOLVED', 'CLOSED'] }
          }
        });
      } catch (error) {
        console.error("Failed to fetch tenant ticket count:", error);
        ticketCount = 0;
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
            <div className="pt-24 min-h-[calc(100vh-60px)]">
              {children}
            </div>
            <footer className="py-8 border-t border-border bg-background">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                  © 2026 Ayoola Property Management & Sourcing Services LTD. RC NO. 9040390
                </p>
              </div>
            </footer>
          </SessionProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
