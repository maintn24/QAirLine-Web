import type { Metadata } from "next";
import './UI/global.css';
import localFont from "next/font/local";
import Header from "./components/header";

export const metadata: Metadata = {
  title: "QAirLine",
  description: "Page about Airline",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="w-full">
        <Header/>
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
