import { ThemeProvider } from "@/app/_components/theme-provider";
import SideBar from "@/app/_components/ui/side-bar";
import { Toaster } from "@/app/_components/ui/sonner";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TaskTrove",
  description: "Task Manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

async function GeneralLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return <>{userId ? <SideBar>{children}</SideBar> : children}</>;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${inter.variable} flex h-screen flex-col`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <GeneralLayout>{children}</GeneralLayout>
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
