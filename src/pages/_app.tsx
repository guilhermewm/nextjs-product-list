import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import theme from "../theme/themeConfig";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider theme={theme}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
