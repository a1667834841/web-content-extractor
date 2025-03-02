import { publicConfig } from "@/lib/config"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  title?: string
  html?: string
  markdown?: string
  icon?: string
  error?: string
}

const host = `${publicConfig.backendApiUrl}/crawl-url`

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持POST请求" })
  }

  const { url } = req.body

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "请提供有效的URL" })
  }

  try {
    console.log("提取内容", url)
    console.log("提取内容", host)
    // 这里是示例实现，实际项目中需要替换为真实的网页内容提取逻辑
    const response = await fetch(host, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "url": url }),
    })
    debugger
    const result = await response.json()

    res.status(200).json({
      title: result.title,
      markdown: result.markdown,
      html: result.html,
      icon: result.icon ? result.icon : undefined,
    })
  } catch (error) {
    console.error("提取内容时出错:", error)
    return res.status(500).json({ error: "提取内容时出错，请检查URL是否有效" })
  }
}

// 校验url
function isValidUrl(url: string) {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
