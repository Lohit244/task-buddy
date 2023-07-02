import PageContainer from "@/components/pageContainer";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
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

