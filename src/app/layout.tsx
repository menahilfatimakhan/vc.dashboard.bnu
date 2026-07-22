import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VC Analytical Dashboard — BNU",
  description: "Executive analytics dashboard for the Vice Chancellor, Beaconhouse National University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved/system theme before hydration so there's no flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              var t = localStorage.getItem("bnu-vitals-theme");
              document.documentElement.dataset.theme = t || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            } catch (e) {}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-page text-ink">{children}</body>
    </html>
  );
}
