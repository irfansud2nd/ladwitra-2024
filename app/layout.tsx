import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/utils/ThemeProvider";
import Header from "@/components/header/Header";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import SessionProvider from "@/components/utils/SessionProvider";
import Toast from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ladwitra Championship 2024",
  description: "Informasi dan Pendaftaran Ladwitra Championship 2024",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${inter.className} h-screen grid grid-rows-[auto_1fr] max-h-screen`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            {children}
            <Toast />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
