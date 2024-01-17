import type {Metadata} from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "state-history-checker",
  description: "Generated by appncy",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-background dark container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4 font-sans antialiased">
        <header className="pl-3 text-xl font-bold leading-[4rem]">state-history-checker 👋</header>
        <main className="py-8">{children}</main>
        <footer className="text-center leading-[4rem] opacity-70">
          © {new Date().getFullYear()} state-history-checker
        </footer>
      </body>
    </html>
  );
}
