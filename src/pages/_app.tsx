import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

import { ThemeProvider } from "next-themes";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (<ThemeProvider enableSystem={true} attribute="class">
    <Head>
      <title>RemoteSwitch</title>
      <meta name="description" content="Generated by create-t3-app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <SessionProvider session={session}>
      
      <Component {...pageProps} />
    </SessionProvider>

  </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
