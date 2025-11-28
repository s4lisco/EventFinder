// frontend/src/pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
