import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/theme-provider";

export const metadata: Metadata = {
  title: "SignVerse — 3D & AI Sign Language Learning Platform",
  description: "Premium Indian Sign Language (ISL) learning platform with interactive 3D hand visualizations, AI gesture feedback, gamified progress, and comprehensive curriculum.",
  openGraph: {
    title: "SignVerse — 3D & AI Sign Language Learning Platform",
    description: "Premium Indian Sign Language (ISL) learning platform with interactive 3D hand visualizations, AI gesture feedback, gamified progress, and comprehensive curriculum.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          ['--font-display' as any]: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          ['--font-sans' as any]: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          ['--font-mono' as any]: "'JetBrains Mono', monospace",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
