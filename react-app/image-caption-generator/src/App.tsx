import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Upload, Shuffle, Download, Save, Palette, Type, Settings, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface SubtitleStyle {
  height: number
  fontSize: number
  fontColor: string
  outlineColor: string
  fontFamily: string
  fontWeight: string
  // 新增比例字段
  heightRatio: number
  fontSizeRatio: number
  outlineRatio: number
}

interface BorderStyle {
  enabled: boolean
  color: string
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  preset: 'none' | 'simple' | 'white' | 'instagram' | 'apple' | 'vintage'
}

interface ImageRect {
  width: number
  height: number
  x: number
  y: number
}

interface SearchImage {
  id: string
  url: string
  thumbnail: string
  description: string
}

function App() {
  const { toast } = useToast()
  const [image, setImage] = useState<string>('')
  const [subtitles, setSubtitles] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('已加载随机图片')
  const [visitCount, setVisitCount] = useState(0)
  const [removeWatermarkCount, setRemoveWatermarkCount] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchImage[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    height: 40,
    fontSize: 20,
    fontColor: '#ffffff',
    outlineColor: '#000000',
    fontFamily: 'system-ui',
    fontWeight: 'normal',
    // 比例字段默认值
    heightRatio: 0.05,
    fontSizeRatio: 0.025,
    outlineRatio: 0.002
  })

  const [borderStyle, setBorderStyle] = useState<BorderStyle>({
    enabled: false,
    color: '#000000',
    width: 5,
    style: 'solid',
    preset: 'none'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  // 新增状态：图片显示尺寸和原始尺寸
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 })
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 })
  
  // 新增状态：图片实际显示矩形
  const [imageRect, setImageRect] = useState<ImageRect | null>(null)

  // 核心函数：计算图片在容器中的实际显示矩形
  const getRenderedImageRect = (
    containerWidth: number,
    containerHeight: number,
    naturalWidth: number,
    naturalHeight: number
  ): ImageRect => {
    // 参数验证
    if (containerWidth <= 0 || containerHeight <= 0 || naturalWidth <= 0 || naturalHeight <= 0) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }
    
    // 计算图片的显示尺寸（保持宽高比，object-contain模式）
    const imageAspectRatio = naturalWidth / naturalHeight
    const containerAspectRatio = containerWidth / containerHeight
    
    let displayWidth, displayHeight
    
    if (imageAspectRatio > containerAspectRatio) {
      // 图片更宽，以容器宽度为准
      displayWidth = containerWidth
      displayHeight = containerWidth / imageAspectRatio
    } else {
      // 图片更高，以容器高度为准
      displayHeight = containerHeight
      displayWidth = containerHeight * imageAspectRatio
    }
    
    // 计算图片在容器中的位置（居中）
    const x = (containerWidth - displayWidth) / 2
    const y = (containerHeight - displayHeight) / 2
    
    return {
      x,
      y,
      width: displayWidth,
      height: displayHeight
    }
  }

  // 获取当前图片的实际显示矩形（使用状态数据）
  const getCurrentImageRect = (): ImageRect => {
    const container = imageContainerRef.current
    const img = imageRef.current
    
    if (!container || !img) {
      const emptyRect = { x: 0, y: 0, width: 0, height: 0 }
      setImageRect(emptyRect)
      return emptyRect
    }
    
    // 如果图片自然尺寸还未加载，尝试从img元素获取或使用默认值
    let naturalWidth = imageNaturalSize.width
    let naturalHeight = imageNaturalSize.height
    
    if (naturalWidth === 0 || naturalHeight === 0) {
      // 尝试从img元素获取自然尺寸
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        naturalWidth = img.naturalWidth
        naturalHeight = img.naturalHeight
        // 同时更新状态
        setImageNaturalSize({ width: naturalWidth, height: naturalHeight })
      } else {
        // 如果还是无法获取，使用容器尺寸作为临时值
        const containerRect = container.getBoundingClientRect()
        naturalWidth = containerRect.width || 600
        naturalHeight = containerRect.height || 400
      }
    }
    
    const containerRect = container.getBoundingClientRect()
    const rect = getRenderedImageRect(
      containerRect.width,
      containerRect.height,
      naturalWidth,
      naturalHeight
    )
    
    // 更新imageRect状态
    setImageRect(rect)
    
    return rect
  }

  // 计算比例化参数（带边界保护）
  const calculateScaledParams = (targetWidth: number, targetHeight: number) => {
    const lines = subtitles.split('\n').filter(line => line.trim() !== '')
    const lineCount = lines.length
    
    // 基础比例计算
    let height = Math.round(targetHeight * subtitleStyle.heightRatio)
    let fontSize = Math.round(targetHeight * subtitleStyle.fontSizeRatio)
    let outlineWidth = Math.round(targetHeight * subtitleStyle.outlineRatio)
    
    // 边界保护：确保所有字幕行不超过图片高度的50%
    const maxTotalHeight = targetHeight * 0.5
    const totalHeight = height * lineCount
    
    if (totalHeight > maxTotalHeight && lineCount > 0) {
      const scaleFactor = maxTotalHeight / totalHeight
      height = Math.round(height * scaleFactor)
      fontSize = Math.round(fontSize * scaleFactor)
      outlineWidth = Math.max(1, Math.round(outlineWidth * scaleFactor))
    }
    
    // 最小值保护
    height = Math.max(20, height)
    fontSize = Math.max(12, fontSize)
    outlineWidth = Math.max(1, outlineWidth)
    
    return {
      height,
      fontSize,
      outlineWidth
    }
  }

  // 中英文关键词映射表
  const keywordMapping: { [key: string]: string } = {
    // 自然类
    '自然': 'nature',
    '风景': 'landscape',
    '山': 'mountain',
    '海': 'ocean',
    '湖': 'lake',
    '河': 'river',
    '森林': 'forest',
    '树': 'tree',
    '花': 'flower',
    '草': 'grass',
    '天空': 'sky',
    '云': 'cloud',
    '日出': 'sunrise',
    '日落': 'sunset',
    '雪': 'snow',
    '雨': 'rain',
    
    // 城市建筑类
    '城市': 'city',
    '建筑': 'architecture',
    '房子': 'house',
    '桥': 'bridge',
    '街道': 'street',
    '公园': 'park',
    '广场': 'square',
    '摩天大楼': 'skyscraper',
    
    // 动物类
    '动物': 'animal',
    '猫': 'cat',
    '狗': 'dog',
    '鸟': 'bird',
    '鱼': 'fish',
    '马': 'horse',
    '熊': 'bear',
    '狮子': 'lion',
    '老虎': 'tiger',
    
    // 食物类
    '食物': 'food',
    '水果': 'fruit',
    '蔬菜': 'vegetable',
    '咖啡': 'coffee',
    '茶': 'tea',
    '面包': 'bread',
    '蛋糕': 'cake',
    
    // 交通工具类
    '汽车': 'car',
    '自行车': 'bicycle',
    '摩托车': 'motorcycle',
    '飞机': 'airplane',
    '火车': 'train',
    '船': 'boat',
    
    // 科技类
    '手表': 'watch',
    '电脑': 'computer',
    '手机': 'phone',
    '相机': 'camera',
    '科技': 'technology',
    
    // 人物类
    '人': 'people',
    '人物': 'person',
    '男人': 'man',
    '女人': 'woman',
    '孩子': 'child',
    '家庭': 'family',
    
    // 运动类
    '运动': 'sport',
    '足球': 'football',
    '篮球': 'basketball',
    '游泳': 'swimming',
    '跑步': 'running',
    
    // 艺术类
    '艺术': 'art',
    '绘画': 'painting',
    '雕塑': 'sculpture',
    '音乐': 'music',
    '舞蹈': 'dance'
  }

  // 同义词和相关词扩展
  const synonymsMapping: { [key: string]: string[] } = {
    'nature': ['landscape', 'outdoor', 'natural', 'environment'],
    'city': ['urban', 'downtown', 'metropolitan', 'cityscape'],
    'ocean': ['sea', 'water', 'beach', 'waves'],
    'mountain': ['hill', 'peak', 'summit', 'alpine'],
    'flower': ['blossom', 'bloom', 'floral', 'garden'],
    'animal': ['wildlife', 'creature', 'fauna'],
    'food': ['cuisine', 'meal', 'dish', 'cooking'],
    'technology': ['tech', 'digital', 'modern', 'innovation'],
    'art': ['artistic', 'creative', 'design', 'culture'],
    'sport': ['sports', 'athletic', 'fitness', 'exercise']
  }

  // 关键词智能处理函数
  const processKeyword = (query: string): string[] => {
    const keywords: string[] = []
    const lowerQuery = query.toLowerCase().trim()
    
    // 1. 直接中英文映射
    if (keywordMapping[lowerQuery]) {
      keywords.push(keywordMapping[lowerQuery])
    }
    
    // 2. 部分匹配中文关键词
    for (const [chinese, english] of Object.entries(keywordMapping)) {
      if (lowerQuery.includes(chinese)) {
        keywords.push(english)
      }
    }
    
    // 3. 如果是英文，直接使用
    if (/^[a-zA-Z\s]+$/.test(lowerQuery)) {
      keywords.push(lowerQuery)
    }
    
    // 4. 添加同义词扩展
    const expandedKeywords: string[] = []
    keywords.forEach(keyword => {
      expandedKeywords.push(keyword)
      if (synonymsMapping[keyword]) {
        expandedKeywords.push(...synonymsMapping[keyword])
      }
    })
    
    // 5. 如果没有找到匹配，使用原始查询
    if (expandedKeywords.length === 0) {
      expandedKeywords.push(lowerQuery)
    }
    
    // 去重并返回前3个最相关的关键词
    return [...new Set(expandedKeywords)].slice(0, 3)
  }

  // 搜索图片功能 - 使用Unsplash官方API
  const searchImages = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "请输入搜索关键词",
        description: "请输入您想要搜索的图片关键词",
        variant: "destructive"
      })
      return
    }

    setIsSearching(true)
    try {
      // 处理关键词，获取优化后的搜索词
      const processedKeywords = processKeyword(query)
      const searchQuery = processedKeywords.join(' ')
      
      console.log(`原始查询: ${query}, 处理后查询: ${searchQuery}`)
      
      let searchResults: SearchImage[] = []
      
      // 1. 优先使用Unsplash官方API
       // 注意：需要在 https://unsplash.com/developers 注册获取免费API密钥
       const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key' // 请替换为您的Unsplash API密钥
       
       try {
         const unsplashResponse = await fetch(
           `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
         )
        
        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json()
          if (unsplashData.results && unsplashData.results.length > 0) {
            searchResults = unsplashData.results.map((img: any) => ({
              id: `unsplash_${img.id}`,
              url: img.urls.regular,
              thumbnail: img.urls.small,
              description: img.alt_description || img.description || `${query} - ${img.user.name}摄影作品`
            }))
          }
        }
      } catch (unsplashError) {
        console.log('Unsplash API 调用失败:', unsplashError)
      }
      
      // 2. 备用方案：使用Pixabay API
      if (searchResults.length === 0) {
        try {
          const pixabayResponse = await fetch(
            `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=3&min_width=800&min_height=600&safesearch=true`
          )
          
          if (pixabayResponse.ok) {
            const pixabayData = await pixabayResponse.json()
            if (pixabayData.hits && pixabayData.hits.length > 0) {
              searchResults = pixabayData.hits.map((img: any, index: number) => ({
                id: `pixabay_${img.id}`,
                url: img.webformatURL,
                thumbnail: img.previewURL,
                description: img.tags ? `${query}: ${img.tags.split(',').slice(0, 3).join(', ')}` : `${query} 相关图片 ${index + 1}`
              }))
            }
          }
        } catch (pixabayError) {
          console.log('Pixabay API 调用失败:', pixabayError)
        }
      }
      
      // 3. 第二备用方案：使用Pexels API
      if (searchResults.length === 0) {
        try {
          const pexelsResponse = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape`,
            {
              headers: {
                'Authorization': '563492ad6f91700001000001cdf28b4c0c5c4b9b9c0c4b9b9c0c4b9b'
              }
            }
          )
          
          if (pexelsResponse.ok) {
            const pexelsData = await pexelsResponse.json()
            if (pexelsData.photos && pexelsData.photos.length > 0) {
              searchResults = pexelsData.photos.map((img: any, index: number) => ({
                id: `pexels_${img.id}`,
                url: img.src.large,
                thumbnail: img.src.small,
                description: img.alt ? `${query}: ${img.alt}` : `${query} 相关图片 ${index + 1}`
              }))
            }
          }
        } catch (pexelsError) {
          console.log('Pexels API 调用失败:', pexelsError)
        }
      }
      
      // 4. 最终备用方案：使用Unsplash Source API
      if (searchResults.length === 0) {
        const primaryKeyword = processedKeywords[0] || 'random'
        const timestamp = Date.now()
        
        searchResults = [
          {
            id: '1',
            url: `https://source.unsplash.com/1200x800/?${primaryKeyword}&sig=${timestamp}`,
            thumbnail: `https://source.unsplash.com/300x200/?${primaryKeyword}&sig=${timestamp}`,
            description: `${query} 相关图片 1`
          },
          {
            id: '2',
            url: `https://source.unsplash.com/1200x800/?${primaryKeyword}&sig=${timestamp + 1}`,
            thumbnail: `https://source.unsplash.com/300x200/?${primaryKeyword}&sig=${timestamp + 1}`,
            description: `${query} 相关图片 2`
          },
          {
            id: '3',
            url: `https://source.unsplash.com/1200x800/?${primaryKeyword}&sig=${timestamp + 2}`,
            thumbnail: `https://source.unsplash.com/300x200/?${primaryKeyword}&sig=${timestamp + 2}`,
            description: `${query} 相关图片 3`
          }
        ]
      }
      
      setSearchResults(searchResults)
      toast({
        title: "搜索完成",
        description: `找到 ${searchResults.length} 张"${query}"相关图片（搜索词：${searchQuery}）`
      })
      
    } catch (error) {
      console.error('搜索图片失败:', error)
      toast({
        title: "搜索失败",
        description: "图片搜索服务暂时不可用，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsSearching(false)
    }
  }

  // 选择搜索结果中的图片
  const selectSearchImage = async (searchImage: SearchImage) => {
    try {
      setIsLoading(true)
      setUploadStatus('正在加载选择的图片...')
      
      // 验证图片URL是否可访问
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      const loadPromise = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('图片加载超时'))
        }, 10000) // 10秒超时
        
        img.onload = () => {
          clearTimeout(timeout)
          resolve(searchImage.url)
        }
        
        img.onerror = () => {
          clearTimeout(timeout)
          reject(new Error('图片加载失败'))
        }
        
        img.src = searchImage.url
      })
      
      await loadPromise
      
      setImage(searchImage.url)
      setUploadStatus(`已选择: ${searchImage.description}`)
      setIsLoading(false)
      
      toast({
        title: "图片已选择",
        description: searchImage.description
      })
      
    } catch (error) {
      console.error('选择图片失败:', error)
      setIsLoading(false)
      setUploadStatus('图片加载失败，请重试')
      
      toast({
        title: "图片加载失败",
        description: "请尝试选择其他图片或检查网络连接",
        variant: "destructive"
      })
    }
  }

  // 生成占位符图片
  const generatePlaceholderImage = (): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    
    // 设置画布尺寸
    canvas.width = 1200
    canvas.height = 800
    
    // 创建渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#f8fafc')
    gradient.addColorStop(0.5, '#e2e8f0')
    gradient.addColorStop(1, '#cbd5e1')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 设置文字样式
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 绘制主标题
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif'
    ctx.fillText('你的新诗刻', canvas.width / 2, canvas.height / 2 - 30)
    
    // 绘制副标题
    ctx.font = '32px system-ui, -apple-system, sans-serif'
    ctx.fillText('即将开始', canvas.width / 2, canvas.height / 2 + 30)
    
    // 添加装饰性边框
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.setLineDash([10, 5])
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)
    
    return canvas.toDataURL('image/png')
  }

  // 初始化访问计数和去水印次数
  useEffect(() => {
    const count = localStorage.getItem('visitCount') || '0'
    const newCount = parseInt(count) + 1
    localStorage.setItem('visitCount', newCount.toString())
    setVisitCount(newCount)
    
    // 初始化去水印次数
    const watermarkCount = localStorage.getItem('removeWatermarkCount')
    if (watermarkCount === null) {
      localStorage.setItem('removeWatermarkCount', '5')
      setRemoveWatermarkCount(5)
    } else {
      setRemoveWatermarkCount(parseInt(watermarkCount))
    }
    
    // 生成默认占位符图片
    if (!image) {
      const placeholderImage = generatePlaceholderImage()
      setImage(placeholderImage)
      setUploadStatus('已加载占位符图片')
    }
  }, [])

  // ResizeObserver监听容器尺寸变化
  useEffect(() => {
    const container = imageContainerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setImageDisplaySize({ width, height })
        // 立即更新imageRect以确保字幕实时渲染
        setTimeout(() => {
          getCurrentImageRect()
        }, 0)
      }
    })

    resizeObserver.observe(container)
    
    // 初始化时手动触发一次尺寸计算
    const containerRect = container.getBoundingClientRect()
    if (containerRect.width > 0 && containerRect.height > 0) {
      setImageDisplaySize({ 
        width: containerRect.width, 
        height: containerRect.height 
      })
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // 监听图片加载，更新原始尺寸
  useEffect(() => {
    const img = imageRef.current
    const container = imageContainerRef.current
    if (!img) return

    const handleImageLoad = () => {
      setImageNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
      
      // 手动触发容器尺寸计算，确保imageDisplaySize被正确初始化
      if (container) {
        const containerRect = container.getBoundingClientRect()
        if (containerRect.width > 0 && containerRect.height > 0) {
          setImageDisplaySize({ 
            width: containerRect.width, 
            height: containerRect.height 
          })
        }
      }
    }

    if (img.complete) {
      handleImageLoad()
    } else {
      img.addEventListener('load', handleImageLoad)
      return () => img.removeEventListener('load', handleImageLoad)
    }
  }, [image])

  // 监听图片尺寸变化，自动更新imageRect
  useEffect(() => {
    if (imageDisplaySize.width > 0 && imageDisplaySize.height > 0 && 
        imageNaturalSize.width > 0 && imageNaturalSize.height > 0) {
      getCurrentImageRect()
    }
  }, [imageDisplaySize, imageNaturalSize])

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setUploadStatus(`已选择: ${file.name}`)
      toast({
        title: "图片上传成功",
        description: "图片已成功加载到预览区域",
      })
    }
    reader.readAsDataURL(file)
  }

  // 获取随机图片 - 优化的多源加载策略
  const getRandomImage = async () => {
    setIsLoading(true)
    setUploadStatus('正在加载随机图片...')
    
    const randomSeed = Math.floor(Math.random() * 10000)
    
    // 定义多个图片源，按优先级排序，优先使用国内可访问的源
    const imageSources = [
      {
        name: 'Bing每日图片',
        url: `https://api.dujin.org/bing/1920.php?t=${randomSeed}`,
        description: '已从Bing每日图片获取新图片'
      },
      {
        name: '随机风景',
        url: `https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&t=${randomSeed}`,
        description: '已获取随机风景图片'
      },
      {
        name: 'Picsum',
        url: `https://picsum.photos/1200/800?random=${randomSeed}`,
        description: '已从Picsum获取新的随机图片'
      },
      {
        name: '备用随机图',
        url: `https://api.btstu.cn/sjbz/api.php?format=images&t=${randomSeed}`,
        description: '已获取备用随机图片'
      }
    ]
    
    // 尝试加载图片的函数
    const tryLoadImage = (source: typeof imageSources[0]): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        const timeout = setTimeout(() => {
          reject(new Error(`${source.name} 加载超时`))
        }, 8000) // 8秒超时
        
        img.onload = () => {
          clearTimeout(timeout)
          resolve(source.url)
        }
        
        img.onerror = () => {
          clearTimeout(timeout)
          reject(new Error(`${source.name} 加载失败`))
        }
        
        img.src = source.url
      })
    }
    
    // 依次尝试各个图片源
    let lastError: Error | null = null
    
    for (const source of imageSources) {
      try {
        const imageUrl = await tryLoadImage(source)
        setImage(imageUrl)
        setUploadStatus('已加载随机图片')
        setIsLoading(false)
        toast({
          title: "随机图片加载成功",
          description: source.description,
        })
        return
      } catch (error) {
        lastError = error as Error
        console.log(`${source.name} 失败，尝试下一个源...`)
        continue
      }
    }
    
    // 所有源都失败，使用本地生成的占位图
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 800
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 1200, 800)
        gradient.addColorStop(0, '#f0f0f0')
        gradient.addColorStop(0.5, '#e0e0e0')
        gradient.addColorStop(1, '#d0d0d0')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 1200, 800)
        
        // 添加文字
        ctx.font = 'bold 48px Arial'
        ctx.fillStyle = '#999'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('图片字幕生成器', 600, 350)
        
        ctx.font = '24px Arial'
        ctx.fillStyle = '#666'
        ctx.fillText('无法加载网络图片，请上传本地图片', 600, 420)
        ctx.fillText('或检查网络连接后重试', 600, 460)
        
        const placeholderUrl = canvas.toDataURL('image/jpeg', 0.8)
        setImage(placeholderUrl)
        setUploadStatus('已生成占位图片，建议上传本地图片')
        setIsLoading(false)
        
        toast({
          title: "使用占位图片",
          description: "网络图片加载失败，已生成占位图片",
          variant: "destructive"
        })
      }
    } catch (error) {
      setIsLoading(false)
      setUploadStatus('加载失败，请上传本地图片')
      toast({
        title: "图片加载完全失败",
        description: "请上传本地图片继续使用",
        variant: "destructive"
      })
    }
  }

  // 应用字幕到Canvas
  const applySubtitles = () => {
    if (!subtitles.trim()) {
      toast({
        title: "请输入字幕内容",
        description: "请在字幕输入框中添加文本内容",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "字幕已应用",
      description: "字幕已成功添加到图片预览中",
    })
  }

  // 处理去水印功能
  const handleRemoveWatermark = async () => {
    if (removeWatermarkCount <= 0) {
      toast({
        title: "免费次数已用完",
        description: "转发一次可获得3次免费去水印次数",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareForFreeUses}
            className="ml-2 text-black"
          >
            转发获取
          </Button>
        )
      })
      return
    }

    if (!subtitles.trim()) {
      toast({
        title: "请先添加字幕内容",
        description: "请在字幕输入框中添加文本内容后再去除水印",
        variant: "destructive"
      })
      return
    }

    // 扣除次数
    const newCount = removeWatermarkCount - 1
    setRemoveWatermarkCount(newCount)
    localStorage.setItem('removeWatermarkCount', newCount.toString())

    // 保存无水印图片
    await saveImage(false)

    toast({
      title: "去水印成功",
      description: `无水印图片已下载，剩余 ${newCount} 次免费使用`,
    })
  }

  // 处理转发获取免费次数
  const handleShareForFreeUses = () => {
    // 生成当前网页链接
    const currentUrl = window.location.href
    const shareText = `发现一个超棒的图片字幕生成器！CineScript·新诗刻——让每一篇文案创作从此定格 ${currentUrl}`
    
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      const newCount = removeWatermarkCount + 3
      setRemoveWatermarkCount(newCount)
      localStorage.setItem('removeWatermarkCount', newCount.toString())
      toast({
        title: "转发链接已复制",
        description: "链接已复制到剪贴板，转发后即可获得3次免费去水印次数！",
      })
    }).catch(() => {
      toast({
        title: "复制失败",
        description: "请手动复制链接进行转发",
        variant: "destructive"
      })
    })
  }

  // 保存图片 - 增强的Canvas渲染和错误处理
  const saveImage = async (withWatermark: boolean = true) => {
    const canvas = canvasRef.current
    const img = imageRef.current
    
    if (!canvas || !img) {
      toast({
        title: "保存失败",
        description: "无法获取图片或画布元素",
        variant: "destructive"
      })
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      toast({
        title: "保存失败",
        description: "无法获取Canvas上下文",
        variant: "destructive"
      })
      return
    }

    try {
      // 显示保存状态
      setIsLoading(true)
      setUploadStatus('正在生成图片...')

      // 设置画布尺寸 - 根据边框样式调整
      const imgWidth = img.naturalWidth || img.width || 1200
      const imgHeight = img.naturalHeight || img.height || 800
      
      let canvasWidth = imgWidth
      let canvasHeight = imgHeight
      let imageX = 0
      let imageY = 0
      
      // 根据边框样式调整画布和图片位置
      if (borderStyle.enabled) {
        switch (borderStyle.preset) {
          case 'white':
            const whiteBorderWidth = Math.max(12, imgWidth * 0.03)
            canvasWidth = imgWidth + whiteBorderWidth * 2
            canvasHeight = imgHeight + whiteBorderWidth * 2
            imageX = whiteBorderWidth
            imageY = whiteBorderWidth
            break
            
          case 'instagram':
            const instaPadding = Math.max(20, imgWidth * 0.05)
            const instaHeaderHeight = Math.max(60, imgWidth * 0.08)
            const instaFooterHeight = Math.max(80, imgWidth * 0.1)
            canvasWidth = imgWidth + instaPadding * 2
            canvasHeight = imgHeight + instaHeaderHeight + instaFooterHeight + instaPadding * 2
            imageX = instaPadding
            imageY = instaHeaderHeight + instaPadding
            break
            
          case 'apple':
            const appleBorderWidth = Math.max(1, imgWidth * 0.002)
            canvasWidth = imgWidth + appleBorderWidth * 2
            canvasHeight = imgHeight + appleBorderWidth * 2
            imageX = appleBorderWidth
            imageY = appleBorderWidth
            break
            
          case 'vintage':
            const vintageBorderWidth = Math.max(24, imgWidth * 0.06)
            canvasWidth = imgWidth + vintageBorderWidth * 2
            canvasHeight = imgHeight + vintageBorderWidth * 2
            imageX = vintageBorderWidth
            imageY = vintageBorderWidth
            break
        }
      }
      
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 处理跨域图片
      const drawImageSafely = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          try {
            // 直接尝试绘制图片到指定位置
            ctx.drawImage(img, imageX, imageY, imgWidth, imgHeight)
            resolve()
          } catch (error) {
            // 如果是跨域问题，创建新的图片元素
            const tempImg = new Image()
            tempImg.crossOrigin = 'anonymous'
            
            tempImg.onload = () => {
              try {
                ctx.drawImage(tempImg, imageX, imageY, imgWidth, imgHeight)
                resolve()
              } catch (err) {
                reject(err)
              }
            }
            
            tempImg.onerror = () => {
              reject(new Error('无法加载图片'))
            }
            
            tempImg.src = img.src
          }
        })
      }

      await drawImageSafely()

      // 绘制字幕 - 使用比例化参数，按输入顺序从底部向上绘制
      const lines = subtitles.split('\n').filter(line => line.trim() !== '')
      if (lines.length > 0) {
        // 使用原始图片尺寸计算比例化参数
        const scaledParams = calculateScaledParams(imgWidth, imgHeight)
        
        // 计算字幕区域的边界
        const subtitleAreaX = imageX
        const subtitleAreaY = imageY
        const subtitleAreaWidth = imgWidth
        const subtitleAreaHeight = imgHeight
        
        // 按输入顺序绘制，第一行在最底部
        lines.forEach((line, index) => {
          // 计算Y坐标：第一行在图片区域最底部，后续行依次向上
          const y = subtitleAreaY + subtitleAreaHeight - scaledParams.height * (index + 1)
          
          // 绘制字幕背景
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
          ctx.fillRect(subtitleAreaX, y, subtitleAreaWidth, scaledParams.height)
          
          // 绘制分割线（除了第一行，即最底部的行）
          if (index > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(subtitleAreaX, y)
            ctx.lineTo(subtitleAreaX + subtitleAreaWidth, y)
            ctx.stroke()
          }
          
          // 设置文字样式
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = `${subtitleStyle.fontWeight} ${scaledParams.fontSize}px ${subtitleStyle.fontFamily}`
          
          const textY = y + scaledParams.height / 2
          const textX = subtitleAreaX + subtitleAreaWidth / 2
          
          // 绘制文字轮廓（使用比例化轮廓宽度）
          ctx.lineWidth = scaledParams.outlineWidth
          ctx.strokeStyle = subtitleStyle.outlineColor
          ctx.strokeText(line, textX, textY)
          
          // 填充文字
          ctx.fillStyle = subtitleStyle.fontColor
          ctx.fillText(line, textX, textY)
        })
      }

      // 绘制水印（根据参数决定是否绘制）
      if (withWatermark) {
        ctx.save()
        ctx.font = 'normal 14px Arial'
        ctx.globalAlpha = 0.7
        
        const watermarkText = 'Avis@CineScript'
        const watermarkMetrics = ctx.measureText(watermarkText)
        const watermarkWidth = watermarkMetrics.width + 12
        const watermarkHeight = 20
        
        // 水印位置：在图片区域的右下角
        const watermarkX = imageX + imgWidth - watermarkWidth - 10
        const watermarkY = imageY + imgHeight - watermarkHeight - 10
        
        // 水印背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.fillRect(watermarkX, watermarkY, watermarkWidth, watermarkHeight)
        
        // 水印文字
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(watermarkText, watermarkX + watermarkWidth / 2, watermarkY + watermarkHeight / 2)
        
        ctx.restore()
      }

      // 绘制边框（如果启用）
      if (borderStyle.enabled) {
        ctx.save()
        
        switch (borderStyle.preset) {
          case 'white':
            // 白色边框样式 - 类似拍立得照片
            const whiteBorderWidth = Math.max(12, canvas.width * 0.03) // 响应式边框宽度
            
            // 绘制白色边框
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, whiteBorderWidth) // 上边框
            ctx.fillRect(0, 0, whiteBorderWidth, canvas.height) // 左边框
            ctx.fillRect(canvas.width - whiteBorderWidth, 0, whiteBorderWidth, canvas.height) // 右边框
            ctx.fillRect(0, canvas.height - whiteBorderWidth, canvas.width, whiteBorderWidth) // 下边框
            
            // 添加阴影效果
            ctx.shadowColor = 'rgba(0, 0, 0, 0.12)'
            ctx.shadowBlur = 16
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 4
            
            // 绘制内部图片区域的边框
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
            ctx.lineWidth = 1
            ctx.setLineDash([])
            ctx.strokeRect(
              whiteBorderWidth,
              whiteBorderWidth,
              canvas.width - whiteBorderWidth * 2,
              canvas.height - whiteBorderWidth * 2
            )
            break
            
          case 'instagram':
            // Instagram卡片风格边框
            // 绘制白色背景卡片
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // 绘制边框
            ctx.strokeStyle = '#e6e6e6'
            ctx.lineWidth = 1
            ctx.setLineDash([])
            
            // 创建圆角矩形路径
            const borderRadius = 18
            ctx.beginPath()
            ctx.roundRect(
              0.5,
              0.5,
              canvas.width - 1,
              canvas.height - 1,
              borderRadius
            )
            ctx.stroke()
            
            // 添加轻微的阴影效果
            ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
            ctx.shadowBlur = 24
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 4
            break
            
          case 'apple':
            // 苹果风格边框 - 圆角和优雅的阴影
            const appleBorderWidth = Math.max(1, canvas.width * 0.002)
            const cornerRadius = Math.min(32, canvas.width * 0.08) // 响应式圆角
            
            // 绘制圆角矩形边框
            ctx.strokeStyle = '#eaeaea'
            ctx.lineWidth = appleBorderWidth
            ctx.setLineDash([])
            
            // 创建圆角矩形路径
            ctx.beginPath()
            ctx.roundRect(
              appleBorderWidth / 2,
              appleBorderWidth / 2,
              canvas.width - appleBorderWidth,
              canvas.height - appleBorderWidth,
              cornerRadius
            )
            ctx.stroke()
            
            // 添加苹果风格的阴影
            ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
            ctx.shadowBlur = 32
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 8
            break
            
          case 'vintage':
            // 苏哈镜头边框 - 复古相机镜头风格
            const vintageBorderWidth = Math.max(24, canvas.width * 0.06)
            const vintageCornerRadius = Math.min(16, canvas.width * 0.04)
            
            // 绘制外层深色边框
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, '#2a2a2a')
            gradient.addColorStop(0.5, '#1a1a1a')
            gradient.addColorStop(1, '#2a2a2a')
            
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, vintageBorderWidth) // 上边框
            ctx.fillRect(0, 0, vintageBorderWidth, canvas.height) // 左边框
            ctx.fillRect(canvas.width - vintageBorderWidth, 0, vintageBorderWidth, canvas.height) // 右边框
            ctx.fillRect(0, canvas.height - vintageBorderWidth, canvas.width, vintageBorderWidth) // 下边框
            
            // 绘制内层金属质感边框
            ctx.strokeStyle = '#444'
            ctx.lineWidth = 3
            ctx.setLineDash([])
            
            // 创建圆角矩形路径
            ctx.beginPath()
            ctx.roundRect(
              vintageBorderWidth / 2,
              vintageBorderWidth / 2,
              canvas.width - vintageBorderWidth,
              canvas.height - vintageBorderWidth,
              vintageCornerRadius
            )
            ctx.stroke()
            
            // 添加复古阴影效果
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
            ctx.shadowBlur = 32
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 8
            break
            
          case 'simple':
          case 'none':
          default:
            // 简单边框或自定义边框
            ctx.strokeStyle = borderStyle.color
            ctx.lineWidth = borderStyle.width
            
            // 设置线条样式
            if (borderStyle.style === 'dashed') {
              ctx.setLineDash([borderStyle.width * 3, borderStyle.width * 2])
            } else if (borderStyle.style === 'dotted') {
              ctx.setLineDash([borderStyle.width, borderStyle.width])
            } else {
              ctx.setLineDash([])
            }
            
            // 绘制边框矩形（考虑线宽，避免边框被裁切）
            const halfWidth = borderStyle.width / 2
            ctx.strokeRect(
              halfWidth,
              halfWidth,
              canvas.width - borderStyle.width,
              canvas.height - borderStyle.width
            )
            break
        }
        
        ctx.restore()
      }

      // 生成并下载图片
      const downloadImage = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `captioned-image-${Date.now()}.jpg`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
              resolve()
            } else {
              reject(new Error('无法生成图片Blob'))
            }
          }, 'image/jpeg', 0.92)
        })
      }

      await downloadImage()
      
      setIsLoading(false)
      setUploadStatus('图片保存成功')
      
      toast({
        title: "图片保存成功",
        description: "图片已下载到您的设备",
      })

      // 2秒后恢复原状态
      setTimeout(() => {
        setUploadStatus('已加载随机图片')
      }, 2000)

    } catch (error) {
      console.error('保存图片时出错:', error)
      setIsLoading(false)
      setUploadStatus('保存失败，请重试')
      
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "未知错误，请重试",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-stone-700">CineScript·新诗刻——让每一篇文案创作从此定格</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-stone-500">
                访问次数: <span className="font-medium text-stone-600">{visitCount}</span>
              </div>
              <div className="text-sm text-stone-500">
                去水印次数: <span className={`font-medium ${removeWatermarkCount > 0 ? 'text-green-600' : 'text-red-600'}`}>{removeWatermarkCount}</span>
              </div>
              {removeWatermarkCount <= 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareForFreeUses}
                  className="text-xs"
                >
                  转发获取免费次数
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-4">
          {/* 左侧控制面板 - 图片管理+字幕样式+字幕内容 */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4">
            {/* 图片上传区域 */}
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 px-3">
                <CardTitle className="flex items-center gap-2 text-stone-700 text-sm">
                  <Upload className="w-4 h-4" />
                  图片管理
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-3 pb-3">
                <div className="space-y-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-stone-300 hover:bg-stone-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    选择图片文件
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <Button
                    onClick={getRandomImage}
                    disabled={isLoading}
                    className="w-full bg-stone-600 hover:bg-stone-700"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    {isLoading ? '加载中...' : '获取随机图片'}
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                {/* 图片搜索区域 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-medium text-stone-600">搜索图片</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="输入关键词，如：自然、城市、动物..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          searchImages(searchQuery)
                        }
                      }}
                    />
                    <Button
                      onClick={() => searchImages(searchQuery)}
                      disabled={isSearching}
                      variant="outline"
                      className="px-3"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* 搜索结果展示 */}
                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-stone-500">点击图片选择:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="relative cursor-pointer group"
                            onClick={() => selectSearchImage(result)}
                          >
                            <img
                              src={result.thumbnail}
                              alt={result.description}
                              className="w-full h-16 object-cover rounded border border-stone-200 group-hover:border-stone-400 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isSearching && (
                    <p className="text-sm text-stone-500 text-center">搜索中...</p>
                  )}
                </div>
                
                <p className="text-sm text-stone-500 text-center">{uploadStatus}</p>
              </CardContent>
            </Card>

            {/* 字幕样式控制 */}
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 px-3">
                <CardTitle className="flex items-center gap-2 text-stone-700 text-sm">
                  <Palette className="w-4 h-4" />
                  字幕样式
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-3 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-600">字幕高度比例</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[subtitleStyle.heightRatio * 100]}
                        onValueChange={(value) => setSubtitleStyle(prev => ({ ...prev, heightRatio: value[0] / 100 }))}
                        max={15}
                        min={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm text-stone-500 w-12">{(subtitleStyle.heightRatio * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-stone-600">字体大小比例</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[subtitleStyle.fontSizeRatio * 100]}
                        onValueChange={(value) => setSubtitleStyle(prev => ({ ...prev, fontSizeRatio: value[0] / 100 }))}
                        max={8}
                        min={1}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm text-stone-500 w-12">{(subtitleStyle.fontSizeRatio * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-600">轮廓宽度比例</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[subtitleStyle.outlineRatio * 1000]}
                      onValueChange={(value) => setSubtitleStyle(prev => ({ ...prev, outlineRatio: value[0] / 1000 }))}
                      max={8}
                      min={0.5}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm text-stone-500 w-12">{(subtitleStyle.outlineRatio * 1000).toFixed(1)}‰</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-600">字体颜色</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={subtitleStyle.fontColor}
                        onChange={(e) => setSubtitleStyle(prev => ({ ...prev, fontColor: e.target.value }))}
                        className="w-10 h-8 rounded border border-stone-300 flex-shrink-0"
                      />
                      <Input
                        value={subtitleStyle.fontColor}
                        onChange={(e) => setSubtitleStyle(prev => ({ ...prev, fontColor: e.target.value }))}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-stone-600">轮廓颜色</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={subtitleStyle.outlineColor}
                        onChange={(e) => setSubtitleStyle(prev => ({ ...prev, outlineColor: e.target.value }))}
                        className="w-10 h-8 rounded border border-stone-300 flex-shrink-0"
                      />
                      <Input
                        value={subtitleStyle.outlineColor}
                        onChange={(e) => setSubtitleStyle(prev => ({ ...prev, outlineColor: e.target.value }))}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-600">字体样式</Label>
                    <Select
                      value={subtitleStyle.fontFamily}
                      onValueChange={(value) => setSubtitleStyle(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-ui">系统默认</SelectItem>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Microsoft YaHei', sans-serif">微软雅黑</SelectItem>
                        <SelectItem value="'SimHei', sans-serif">黑体</SelectItem>
                        <SelectItem value="'SimSun', serif">宋体</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-stone-600">字体粗细</Label>
                    <Select
                      value={subtitleStyle.fontWeight}
                      onValueChange={(value) => setSubtitleStyle(prev => ({ ...prev, fontWeight: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="bold">粗体</SelectItem>
                        <SelectItem value="lighter">细体</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* 中间预览区域 - 图片预览 */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <Card className="border-stone-200 shadow-sm h-fit">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="text-stone-700 text-base">预览</CardTitle>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div className="bg-stone-100 rounded-lg p-8 text-center">
                    <div className="text-stone-400 text-lg mb-2">暂无图片</div>
                    <div className="text-stone-500 text-sm">请上传图片或获取随机图片开始使用</div>
                  </div>
                ) : (
                  <div 
                    ref={imageContainerRef}
                    className="relative bg-stone-100 rounded-lg overflow-visible"
                  >
                    <img
                      ref={imageRef}
                      src={image}
                      alt="预览图片"
                      className="w-full h-auto max-h-[800px] object-contain relative"
                      style={{ zIndex: 2 }}
                      crossOrigin="anonymous"
                    />
                    
                    {/* 字幕预览层 */}
                    {subtitles && image && (() => {
                      // 如果imageRect还没计算出来，计算临时的displayRect
                      let displayRect = imageRect
                      if (!displayRect) {
                        // 获取容器和图片的实际尺寸来计算临时displayRect
                        const container = imageContainerRef.current
                        const img = imageRef.current
                        if (container && img) {
                          const containerRect = container.getBoundingClientRect()
                          const naturalWidth = imageNaturalSize.width || img.naturalWidth || 800
                          const naturalHeight = imageNaturalSize.height || img.naturalHeight || 600
                          displayRect = getRenderedImageRect(
                            containerRect.width,
                            containerRect.height,
                            naturalWidth,
                            naturalHeight
                          )
                        } else {
                          // 最后的备用方案
                          displayRect = {
                            x: 0,
                            y: 0,
                            width: imageDisplaySize.width || 400,
                            height: imageDisplaySize.height || 300
                          }
                        }
                      }
                      
                      const scaledParams = calculateScaledParams(displayRect.width, displayRect.height)
                      
                      return (
                        <div 
                          className="absolute bottom-0 left-0"
                          style={{
                            left: `${displayRect.x}px`,
                            bottom: `${displayRect.y}px`,
                            width: `${displayRect.width}px`,
                            zIndex: 3
                          }}
                        >
                          {subtitles.split('\n').filter(line => line.trim() !== '').map((line, index, array) => (
                            <div
                              key={index}
                              className="w-full bg-black/55 text-white text-center flex items-center justify-center border-b border-white/8 last:border-b-0"
                              style={{
                                height: `${scaledParams.height}px`,
                                fontSize: `${scaledParams.fontSize}px`,
                                fontFamily: subtitleStyle.fontFamily,
                                fontWeight: subtitleStyle.fontWeight,
                                color: subtitleStyle.fontColor,
                                textShadow: `
                                  -${scaledParams.outlineWidth}px -${scaledParams.outlineWidth}px ${scaledParams.outlineWidth}px ${subtitleStyle.outlineColor},
                                  ${scaledParams.outlineWidth}px -${scaledParams.outlineWidth}px ${scaledParams.outlineWidth}px ${subtitleStyle.outlineColor},
                                  -${scaledParams.outlineWidth}px ${scaledParams.outlineWidth}px ${scaledParams.outlineWidth}px ${subtitleStyle.outlineColor},
                                  ${scaledParams.outlineWidth}px ${scaledParams.outlineWidth}px ${scaledParams.outlineWidth}px ${subtitleStyle.outlineColor}
                                `,
                                order: array.length - index
                              }}
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                    
                    {/* 边框预览 - 围绕图片显示 */}
                    {borderStyle.enabled && image && (() => {
                      // 如果imageRect还没计算出来，计算临时的displayRect
                      let displayRect = imageRect
                      if (!displayRect) {
                        // 获取容器和图片的实际尺寸来计算临时displayRect
                        const container = imageContainerRef.current
                        const img = imageRef.current
                        if (container && img) {
                          const containerRect = container.getBoundingClientRect()
                          const naturalWidth = imageNaturalSize.width || img.naturalWidth || 800
                          const naturalHeight = imageNaturalSize.height || img.naturalHeight || 600
                          displayRect = getRenderedImageRect(
                            containerRect.width,
                            containerRect.height,
                            naturalWidth,
                            naturalHeight
                          )
                        } else {
                          // 最后的备用方案
                          displayRect = {
                            x: 0,
                            y: 0,
                            width: imageDisplaySize.width || 400,
                            height: imageDisplaySize.height || 300
                          }
                        }
                      }
                      
                      const getBorderPreviewStyle = () => {
                        // 计算图片缩放比例，如果imageNaturalSize还没加载完成，使用1作为默认比例
                        const scaleRatio = imageNaturalSize.width > 0 ? displayRect.width / imageNaturalSize.width : 1
                        
                        // 简化边框逻辑，只保留简单边框和自定义边框
                        switch (borderStyle.preset) {
                          case 'simple':
                            // 简单边框 - 根据缩放比例调整边框宽度
                            const scaledSimpleBorderWidth = borderStyle.width * scaleRatio
                            return {
                              left: `${displayRect.x - scaledSimpleBorderWidth}px`,
                              top: `${displayRect.y - scaledSimpleBorderWidth}px`,
                              width: `${displayRect.width + scaledSimpleBorderWidth * 2}px`,
                              height: `${displayRect.height + scaledSimpleBorderWidth * 2}px`,
                              border: `${scaledSimpleBorderWidth}px ${borderStyle.style} ${borderStyle.color}`,
                              backgroundColor: 'transparent',
                              zIndex: 1
                            }
                          case 'none':
                          default:
                            // 自定义边框 - 根据缩放比例调整边框宽度
                            const scaledCustomBorderWidth = borderStyle.width * scaleRatio
                            return {
                              left: `${displayRect.x - scaledCustomBorderWidth}px`,
                              top: `${displayRect.y - scaledCustomBorderWidth}px`,
                              width: `${displayRect.width + scaledCustomBorderWidth * 2}px`,
                              height: `${displayRect.height + scaledCustomBorderWidth * 2}px`,
                              border: `${scaledCustomBorderWidth}px ${borderStyle.style} ${borderStyle.color}`,
                              backgroundColor: 'transparent',
                              zIndex: 1
                            }
                        }
                      }
                      
                      return (
                        <div
                          className="absolute pointer-events-none"
                          style={getBorderPreviewStyle()}
                        />
                      )
                    })()}

                    {/* 水印 */}
                    <div className="absolute bottom-2 right-2 bg-black/20 text-white/70 px-2 py-1 rounded text-sm" style={{ zIndex: 4 }}>
                      Avis@CineScript
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            
            {/* 字幕内容和图片信息区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* 字幕内容设置 */}
              <div className="lg:col-span-2">
                <Card className="border-stone-200 shadow-sm">
                  <CardHeader className="pb-3 px-3">
                    <CardTitle className="flex items-center gap-2 text-stone-700 text-sm">
                      <Type className="w-4 h-4" />
                      字幕内容
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <Textarea
                      value={subtitles}
                      onChange={(e) => setSubtitles(e.target.value)}
                      placeholder="在此输入字幕文本，每行一个字幕..."
                      className="min-h-[120px] border-stone-300 focus:border-stone-500"
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* 图片信息 */}
              {image && (
                <div className="lg:col-span-3">
                  <Card className="border-stone-200 shadow-sm bg-stone-50">
                    <CardHeader className="pb-3 px-3">
                      <CardTitle className="flex items-center gap-2 text-stone-700 text-sm">
                        <Settings className="w-4 h-4" />
                        图片信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                      {/* 2x2 网格布局 */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {/* 左上角：图片尺寸 */}
                        <div>
                          <div className="font-medium text-stone-600 mb-1">图片尺寸</div>
                          <div className="text-stone-500">
                            显示: {imageRect ? `${Math.round(imageRect.width)}×${Math.round(imageRect.height)}` : '计算中...'}
                          </div>
                          <div className="text-stone-500">
                            原始: {imageNaturalSize.width > 0 ? `${imageNaturalSize.width}×${imageNaturalSize.height}` : '加载中...'}
                          </div>
                        </div>
                        
                        {/* 右上角：预览像素值 */}
                        <div>
                          <div className="font-medium text-stone-600 mb-1">预览像素值</div>
                          {imageRect ? (() => {
                            const scaledParams = calculateScaledParams(imageRect.width, imageRect.height)
                            return (
                              <>
                                <div className="text-stone-500">
                                  高度: {scaledParams.height}px
                                </div>
                                <div className="text-stone-500">
                                  字体: {scaledParams.fontSize}px
                                </div>
                                <div className="text-stone-500">
                                  轮廓: {scaledParams.outlineWidth}px
                                </div>
                              </>
                            )
                          })() : (
                            <div className="text-stone-500">计算中...</div>
                          )}
                        </div>
                        
                        {/* 左下角：比例参数 */}
                        <div>
                          <div className="font-medium text-stone-600 mb-1">比例参数</div>
                          <div className="text-stone-500">
                            高度: {(subtitleStyle.heightRatio * 100).toFixed(1)}%
                          </div>
                          <div className="text-stone-500">
                            字体: {(subtitleStyle.fontSizeRatio * 100).toFixed(1)}%
                          </div>
                          <div className="text-stone-500">
                            轮廓: {(subtitleStyle.outlineRatio * 1000).toFixed(1)}‰
                          </div>
                        </div>
                        
                        {/* 右下角：导出像素值 */}
                        <div>
                          <div className="font-medium text-stone-600 mb-1">导出像素值</div>
                          <div className="text-stone-500">
                            高度: {imageNaturalSize.height > 0 ? Math.round(imageNaturalSize.height * subtitleStyle.heightRatio) : 0}px
                          </div>
                          <div className="text-stone-500">
                            字体: {imageNaturalSize.height > 0 ? Math.round(imageNaturalSize.height * subtitleStyle.fontSizeRatio) : 0}px
                          </div>
                          <div className="text-stone-500">
                            轮廓: {imageNaturalSize.height > 0 ? Math.round(imageNaturalSize.height * subtitleStyle.outlineRatio) : 0}px
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* 右侧控制面板 - 边框设置+保存下载 */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4">
            {/* 边框设置 */}
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 px-3">
                <CardTitle className="flex items-center gap-2 text-stone-700 text-sm">
                  <Settings className="w-4 h-4" />
                  边框设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-3 pb-3">
                {/* 启用边框开关 */}
                <div className="flex items-center justify-between">
                  <Label className="text-stone-600">启用边框</Label>
                  <button
                    onClick={() => setBorderStyle(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      borderStyle.enabled ? 'bg-stone-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        borderStyle.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {borderStyle.enabled && (
                  <>
                    {/* 预设样式选择器 */}
                    <div className="space-y-2">
                      <Label className="text-stone-600">预设样式</Label>
                      <Select
                        value={borderStyle.preset}
                        onValueChange={(value: 'none' | 'simple') => {
                          setBorderStyle(prev => {
                            const newStyle = { ...prev, preset: value }
                            
                            // 根据预设样式设置默认值
                            switch (value) {
                              case 'simple':
                                return {
                                  ...newStyle,
                                  color: '#000000',
                                  width: 2,
                                  style: 'solid'
                                }
                              default:
                                return newStyle
                            }
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">自定义</SelectItem>
                          <SelectItem value="simple">简单边框</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 自定义选项 - 仅在选择自定义时显示 */}
                    {borderStyle.preset === 'none' && (
                      <>
                        {/* 边框颜色 */}
                        <div className="space-y-2">
                          <Label className="text-stone-600">边框颜色</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={borderStyle.color}
                              onChange={(e) => setBorderStyle(prev => ({ ...prev, color: e.target.value }))}
                              className="w-10 h-8 rounded border border-stone-300 flex-shrink-0"
                            />
                            <Input
                              value={borderStyle.color}
                              onChange={(e) => setBorderStyle(prev => ({ ...prev, color: e.target.value }))}
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* 边框宽度 */}
                        <div className="space-y-2">
                          <Label className="text-stone-600">边框宽度</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[borderStyle.width]}
                              onValueChange={(value) => setBorderStyle(prev => ({ ...prev, width: value[0] }))}
                              max={40}
                              min={1}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-sm text-stone-500 w-12">{borderStyle.width}px</span>
                          </div>
                        </div>

                        {/* 边框样式 */}
                        <div className="space-y-2">
                          <Label className="text-stone-600">边框样式</Label>
                          <Select
                            value={borderStyle.style}
                            onValueChange={(value: 'solid' | 'dashed' | 'dotted') => setBorderStyle(prev => ({ ...prev, style: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">实线</SelectItem>
                              <SelectItem value="dashed">虚线</SelectItem>
                              <SelectItem value="dotted">点线</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card className="border-stone-200 shadow-sm">
              <CardContent className="pt-4 px-3 pb-3">
                <div className="space-y-2">
                  <Button
                    onClick={handleRemoveWatermark}
                    className="bg-red-600 hover:bg-red-700 w-full text-white text-xs px-2 py-2 h-auto"
                    disabled={isLoading}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    {removeWatermarkCount > 0 ? `去水印 (${removeWatermarkCount})` : '去水印 (已用完)'}
                  </Button>
                  <Button
                    onClick={() => saveImage(true)}
                    variant="outline"
                    className="border-stone-300 hover:bg-stone-50 w-full text-black text-xs px-2 py-2 h-auto"
                    disabled={isLoading}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {isLoading ? '保存中...' : '保存图片'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 隐藏的Canvas用于图片保存 */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Toast通知 */}
      <Toaster />
      
      {/* Footer版权信息 */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-stone-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-stone-500">
            © 2025 Avis. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App