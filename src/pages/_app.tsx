import "../styles/globals.css";
import { AppProps } from "next/app";
import React from "react";
import AuthContextProvider from "../context/AuthProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default App;