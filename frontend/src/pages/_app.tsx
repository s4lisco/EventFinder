// frontend/src/pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthProvider } from "@/components/AuthProvider";
import { I18nProvider } from "@/components/I18nProvider";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <Navbar />
          <Component {...pageProps} />
          <CookieBanner />
          <BuyMeCoffeeButton />
        </div>
      </AuthProvider>
    </I18nProvider>
  );
}
