import PageContainer from "@/components/pageContainer";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient} >
        <AuthProvider>
          <PageContainer>
            <Component {...pageProps} />
          </PageContainer>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

