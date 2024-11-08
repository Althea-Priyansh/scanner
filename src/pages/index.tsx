"use client";

import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const AppWithoutSSR = dynamic(() => import("../components/main"), {
  ssr: false,
});

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Scan and upload documents in browsers | Dynamic Web TWAIN sample
            code | React
          </title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/x-icon" href="favicon.ico" />
          <link
            href="assets/Styles/fonts.css"
            type="text/css"
            rel="stylesheet"
          />
          <link
            href="assets/Styles/style.css"
            type="text/css"
            rel="stylesheet"
          />
        </Head>
        <AppWithoutSSR></AppWithoutSSR>
      </>
    );
  }
}
