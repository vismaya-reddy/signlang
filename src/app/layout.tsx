import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/theme-provider";

export const metadata: Metadata = {
  title: "SignVerse — Indian Sign Language (ISL) & 3D Interactive Learning",
  description: "Learn Indian Sign Language (ISL) with real-time AI gesture feedback, interactive 3D hand visualizations, and step-by-step ISLRTC verified curriculum.",
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
