# 网页内容提取器 (Web Content Extractor)

一个强大的网页内容提取工具，支持将任意网页内容转换为HTML或Markdown格式。

🌐 [在线使用](https://md.ggball.top)
![20250304131839](https://img.ggball.top/picGo/20250304131839.png)

## 🚀 特性

- 🔍 一键提取网页内容
- 📝 支持HTML和Markdown双格式输出
- 👀 实时预览转换结果
- 🔄 自动处理编码和格式
- 🌙 支持深色/浅色主题切换
- 📱 响应式设计，支持移动端
- 🔒 本地处理，保护隐私
- 🚫 无需注册，免费使用
- ⚡ API接口支持

## 🛠️ 技术栈

- **前端框架**: Next.js + React
- **样式方案**: TailwindCSS
- **UI组件**: Lucide Icons
- **Markdown处理**: 
  - react-markdown
  - rehype-raw
  - rehype-sanitize
  - remark-gfm
- **其他工具**: 
  - TypeScript
  - Sonner (Toast通知)

## 🎯 使用场景

- 内容采集和整理
- 文档转换
- 写作素材收集
- 网页内容备份
- 开发者API调用

## 📖 快速开始

1. 访问 [https://md.ggball.top](https://md.ggball.top)
2. 输入目标网页URL
3. 点击"提取内容"按钮
4. 选择输出格式（HTML/Markdown）
5. 复制或下载转换结果

## 🔌 API使用

```javascript
// 快速获取Markdown内容
GET https://md.ggball.top/crawl?url=https://example.com

// JavaScript示例
fetch("https://md.ggball.top/crawl?url=https://example.com")
  .then(response => response.text())
  .then(markdown => console.log(markdown))
  .catch(error => console.error(error));
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 开源协议

MIT License 