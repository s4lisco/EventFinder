import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-bg font-sans text-text">
        <Navbar />
        <Component {...pageProps} />
        <CookieBanner />
        <BuyMeCoffeeButton />
      </div>
    </AuthProvider>
  );
}
