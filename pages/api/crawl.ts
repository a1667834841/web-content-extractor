import { publicConfig } from "@/lib/config"
import type { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "只支持GET请求" })
    }

    const { url } = req.query

    if (!url) {
        return res.status(400).json({ error: "请提供URL" })
    }
    console.log("提取内容", url)

    try {
        const response = await fetch(`${publicConfig.backendApiUrl}/crawl-url?url=${url}`, { method: "GET" })

        // 获取原始响应的 Content-Type
        const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8'

        // 设置正确的响应头，确保字符集为 UTF-8
        res.setHeader('Content-Type', contentType.includes('charset') ? contentType : `${contentType}; charset=utf-8`)

        const data = await response.text()
        res.status(200).send(data)
    } catch (error) {
        console.error("提取内容失败:", error)
        res.status(500).json({ error: "提取内容失败，请稍后再试" })
    }
}
