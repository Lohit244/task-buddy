import PageContainer from "@/components/pageContainer";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.css";
import { Flowbite } from "flowbite-react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
      </AuthProvider>
    </>
  );
}

