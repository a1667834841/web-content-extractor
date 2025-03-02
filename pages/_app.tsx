"use client"

import { useEffect } from "react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { Toaster } from "sonner"
import "../styles/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  // 检查用户是否已经设置了暗黑模式
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>网页内容提取器 - 快速提取网页内容</title>
        <meta name="description" content="网页内容提取器 - 快速提取网页内容，支持HTML和Markdown格式" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster richColors position="top-center" />
      <Component {...pageProps} />
    </>
  )
}

