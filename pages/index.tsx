"use client"

import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import {
  ArrowLeftRight,
  Download,
  Copy,
  Moon,
  Sun,
  ChevronDown,
  LinkIcon,
  Code,
  FileText,
  Eye,
  Lock,
  Github,
  Hand,
  Facebook,
  PhoneIcon as Wechat,
  Mail,
  ArrowUp,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { publicConfig, isDevelopment } from "../lib/config"


export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("html")
  const [url, setUrl] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [comsumeTime, setComsumeTime] = useState(0)
  const [markdown, setMarkdown] = useState(`# 示例Markdown内容
这里将显示提取的Markdown内容

- 列表项1
- 列表项2
- 列表项3

**粗体文本** *斜体文本*`)
  const [html, setHtml] = useState(`<div class='example'><h1>示例HTML内容</h1>
<p>这里将显示提取的HTML内容</p>
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
  <li>列表项3</li>
</ul>
<p><strong>粗体文本</strong> <em>斜体文本</em></p>
</div>`)
  const [loading, setLoading] = useState(false)
  const [showRenderedMarkdown, setShowRenderedMarkdown] = useState(true)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [contentHeight, setContentHeight] = useState("32rem")
  const contentRef = useRef<HTMLDivElement>(null)
  // 轮播图集合
  const carouselImages = [
    {title: "1. 输入想要提取内容的网页地址，点击提取按钮", desc: "在输入框中粘贴或输入网址，支持大部分网页", image: "/desc1.png"},
    {title: "2. 等待片刻即可获取提取结果", desc: "复制或下载提取结果，支持HTML和Markdown格式", image: "/desc2.png"},
    {title: "3. 支持API接口", desc: "支持API接口，可以快速提取网页内容", image: "/desc3.png"},
  ]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 添加轮播图自动切换功能
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
    }, 5000) // 每5秒切换一次
    
    return () => clearInterval(interval) // 清理定时器
  }, [carouselImages.length])
  
  // 切换到下一张图片
  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
  }
  
  // 切换到上一张图片
  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    )
  }
  
  // 直接跳转到指定图片
  const goToSlide = (index: number) => {
    setCurrentImageIndex(index)
  }

  // 监听滚动事件，控制导航栏显示/隐藏和回到顶部按钮
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // 向下滚动时隐藏导航栏
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsNavVisible(false)
        } 
        // 向上滚动或回到顶部时显示导航栏
        else if (window.scrollY < lastScrollY || window.scrollY <= 100) {
          setIsNavVisible(true)
        }
        
        // 控制回到顶部按钮显示
        if (window.scrollY > 300) {
          setShowScrollTop(true)
        } else {
          setShowScrollTop(false)
        }
        
        // 更新上次滚动位置
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)
      
      // 清理函数
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])

  // 根据窗口大小调整内容区域高度
  useEffect(() => {
    const updateContentHeight = () => {
      if (typeof window !== 'undefined') {
        // 获取视窗高度
        const viewportHeight = window.innerHeight
        // 计算合适的内容高度，大约为视窗高度的60%
        const idealHeight = Math.max(400, Math.floor(viewportHeight * 0.6))
        setContentHeight(`${idealHeight}px`)
      }
    }

    // 初始化时调用一次
    updateContentHeight()

    // 监听窗口大小变化
    window.addEventListener('resize', updateContentHeight)

    // 清理函数
    return () => {
      window.removeEventListener('resize', updateContentHeight)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const toggleMarkdownView = () => {
    setShowRenderedMarkdown(!showRenderedMarkdown)
  }

  const copyMarkdown = () => {
    if (!markdown) {
      toast.error("没有内容可复制")
      return
    }
    navigator.clipboard.writeText(markdown)
    toast.success("复制成功")
  }

  const downloadMarkdown = () => {
    if (!markdown) {
      toast.error("没有内容可下载")
      return
    }
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-${new Date().getTime()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("下载成功")
  }

  const copyHtml = () => {
    if (!html) {
      toast.error("没有内容可复制")
      return
    }
    navigator.clipboard.writeText(html)
    toast.success("复制成功")
  }

  const downloadHtml = () => {
    if (!html) {
      toast.error("没有内容可下载")
      return
    }
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-${new Date().getTime()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("下载成功")
  }

  const handleExtract = async (url: string, format: string) => {
    const startTime = performance.now()
    setLoading(true)
    try {
      
      const response = await fetch("/api/crawl-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, format }),
      })

      if (!response.ok) {
        toast.error("提取失败，请检查URL是否有效");
        return
      }

      const data = await response.json()

      if (data.error) {
        toast.error("提取失败，请联系管理员");
        return
      }

      setHtml(data.html || "")
      setMarkdown(data.markdown || "")
      const endTime = performance.now()
      const timeTaken = endTime - startTime
      setComsumeTime(timeTaken)
    } catch (error) {
      toast.error("提取失败，请联系管理员");
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (!url) {
      toast.error("请填写url")
      return
    }
    const link = `${publicConfig.frontendApiUrl}/crawl?url=${url}`
    navigator.clipboard.writeText(link)
    toast.success("复制成功")
  }

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
        <Head>
          <title>网页内容提取器 - 快速提取网页内容</title>
          <meta name="description" content="网页内容提取器 - 快速提取网页内容，支持HTML和Markdown格式" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* 导航栏 */}
        <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-transform duration-300 ${isNavVisible ? 'transform-none' : '-translate-y-full'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <LinkIcon className="h-8 w-8 text-blue-500" />
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">网页内容提取器</span>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link
                  href="#features"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  功能介绍
                </Link>
                <Link
                  href="#tutorial"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  使用教程
                </Link>
                <Link
                  href="#api"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  API接口
                </Link>
                <Link
                  href="#faq"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  常见问题
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="hidden md:block">
                  {/* <select className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-md text-sm">
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select> */}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-12 sm:py-16 lg:py-20 text-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                快速提取<span className="text-blue-500">网页内容</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                支持HTML和Markdown格式，智能解析，精准提取，无需注册，免费使用
              </p>
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div className="relative w-full sm:w-1/2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="请输入网址 (例如: https://www.baidu.com)"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-row w-full sm:w-1/2 space-x-2">
                      <button className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition duration-150 ease-in-out transform active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700 text-base sm:text-base text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => handleExtract(url, activeTab)}>
                        <div className="flex items-center justify-center">
                          <Hand className="h-5 w-5 mr-2" />
                          <span>提取内容</span>
                        </div>
                      </button>
                      <button className="flex-1 px-3 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 ease-in-out flex items-center justify-center active:bg-gray-50 dark:active:bg-gray-600 active:scale-95 hover:bg-gray-50 dark:hover:bg-gray-600 text-base sm:text-base text-sm" onClick={copyLink}>
                        <LinkIcon className="h-5 w-5 mr-2" />
                        快捷链接
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 提取结果预览 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto" ref={contentRef}>
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center font-medium">HTML</div>
                    <div className="flex space-x-2">
                      {comsumeTime > 0 && <span className="text-gray-500 dark:text-gray-400 text-sm">耗时: {(comsumeTime/1000).toFixed(2)}秒</span>}
                      <button 
                        onClick={copyHtml}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="复制 HTML"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={downloadHtml}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="下载 HTML"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 overflow-auto" style={{ height: contentHeight }}>
                    <pre className="text-sm text-gray-800 dark:text-gray-200 text-left">
                      {html}
                    </pre>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center font-medium">Markdown</div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={toggleMarkdownView}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title={showRenderedMarkdown ? "查看原始 Markdown" : "查看渲染效果"}
                      >
                        <ArrowLeftRight className={`h-5 w-5 ${showRenderedMarkdown ? "text-blue-500" : ""}`} />
                      </button>
                      <button 
                        onClick={copyMarkdown}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="复制 Markdown"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={downloadMarkdown}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="下载 Markdown"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="h-96 md:h-auto bg-gray-50 dark:bg-gray-900 p-4 overflow-auto" style={{ height: contentHeight }}>
                    {showRenderedMarkdown ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-left">
                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          remarkPlugins={[remarkGfm]}
                        >
                          {markdown}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-left">
                        {markdown}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 功能介绍模块 */}
          <section
            id="features"
            className="py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  强大功能，简单操作
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  我们提供多种功能，满足您的不同需求，让网页内容提取变得简单高效
                </p>
              </div>

                            {/* 效果轮播展示 */}
                            <div className="relative max-w-4xl mx-auto mb-16">
                <div className="overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-700">
                  {/* 轮播图片 */}
                  <div className="relative w-full" style={{ height: "500px" }}>
                    {carouselImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute w-full h-full transition-opacity duration-500 flex items-center justify-center ${
                          index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={image.image}
                          alt={image.title}
                          className="max-w-full max-h-[400px] object-contain shadow-md"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                          <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                          <p>{image.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 轮播控制按钮 */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                    {carouselImages.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white opacity-50 hover:opacity-75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* 左右箭头 */}
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronDown className="w-6 h-6 rotate-90" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronDown className="w-6 h-6 -rotate-90" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 功能卡片1 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                    <Code className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">HTML提取</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    快速提取网页的HTML代码，支持多种编码格式，保留原始结构
                  </p>
                </div>

                {/* 功能卡片2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                    <FileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Markdown提取</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    将网页内容转换为Markdown格式，方便编辑和分享，适合写作和笔记
                  </p>
                </div>

                {/* 功能卡片3 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">实时预览</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    提取内容后实时预览效果，确保提取结果准确无误，所见即所得
                  </p>
                </div>

                {/* 功能卡片4 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                    <Lock className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">数据安全</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    数据完全存储在本地，无需注册，保护您的隐私，安全可靠
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 使用教程模块 */}
          <section
            id="tutorial"
            className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  简单易用，一目了然
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  只需几个简单步骤，即可轻松提取网页内容，无需专业知识
                </p>
              </div>


              {/* 图文教程 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 步骤1 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-1 bg-blue-500 text-white text-center font-bold">步骤 1</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">输入网址</h3>
                    <p className="text-gray-600 dark:text-gray-300">在输入框中粘贴或输入您想要提取内容的网页地址</p>
                  </div>
                </div>

                {/* 步骤2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-1 bg-blue-500 text-white text-center font-bold">步骤 2</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">点击提取</h3>
                    <p className="text-gray-600 dark:text-gray-300">点击"提取内容"按钮，系统将自动解析并提取网页内容</p>
                  </div>
                </div>

                {/* 步骤3 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-1 bg-blue-500 text-white text-center font-bold">步骤 3</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">选择输出格式</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      选择您需要的输出格式，HTML或Markdown，满足不同需求
                    </p>
                  </div>
                </div>

                {/* 步骤4 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-1 bg-blue-500 text-white text-center font-bold">步骤 4</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">下载或复制结果</h3>
                    <p className="text-gray-600 dark:text-gray-300">下载或复制提取结果，方便您进一步编辑或分享使用</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API接口介绍 */}
          <section id="api" className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">API 接口</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  直接通过 API 获取转换好的 Markdown 内容，无需前端页面，适合开发者集成
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 左侧：API 文档 */}
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">快速接口</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    只需一个 GET 请求，即可获取任意网页的 Markdown 内容，响应时间约 5 秒。
                  </p>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 mb-4 overflow-x-auto">
                    <code className="text-sm text-blue-600 dark:text-blue-400">
                      GET {publicConfig.frontendApiUrl}/crawl?url=https://example.com
                    </code>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">参数说明</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li><code className="text-blue-600 dark:text-blue-400">url</code>: 需要提取内容的网页地址（必填）</li>
                  </ul>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">响应格式</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    直接返回 Markdown 文本内容，Content-Type 为 text/markdown
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">使用示例</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-200">
{`// JavaScript 示例
fetch("${publicConfig.frontendApiUrl}/crawl?url=https://example.com")
  .then(response => response.text())
  .then(markdown => console.log(markdown))
  .catch(error => console.error(error));

// cURL 示例
curl "${publicConfig.frontendApiUrl}/crawl?url=https://example.com" > content.md`}
                    </pre>
                  </div>
                </div>
                
                {/* 右侧：API 使用示例图 */}
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden h-full">
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 flex items-center">
                    <div className="flex space-x-1.5 ml-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">API 调用示例</div>
                  </div>
                  <div className="p-4 flex flex-col h-[calc(100%-2.5rem)]">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden">
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex items-center mb-4 bg-gray-100 dark:bg-gray-700 rounded p-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 font-mono overflow-x-auto whitespace-nowrap">
                            GET {publicConfig.frontendApiUrl}/crawl?url=https://example.com
                          </div>
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded p-2 overflow-y-auto">
                          <div className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                            # Example Domain<br /><br />
                            This domain is for use in illustrative examples in documents.<br /><br />
                            ## Information<br /><br />
                            You may use this domain in literature without prior coordination or asking for permission.<br /><br />
                            [More information...](https://www.iana.org/domains/example)
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                          响应时间: 0.8s | 内容大小: 218 bytes
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">直接获取 Markdown 内容</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">支持任意网页 URL</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">自动处理编码和格式</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 常见问题模块 */}
          <section id="faq" className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">常见问题</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  我们收集了用户最常问的问题，希望能帮助您更好地使用我们的工具
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                {/* 问题1 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFaq(0)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">如何提取网页内容？</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedFaq === 0 ? "transform rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFaq === 0 && (
                    <div className="mt-2 p-5 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        只需在输入框中输入或粘贴网页地址，然后点击"提取内容"按钮，系统将自动解析并提取网页内容。提取完成后，您可以选择HTML或Markdown格式查看结果，并可以下载或复制结果。
                      </p>
                    </div>
                  )}
                </div>

                {/* 问题2 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFaq(1)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">支持哪些格式？</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedFaq === 1 ? "transform rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFaq === 1 && (
                    <div className="mt-2 p-5 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        我们目前支持HTML和Markdown两种输出格式。HTML格式保留原始网页的结构和样式，适合需要完整网页代码的场景；Markdown格式则更适合文本内容的提取和编辑，方便用于写作和笔记。
                      </p>
                    </div>
                  )}
                </div>

                {/* 问题3 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFaq(2)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">数据是否安全？</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedFaq === 2 ? "transform rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFaq === 2 && (
                    <div className="mt-2 p-5 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        是的，我们非常重视用户数据安全。所有提取的内容都只在您的浏览器本地处理和存储，不会上传到我们的服务器。我们不会收集或存储您的个人信息或提取的内容，确保您的数据完全私密和安全。
                      </p>
                    </div>
                  )}
                </div>

                {/* 问题4 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFaq(3)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">是否需要注册？</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedFaq === 3 ? "transform rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFaq === 3 && (
                    <div className="mt-2 p-5 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        不需要。我们的工具完全免费使用，无需注册账号。您可以直接访问我们的网站，输入网址并提取内容，没有任何使用限制。这样设计是为了让您能够快速、方便地使用我们的工具，无需繁琐的注册流程。
                      </p>
                    </div>
                  )}
                </div>

                {/* 问题5 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFaq(4)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">是否会收费？</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedFaq === 4 ? "transform rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFaq === 4 && (
                    <div className="mt-2 p-5 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        目前所有基础功能都是完全免费的，并且承诺永远不会收费。我们会持续优化现有功能以提供更好的体验。未来可能会推出一些高级功能，这些新增功能可能会采用收费模式，但不会影响现有免费功能的使用。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 回到顶部按钮 */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110"
              aria-label="回到顶部"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}

          {/* 页脚 */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Link href="/" className="flex items-center mb-4">
                    <LinkIcon className="h-8 w-8 text-blue-500" />
                    <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">网页内容提取器</span>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    快速提取网页内容，支持HTML和Markdown格式，智能解析，精准提取
                  </p>
                  {/* <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <Wechat className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <Mail className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <Github className="h-6 w-6" />
                    </a>
                  </div> */}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">快速链接</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        首页
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#features"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        功能介绍
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#tutorial"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        使用教程
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#faq"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        常见问题
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#contact"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        联系我们
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">法律信息</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        隐私政策
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        服务条款
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        免责声明
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  © {new Date().getFullYear()} 网页内容提取器. 保留所有权利。
                </p>
                {/* <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">ICP备案号：京ICP备XXXXXXXX号-X</p> */}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}