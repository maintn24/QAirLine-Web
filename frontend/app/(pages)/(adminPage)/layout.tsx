// /app/home/layout.tsx
import Header from "@/app/components/AdminHeader";
import Footer from "@/app/components/Footer";
import { Montserrat } from "next/font/google";


const montserrat = Montserrat({ subsets: ["latin"] });

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
