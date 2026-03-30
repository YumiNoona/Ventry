import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Ventry | AI Social Automation",
  description: "Automate your social presence with AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
