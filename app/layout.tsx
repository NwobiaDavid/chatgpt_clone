import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbarr from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat GPT Clone",
  description: "a clone of chatgpt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        <div className="h-screen flex flex-col" >
          <div className="h-[7%] "><Navbarr/></div>
            <div className="h-[93%] ">{children}</div>
        </div>
        </Providers>
      </body>
    </html>
  );
}
