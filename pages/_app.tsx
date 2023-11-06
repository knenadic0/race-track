import { useRouter } from "next/router";
import useAuthentication from "../services/authentication";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { redirect } from "next/navigation";

function MyApp({ Component, pageProps }: AppProps) {
  const user = useAuthentication();
  const router = useRouter();

  if (!user && router.pathname !== "/login") {
    router.push("/login");
    return null;
  }

  return <Component {...pageProps} />;
}

export default MyApp;
