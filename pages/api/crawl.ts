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
        // 调用后端 API 获取 Markdown 内容
        const response = await fetch(`${publicConfig.backendApiUrl}/crawl-url?url=${url}`, {
            method: "GET"
        })

        if (!response.ok) {
            throw new Error(`后端API返回错误: ${response.status}`)
        }

        const data = await response.text()

        if (!data) {
            throw new Error("未能获取Markdown内容")
        }

        // 设置响应头为 Markdown 类型
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.status(200).send(data)
    } catch (error) {
        console.error("提取内容失败:", error)
        res.status(500).json({ error: "提取内容失败，请稍后再试" })
    }
}
