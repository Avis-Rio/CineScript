# 图片字幕生成器 - 产品需求文档 (PRD)

## 1. 产品概述

**图片字幕生成器**是一个现代化的Web应用，采用React + shadcn/ui技术栈重构，提供优雅的莫兰迪配色界面。用户可以上传图片或获取随机图片，添加多行字幕，调整字幕样式，并保存生成的图像。

### 1.1 产品目标

- 提供一个现代化、直观的工具，使用户能够快速为图片添加字幕
- 支持自定义字幕的各种样式属性
- 为用户提供实时预览功能
- 提供多种方式获取图片素材
- 优化用户体验和界面美观度

### 1.2 目标用户

- 社交媒体内容创作者
- 需要制作表情包的普通用户
- 需要制作简单图文组合的营销人员
- 教育工作者和学生

## 2. 技术架构升级

### 2.1 技术栈
- **前端框架**: React 18 + TypeScript
- **UI组件库**: shadcn/ui
- **样式方案**: Tailwind CSS
- **构建工具**: Vite
- **图片处理**: HTML5 Canvas API
- **状态管理**: React Hooks

### 2.2 设计系统
- **配色方案**: 莫兰迪配色（温暖米色背景 + 灰绿色主色调）
- **组件设计**: 统一的圆角卡片和柔和阴影
- **交互效果**: 平滑过渡动画和悬停效果
- **响应式**: 移动端和桌面端自适应布局

## 3. 功能规格

### 3.1 基本功能

#### 3.1.1 图片管理
- ✅ 用户可以从本地设备上传图片
- ✅ 提供多源随机图片功能（Picsum、Unsplash、Lorem Flickr）
- ✅ 智能降级策略，网络失败时生成占位图片
- ✅ 支持在预览区域显示图片

#### 3.1.2 字幕编辑
- ✅ 用户可以添加多行字幕文本
- ✅ 字幕显示在图片底部
- ✅ 每行字幕自动添加半透明背景，提高可读性
- ✅ 字幕行之间使用细分割线分隔，无间隙

#### 3.1.3 字幕样式调整
- ✅ 支持调整字幕高度（滑块控制）
- ✅ 支持调整字体大小（滑块控制）
- ✅ 支持更改字体颜色（颜色选择器 + 十六进制输入）
- ✅ 支持更改字体轮廓颜色（颜色选择器 + 十六进制输入）
- ✅ 支持选择不同字体类型（下拉选择）
- ✅ 支持选择字体粗细（下拉选择）

#### 3.1.4 实时预览
- ✅ 样式调整实时更新在预览区域
- ✅ 字幕样式变化实时反映
- ✅ 水印实时显示

#### 3.1.5 保存功能
- ✅ 用户可以将生成的图片保存到本地设备
- ✅ 导出格式为JPG，高质量
- ✅ 导出图片包含所有字幕和水印
- ✅ 增强的跨域处理和错误恢复

### 3.2 UI设计规范

#### 3.2.1 整体布局
- ✅ 左侧控制面板，右侧预览区域
- ✅ 水平布局，适合桌面设备
- ✅ 在移动设备上自动切换为垂直布局

#### 3.2.2 莫兰迪配色方案
- ✅ 主色: #A6B1A9（灰绿色）
- ✅ 次要色: #B7A99A（暖灰色）
- ✅ 背景色: #F1F0EB（浅米色）
- ✅ 文字色: #3F4E4F（深灰绿色）
- ✅ 轻文字色: #647476（灰蓝色）

#### 3.2.3 现代化组件设计
- ✅ 卡片式布局，统一圆角和阴影
- ✅ 滑块控制器替代数字输入
- ✅ 现代化颜色选择器
- ✅ 优雅的按钮悬停效果
- ✅ Toast通知系统

## 4. 用户界面

### 4.1 界面组件

#### 4.1.1 顶部导航栏
- ✅ 应用标题和品牌标识
- ✅ 访问计数器显示
- ✅ 半透明背景和模糊效果

#### 4.1.2 左侧控制面板
- ✅ **图片管理区域**
  - 文件上传按钮
  - 随机图片按钮
  - 上传状态显示

- ✅ **字幕样式控制区域**
  - 字幕高度滑块调节
  - 字体大小滑块调节
  - 字体颜色选择器（颜色选择器 + 十六进制输入）
  - 轮廓颜色选择器（颜色选择器 + 十六进制输入）
  - 字体样式下拉选择
  - 字体粗细下拉选择

- ✅ **字幕内容区域**
  - 多行文本输入框
  - 每行文本将作为单独的字幕行

- ✅ **操作按钮区域**
  - 生成字幕图片按钮
  - 保存图片按钮

#### 4.1.3 右侧预览区域
- ✅ 显示当前图片及字幕效果
- ✅ 实时更新样式变化
- ✅ 适应容器大小，保持图片比例
- ✅ 水印显示

## 5. 技术实现亮点

### 5.1 图片加载优化
- ✅ 多源图片加载策略（Picsum → Unsplash → Lorem Flickr）
- ✅ 智能超时处理和错误恢复
- ✅ 本地占位图生成作为最终备选
- ✅ 跨域问题的完善处理

### 5.2 Canvas渲染增强
- ✅ 异步图片处理和错误处理
- ✅ 跨域图片的安全绘制
- ✅ 高质量图片导出（JPEG 92%质量）
- ✅ 水印和字幕的精确渲染

### 5.3 用户体验优化
- ✅ Toast通知系统提供即时反馈
- ✅ 加载状态指示和进度提示
- ✅ 平滑的动画过渡效果
- ✅ 响应式设计适配各种设备

## 6. 项目状态

### 6.1 已完成功能 ✅
- [x] React项目架构搭建
- [x] 莫兰迪配色UI设计实现
- [x] 图片上传功能
- [x] 多源随机图片加载
- [x] 字幕样式控制界面
- [x] 实时预览功能
- [x] Canvas图片保存功能
- [x] 跨域问题修复
- [x] 错误处理和用户反馈

### 6.2 当前进行中 🔄
- [ ] 最终功能测试和优化
- [ ] 响应式设计细节调整
- [ ] 性能优化

### 6.3 待完成功能 📋
- [ ] 移动端交互优化
- [ ] 更多字体选项
- [ ] 字幕位置自定义
- [ ] 批量处理功能

## 7. 更新日志

### v2.0 - React重构版本 (当前版本)
- 🎨 采用React + shadcn/ui重构整个应用
- 🎨 实现莫兰迪配色的现代化UI设计
- 🔧 优化图片加载策略，支持多源降级
- 🔧 增强Canvas渲染和跨域处理
- 🔧 添加Toast通知系统
- 🔧 实现响应式布局设计
- 🔧 优化用户交互体验
- 🐛 **修复字幕条边框空隙问题** (2024-12)
  - **问题描述**: 字幕条在边框宽度增加时出现与边框宽度相等的镜像空隙
  - **根本原因**: 字幕容器定位逻辑错误，left属性错误地加上边框偏移，width属性错误地减去边框宽度
  - **修复方案**: 调整字幕容器的left属性为`${displayRect.x}px`，width属性为`${displayRect.width}px`，bottom属性为`0px`
  - **修复结果**: 实现字幕条与图片边缘完美对齐，确保"所见即所得"的预览效果

### v1.3 - 原版本
- 基础HTML/CSS/JavaScript实现
- 基本的图片字幕功能
- 简单的样式控制

## 8. 部署和访问

### 8.1 开发环境
- 本地开发服务器: http://localhost:5173/
- 热重载和实时预览支持

### 8.2 技术要求
- Node.js 16+
- 现代浏览器支持（Chrome、Firefox、Safari、Edge）
- 网络连接（用于随机图片功能）

## 9. 未来规划

### 9.1 短期计划
- 完善移动端体验
- 添加更多图片滤镜
- 支持字幕动画效果

### 9.2 长期计划
- 云端图片存储集成
- 用户账户和模板保存
- 批量处理和API接口
- 多语言支持

---

**项目状态**: 🚀 React重构版本开发中，核心功能已完成，正在进行最终优化和测试。

---

## Background and Motivation
- 用户反馈：下载图片中的字幕相对图片比例与预览不一致，影响使用体验与可控性。
- 背景：预览以CSS像素显示，导出以原始像素绘制，导致同一参数在两种坐标系下结果不同。
- 目标：保证“预览所见即下载所得”，同一输入在不同图片与窗口尺寸下保持稳定一致。

## Key Challenges and Analysis
- 坐标系不一致：预览=显示像素（受容器与max-h限制）；导出=原始像素（canvas=natural尺寸）。
- object-contain 带来的可视矩形计算：显示矩形需由容器尺寸与natural尺寸共同决定。
- 预览描边(text-shadow)与导出描边(strokeText)在观感上存在差异，需要以“相对字号”的粗细统一。
- 多行自下而上堆叠的Y坐标需要基于“高度比例”统一计算，避免位移差。

## High-Level Task Breakdown

### 技术实施详细规格

#### 第一阶段：状态结构重构
1. **扩展SubtitleStyle接口**
   - 文件路径：`/Users/Avis/AI Vibe Coding/image caption generator/react-app/image-caption-generator/src/App.tsx`
   - 在SubtitleStyle接口中添加比例化参数：
     - `heightRatio: number` (默认值: 40/600 ≈ 0.0667)
     - `fontSizeRatio: number` (默认值: 20/600 ≈ 0.0333)
     - `outlineRatio: number` (默认值: 0.1)
   - 保留原有height和fontSize作为显示用途

2. **添加图片尺寸状态管理**
   - 新增状态：`imageRect: { width: number, height: number, offsetX: number, offsetY: number } | null`
   - 新增状态：`containerSize: { width: number, height: number }`
   - 新增ref：`containerRef = useRef<HTMLDivElement>(null)`

#### 第二阶段：显示矩形计算核心函数
3. **实现getRenderedImageRect函数**
   - 函数名：`getRenderedImageRect`
   - 参数：`(img: HTMLImageElement, containerWidth: number, containerHeight: number)`
   - 返回：`{ width: number, height: number, offsetX: number, offsetY: number }`
   - 逻辑：基于object-contain算法计算实际显示矩形
   - 公式：
     ```
     const imgAspect = img.naturalWidth / img.naturalHeight
     const containerAspect = containerWidth / containerHeight
     if (imgAspect > containerAspect) {
       // 图片更宽，以容器宽度为准
       displayWidth = containerWidth
       displayHeight = containerWidth / imgAspect
     } else {
       // 图片更高，以容器高度为准
       displayHeight = containerHeight
       displayWidth = containerHeight * imgAspect
     }
     offsetX = (containerWidth - displayWidth) / 2
     offsetY = (containerHeight - displayHeight) / 2
     ```

#### 第三阶段：响应式监听系统
4. **实现ResizeObserver监听**
   - 在useEffect中设置ResizeObserver监听containerRef
   - 监听函数：`updateImageRect`
   - 触发条件：容器尺寸变化、图片加载完成

5. **实现图片加载监听**
   - 在imageRef的onLoad事件中调用updateImageRect
   - 确保图片naturalWidth/Height可用后再计算

#### 第四阶段：预览层重构
6. **重构预览区域HTML结构**
   - 外层容器：`<div ref={containerRef} className="relative bg-stone-100 rounded-lg overflow-hidden">`
   - 图片层：`<img ref={imageRef} className="w-full h-auto max-h-[600px] object-contain">`
   - 字幕覆盖层：`<div className="absolute" style={{...计算位置}}>`

7. **实现字幕覆盖层定位**
   - 覆盖层样式：
     ```
     style={{
       left: `${imageRect.offsetX}px`,
       top: `${imageRect.offsetY}px`,
       width: `${imageRect.width}px`,
       height: `${imageRect.height}px`
     }}
     ```

#### 第五阶段：滑块控制逻辑
8. **修改滑块显示逻辑**
   - 字幕高度滑块：显示值 = `heightRatio * (imageRect?.height || 600)`
   - 字体大小滑块：显示值 = `fontSizeRatio * (imageRect?.height || 600)`
   - 范围限制：最小10px，最大容器高度的20%

9. **修改滑块回调逻辑**
   - onValueChange回调：将像素值转换回比例
   - 字幕高度：`heightRatio = pixelValue / (imageRect?.height || 600)`
   - 字体大小：`fontSizeRatio = pixelValue / (imageRect?.height || 600)`

#### 第六阶段：预览渲染优化
10. **优化预览字幕样式计算**
    - 字幕高度：`heightRatio * (imageRect?.height || 600)`
    - 字体大小：`fontSizeRatio * (imageRect?.height || 600)`
    - 轮廓粗细：`Math.max(1, Math.round(fontSize * outlineRatio))`
    - text-shadow：`${outlineWidth}px ${outlineWidth}px ${outlineWidth}px ${outlineColor}`

#### 第七阶段：导出逻辑统一
11. **修改saveImage函数中的Canvas渲染**
    - 字幕高度：`heightRatio * canvas.height`
    - 字体大小：`fontSizeRatio * canvas.height`
    - 轮廓粗细：`ctx.lineWidth = Math.round(fontSize * outlineRatio)`
    - Y坐标计算：`y = canvas.height - subtitleHeight * (index + 1)`

#### 第八阶段：测试与验证
12. **实现测试验证机制**
    - 添加调试信息显示组件
    - 显示当前比例值、像素值、imageRect信息
    - 添加测试用例：横图(16:9)、竖图(9:16)、方图(1:1)
    - 验证标准：预览与导出比例误差≤1%

---

## IMPLEMENTATION CHECKLIST:

1. 在App.tsx中扩展SubtitleStyle接口，添加heightRatio、fontSizeRatio、outlineRatio三个number类型属性
2. 在App.tsx中添加imageRect状态：useState<{width: number, height: number, offsetX: number, offsetY: number} | null>(null)
3. 在App.tsx中添加containerSize状态：useState<{width: number, height: number}>({width: 0, height: 0})
4. 在App.tsx中添加containerRef：useRef<HTMLDivElement>(null)
5. 在App.tsx中实现getRenderedImageRect函数，参数为(img: HTMLImageElement, containerWidth: number, containerHeight: number)
6. 在getRenderedImageRect函数中实现object-contain算法计算显示矩形
7. 在App.tsx中添加updateImageRect函数，调用getRenderedImageRect并更新imageRect状态
8. 在App.tsx中添加useEffect设置ResizeObserver监听containerRef尺寸变化
9. 在imageRef的onLoad事件中调用updateImageRect函数
10. 修改预览区域HTML结构，为外层容器添加containerRef
11. 在预览区域添加字幕覆盖层，使用absolute定位到imageRect位置
12. 修改字幕高度滑块的显示逻辑，显示值为heightRatio * (imageRect?.height || 600)
13. 修改字体大小滑块的显示逻辑，显示值为fontSizeRatio * (imageRect?.height || 600)
14. 修改字幕高度滑块的onValueChange回调，将像素值转换为heightRatio
15. 修改字体大小滑块的onValueChange回调，将像素值转换为fontSizeRatio
16. 修改预览字幕样式计算，使用比例化参数计算实际像素值
17. 修改预览text-shadow计算，使用Math.max(1, Math.round(fontSize * outlineRatio))
18. 修改saveImage函数中的字幕高度计算，使用heightRatio * canvas.height
19. 修改saveImage函数中的字体大小计算，使用fontSizeRatio * canvas.height
20. 修改saveImage函数中的轮廓粗细计算，使用Math.round(fontSize * outlineRatio)
21. 修改saveImage函数中的Y坐标计算，统一使用比例化高度
22. 添加调试信息显示组件，显示当前比例值和imageRect信息
23. 进行横图、竖图、方图三种纵横比测试
24. 进行多窗口尺寸变化测试
25. 验证预览与导出比例误差是否≤1%
26. 更新PRD文档记录实施结果和经验总结

## Success Criteria
- 同一输入在预览与导出中，字幕块高度与字号相对图片高度占比误差≤1%。
- 轮廓粗细与字体大小的相对关系一致；视觉差异可接受，粗细误差≤1px。
- 在改变窗口尺寸后，预览比例稳定；对任意分辨率图片导出后保持一致比例。

## Project Status Kanban

### 已完成 ✅
- [x] 问题分析与成因定位
- [x] 方案设计与详细技术规格制定
- [x] 12步实施清单创建
- [🔄] **Git推送优化中**: 项目推送到 https://github.com/Avis-Rio/CineScript
  - 当前状态: 本地分支领先远程分支9个提交
  - 优化措施: 已移除node_modules目录，仓库大小从47MB减少到44MB
  - 推送进度: 对象压缩完成 (10891/10891)，正在网络传输中
  - 包含提交: 
    - 最新提交: 移除node_modules目录以减少仓库大小
    - 8cec40f5 (合并远程更改并解决README.md冲突)
    - f5fe772d (更新项目文档和功能优化)
    - 8f46bf2d (修复字幕条边框空隙问题)
  - 优化效果: 减少3MB数据传输，提升推送速度
# 图片字幕生成器 - 产品需求文档 (PRD)

## 1. 产品概述

**图片字幕生成器**是一个现代化的Web应用，采用React + shadcn/ui技术栈重构，提供优雅的莫兰迪配色界面。用户可以上传图片或获取随机图片，添加多行字幕，调整字幕样式，并保存生成的图像。

### 1.1 产品目标

- 提供一个现代化、直观的工具，使用户能够快速为图片添加字幕
- 支持自定义字幕的各种样式属性
- 为用户提供实时预览功能
- 提供多种方式获取图片素材
- 优化用户体验和界面美观度

### 1.2 目标用户

- 社交媒体内容创作者
- 需要制作表情包的普通用户
- 需要制作简单图文组合的营销人员
- 教育工作者和学生

## 2. 技术架构升级

### 2.1 技术栈
- **前端框架**: React 18 + TypeScript
- **UI组件库**: shadcn/ui
- **样式方案**: Tailwind CSS
- **构建工具**: Vite
- **图片处理**: HTML5 Canvas API
- **状态管理**: React Hooks

### 2.2 设计系统
- **配色方案**: 莫兰迪配色（温暖米色背景 + 灰绿色主色调）
- **组件设计**: 统一的圆角卡片和柔和阴影
- **交互效果**: 平滑过渡动画和悬停效果
- **响应式**: 移动端和桌面端自适应布局

## 3. 功能规格

### 3.1 基本功能

#### 3.1.1 图片管理
- ✅ 用户可以从本地设备上传图片
- ✅ 提供多源随机图片功能（Picsum、Unsplash、Lorem Flickr）
- ✅ 智能降级策略，网络失败时生成占位图片
- ✅ 支持在预览区域显示图片

#### 3.1.2 字幕编辑
- ✅ 用户可以添加多行字幕文本
- ✅ 字幕显示在图片底部
- ✅ 每行字幕自动添加半透明背景，提高可读性
- ✅ 字幕行之间使用细分割线分隔，无间隙

#### 3.1.3 字幕样式调整
- ✅ 支持调整字幕高度（滑块控制）
- ✅ 支持调整字体大小（滑块控制）
- ✅ 支持更改字体颜色（颜色选择器 + 十六进制输入）
- ✅ 支持更改字体轮廓颜色（颜色选择器 + 十六进制输入）
- ✅ 支持选择不同字体类型（下拉选择）
- ✅ 支持选择字体粗细（下拉选择）

#### 3.1.4 实时预览
- ✅ 样式调整实时更新在预览区域
- ✅ 字幕样式变化实时反映
- ✅ 水印实时显示

#### 3.1.5 保存功能
- ✅ 用户可以将生成的图片保存到本地设备
- ✅ 导出格式为JPG，高质量
- ✅ 导出图片包含所有字幕和水印
- ✅ 增强的跨域处理和错误恢复

### 3.2 UI设计规范

#### 3.2.1 整体布局
- ✅ 左侧控制面板，右侧预览区域
- ✅ 水平布局，适合桌面设备
- ✅ 在移动设备上自动切换为垂直布局

#### 3.2.2 莫兰迪配色方案
- ✅ 主色: #A6B1A9（灰绿色）
- ✅ 次要色: #B7A99A（暖灰色）
- ✅ 背景色: #F1F0EB（浅米色）
- ✅ 文字色: #3F4E4F（深灰绿色）
- ✅ 轻文字色: #647476（灰蓝色）

#### 3.2.3 现代化组件设计
- ✅ 卡片式布局，统一圆角和阴影
- ✅ 滑块控制器替代数字输入
- ✅ 现代化颜色选择器
- ✅ 优雅的按钮悬停效果
- ✅ Toast通知系统

## 4. 用户界面

### 4.1 界面组件

#### 4.1.1 顶部导航栏
- ✅ 应用标题和品牌标识
- ✅ 访问计数器显示
- ✅ 半透明背景和模糊效果

#### 4.1.2 左侧控制面板
- ✅ **图片管理区域**
  - 文件上传按钮
  - 随机图片按钮
  - 上传状态显示

- ✅ **字幕样式控制区域**
  - 字幕高度滑块调节
  - 字体大小滑块调节
  - 字体颜色选择器（颜色选择器 + 十六进制输入）
  - 轮廓颜色选择器（颜色选择器 + 十六进制输入）
  - 字体样式下拉选择
  - 字体粗细下拉选择

- ✅ **字幕内容区域**
  - 多行文本输入框
  - 每行文本将作为单独的字幕行

- ✅ **操作按钮区域**
  - 生成字幕图片按钮
  - 保存图片按钮

#### 4.1.3 右侧预览区域
- ✅ 显示当前图片及字幕效果
- ✅ 实时更新样式变化
- ✅ 适应容器大小，保持图片比例
- ✅ 水印显示

## 5. 技术实现亮点

### 5.1 图片加载优化
- ✅ 多源图片加载策略（Picsum → Unsplash → Lorem Flickr）
- ✅ 智能超时处理和错误恢复
- ✅ 本地占位图生成作为最终备选
- ✅ 跨域问题的完善处理

### 5.2 Canvas渲染增强
- ✅ 异步图片处理和错误处理
- ✅ 跨域图片的安全绘制
- ✅ 高质量图片导出（JPEG 92%质量）
- ✅ 水印和字幕的精确渲染

### 5.3 用户体验优化
- ✅ Toast通知系统提供即时反馈
- ✅ 加载状态指示和进度提示
- ✅ 平滑的动画过渡效果
- ✅ 响应式设计适配各种设备

## 6. 项目状态

### 6.1 已完成功能 ✅
- [x] React项目架构搭建
- [x] 莫兰迪配色UI设计实现
- [x] 图片上传功能
- [x] 多源随机图片加载
- [x] 字幕样式控制界面
- [x] 实时预览功能
- [x] Canvas图片保存功能
- [x] 跨域问题修复
- [x] 错误处理和用户反馈

### 6.2 当前进行中 🔄
- [ ] 最终功能测试和优化
- [ ] 响应式设计细节调整
- [ ] 性能优化

### 6.3 待完成功能 📋
- [ ] 移动端交互优化
- [ ] 更多字体选项
- [ ] 字幕位置自定义
- [ ] 批量处理功能

## 7. 更新日志

### v2.0 - React重构版本 (当前版本)
- 🎨 采用React + shadcn/ui重构整个应用
- 🎨 实现莫兰迪配色的现代化UI设计
- 🔧 优化图片加载策略，支持多源降级
- 🔧 增强Canvas渲染和跨域处理
- 🔧 添加Toast通知系统
- 🔧 实现响应式布局设计
- 🔧 优化用户交互体验
- 🐛 **修复字幕条边框空隙问题** (2024-12)
  - **问题描述**: 字幕条在边框宽度增加时出现与边框宽度相等的镜像空隙
  - **根本原因**: 字幕容器定位逻辑错误，left属性错误地加上边框偏移，width属性错误地减去边框宽度
  - **修复方案**: 调整字幕容器的left属性为`${displayRect.x}px`，width属性为`${displayRect.width}px`，bottom属性为`0px`
  - **修复结果**: 实现字幕条与图片边缘完美对齐，确保"所见即所得"的预览效果

### v1.3 - 原版本
- 基础HTML/CSS/JavaScript实现
- 基本的图片字幕功能
- 简单的样式控制

## 8. 部署和访问

### 8.1 开发环境
- 本地开发服务器: http://localhost:5173/
- 热重载和实时预览支持

### 8.2 技术要求
- Node.js 16+
- 现代浏览器支持（Chrome、Firefox、Safari、Edge）
- 网络连接（用于随机图片功能）

## 9. 未来规划

### 9.1 短期计划
- 完善移动端体验
- 添加更多图片滤镜
- 支持字幕动画效果

### 9.2 长期计划
- 云端图片存储集成
- 用户账户和模板保存
- 批量处理和API接口
- 多语言支持

---

**项目状态**: 🚀 React重构版本开发中，核心功能已完成，正在进行最终优化和测试。

---

## Background and Motivation
- 用户反馈：下载图片中的字幕相对图片比例与预览不一致，影响使用体验与可控性。
- 背景：预览以CSS像素显示，导出以原始像素绘制，导致同一参数在两种坐标系下结果不同。
- 目标：保证“预览所见即下载所得”，同一输入在不同图片与窗口尺寸下保持稳定一致。

## Key Challenges and Analysis
- 坐标系不一致：预览=显示像素（受容器与max-h限制）；导出=原始像素（canvas=natural尺寸）。
- object-contain 带来的可视矩形计算：显示矩形需由容器尺寸与natural尺寸共同决定。
- 预览描边(text-shadow)与导出描边(strokeText)在观感上存在差异，需要以“相对字号”的粗细统一。
- 多行自下而上堆叠的Y坐标需要基于“高度比例”统一计算，避免位移差。

## High-Level Task Breakdown

### 技术实施详细规格

#### 第一阶段：状态结构重构
1. **扩展SubtitleStyle接口**
   - 文件路径：`/Users/Avis/AI Vibe Coding/image caption generator/react-app/image-caption-generator/src/App.tsx`
   - 在SubtitleStyle接口中添加比例化参数：
     - `heightRatio: number` (默认值: 40/600 ≈ 0.0667)
     - `fontSizeRatio: number` (默认值: 20/600 ≈ 0.0333)
     - `outlineRatio: number` (默认值: 0.1)
   - 保留原有height和fontSize作为显示用途

2. **添加图片尺寸状态管理**
   - 新增状态：`imageRect: { width: number, height: number, offsetX: number, offsetY: number } | null`
   - 新增状态：`containerSize: { width: number, height: number }`
   - 新增ref：`containerRef = useRef<HTMLDivElement>(null)`

#### 第二阶段：显示矩形计算核心函数
3. **实现getRenderedImageRect函数**
   - 函数名：`getRenderedImageRect`
   - 参数：`(img: HTMLImageElement, containerWidth: number, containerHeight: number)`
   - 返回：`{ width: number, height: number, offsetX: number, offsetY: number }`
   - 逻辑：基于object-contain算法计算实际显示矩形
   - 公式：
     ```
     const imgAspect = img.naturalWidth / img.naturalHeight
     const containerAspect = containerWidth / containerHeight
     if (imgAspect > containerAspect) {
       // 图片更宽，以容器宽度为准
       displayWidth = containerWidth
       displayHeight = containerWidth / imgAspect
     } else {
       // 图片更高，以容器高度为准
       displayHeight = containerHeight
       displayWidth = containerHeight * imgAspect
     }
     offsetX = (containerWidth - displayWidth) / 2
     offsetY = (containerHeight - displayHeight) / 2
     ```

#### 第三阶段：响应式监听系统
4. **实现ResizeObserver监听**
   - 在useEffect中设置ResizeObserver监听containerRef
   - 监听函数：`updateImageRect`
   - 触发条件：容器尺寸变化、图片加载完成

5. **实现图片加载监听**
   - 在imageRef的onLoad事件中调用updateImageRect
   - 确保图片naturalWidth/Height可用后再计算

#### 第四阶段：预览层重构
6. **重构预览区域HTML结构**
   - 外层容器：`<div ref={containerRef} className="relative bg-stone-100 rounded-lg overflow-hidden">`
   - 图片层：`<img ref={imageRef} className="w-full h-auto max-h-[600px] object-contain">`
   - 字幕覆盖层：`<div className="absolute" style={{...计算位置}}>`

7. **实现字幕覆盖层定位**
   - 覆盖层样式：
     ```
     style={{
       left: `${imageRect.offsetX}px`,
       top: `${imageRect.offsetY}px`,
       width: `${imageRect.width}px`,
       height: `${imageRect.height}px`
     }}
     ```

#### 第五阶段：滑块控制逻辑
8. **修改滑块显示逻辑**
   - 字幕高度滑块：显示值 = `heightRatio * (imageRect?.height || 600)`
   - 字体大小滑块：显示值 = `fontSizeRatio * (imageRect?.height || 600)`
   - 范围限制：最小10px，最大容器高度的20%

9. **修改滑块回调逻辑**
   - onValueChange回调：将像素值转换回比例
   - 字幕高度：`heightRatio = pixelValue / (imageRect?.height || 600)`
   - 字体大小：`fontSizeRatio = pixelValue / (imageRect?.height || 600)`

#### 第六阶段：预览渲染优化
10. **优化预览字幕样式计算**
    - 字幕高度：`heightRatio * (imageRect?.height || 600)`
    - 字体大小：`fontSizeRatio * (imageRect?.height || 600)`
    - 轮廓粗细：`Math.max(1, Math.round(fontSize * outlineRatio))`
    - text-shadow：`${outlineWidth}px ${outlineWidth}px ${outlineWidth}px ${outlineColor}`

#### 第七阶段：导出逻辑统一
11. **修改saveImage函数中的Canvas渲染**
    - 字幕高度：`heightRatio * canvas.height`
    - 字体大小：`fontSizeRatio * canvas.height`
    - 轮廓粗细：`ctx.lineWidth = Math.round(fontSize * outlineRatio)`
    - Y坐标计算：`y = canvas.height - subtitleHeight * (index + 1)`

#### 第八阶段：测试与验证
12. **实现测试验证机制**
    - 添加调试信息显示组件
    - 显示当前比例值、像素值、imageRect信息
    - 添加测试用例：横图(16:9)、竖图(9:16)、方图(1:1)
    - 验证标准：预览与导出比例误差≤1%

---

## IMPLEMENTATION CHECKLIST:

1. 在App.tsx中扩展SubtitleStyle接口，添加heightRatio、fontSizeRatio、outlineRatio三个number类型属性
2. 在App.tsx中添加imageRect状态：useState<{width: number, height: number, offsetX: number, offsetY: number} | null>(null)
3. 在App.tsx中添加containerSize状态：useState<{width: number, height: number}>({width: 0, height: 0})
4. 在App.tsx中添加containerRef：useRef<HTMLDivElement>(null)
5. 在App.tsx中实现getRenderedImageRect函数，参数为(img: HTMLImageElement, containerWidth: number, containerHeight: number)
6. 在getRenderedImageRect函数中实现object-contain算法计算显示矩形
7. 在App.tsx中添加updateImageRect函数，调用getRenderedImageRect并更新imageRect状态
8. 在App.tsx中添加useEffect设置ResizeObserver监听containerRef尺寸变化
9. 在imageRef的onLoad事件中调用updateImageRect函数
10. 修改预览区域HTML结构，为外层容器添加containerRef
11. 在预览区域添加字幕覆盖层，使用absolute定位到imageRect位置
12. 修改字幕高度滑块的显示逻辑，显示值为heightRatio * (imageRect?.height || 600)
13. 修改字体大小滑块的显示逻辑，显示值为fontSizeRatio * (imageRect?.height || 600)
14. 修改字幕高度滑块的onValueChange回调，将像素值转换为heightRatio
15. 修改字体大小滑块的onValueChange回调，将像素值转换为fontSizeRatio
16. 修改预览字幕样式计算，使用比例化参数计算实际像素值
17. 修改预览text-shadow计算，使用Math.max(1, Math.round(fontSize * outlineRatio))
18. 修改saveImage函数中的字幕高度计算，使用heightRatio * canvas.height
19. 修改saveImage函数中的字体大小计算，使用fontSizeRatio * canvas.height
20. 修改saveImage函数中的轮廓粗细计算，使用Math.round(fontSize * outlineRatio)
21. 修改saveImage函数中的Y坐标计算，统一使用比例化高度
22. 添加调试信息显示组件，显示当前比例值和imageRect信息
23. 进行横图、竖图、方图三种纵横比测试
24. 进行多窗口尺寸变化测试
25. 验证预览与导出比例误差是否≤1%
26. 更新PRD文档记录实施结果和经验总结

## Success Criteria
- 同一输入在预览与导出中，字幕块高度与字号相对图片高度占比误差≤1%。
- 轮廓粗细与字体大小的相对关系一致；视觉差异可接受，粗细误差≤1px。
- 在改变窗口尺寸后，预览比例稳定；对任意分辨率图片导出后保持一致比例。


### 待执行 📋
- [x] **阶段1**: 状态结构重构
  - [x] 扩展SubtitleStyle接口添加比例化参数
  - [x] 添加imageRect和containerSize状态
  - [x] 添加containerRef引用
- [x] **阶段2**: 显示矩形计算核心函数
  - [x] 实现getRenderedImageRect函数
  - [x] 实现object-contain算法
- [x] **阶段3**: 响应式监听系统
  - [x] 实现ResizeObserver监听
  - [x] 实现图片加载监听
- [x] **阶段4**: 预览层重构
  - [x] 重构预览区域HTML结构
  - [x] 实现字幕覆盖层定位
- [x] **阶段5**: 滑块控制逻辑
  - [x] 修改滑块显示逻辑
  - [x] 修改滑块回调逻辑
- [x] **阶段6**: 预览渲染优化
  - [x] 优化预览字幕样式计算
- [x] **阶段7**: 导出逻辑统一
  - [x] 修改saveImage函数中的Canvas渲染
- [x] **阶段8**: 测试与验证
  - [x] 实现测试验证机制
  - [ ] 三类纵横比测试
  - [ ] 多窗口尺寸测试
  - [ ] 验收：对比误差≤1%
  - [x] 文档：补充变更日志与经验沉淀
  - [x] **字幕条边框空隙问题修复**: 已完成字幕容器定位逻辑修复，实现所见即所得效果

## Executor Feedback or Request for Help

### 当前状态 📊
- ✅ **PLAN MODE 已完成**: 详细技术规格和12步实施清单已制定
- ✅ **技术方案确认**: 比例化参数系统、显示矩形计算、ResizeObserver监听等核心架构已设计
- ✅ **实施路径明确**: 8个阶段的具体代码修改点、函数名称、参数定义已详细规划

### 等待用户授权 ⏳
- [ ] **需要明确授权**: 请发送 "ENTER EXECUTE MODE" 指令开始代码实施
- [ ] **配置确认**: 是否保留预览区域 max-h:600px 限制？（默认保留）
- [ ] **测试环境**: 是否需要在实施过程中保持开发服务器运行以便实时测试？

### 技术实施准备就绪 🚀
- ✅ 目标文件已确认: `/Users/Avis/AI Vibe Coding/image caption generator/react-app/image-caption-generator/src/App.tsx`
- ✅ 接口扩展方案已定义: SubtitleStyle + 新增比例化参数
- ✅ 核心算法已设计: getRenderedImageRect函数 + object-contain计算
- ✅ 监听机制已规划: ResizeObserver + 图片加载事件
- ✅ 验收标准已明确: 预览与导出比例误差≤1%

## Lessons Learned
- [x] 预览与导出必须统一到同一几何参考（建议以图片高度为基准进行比例化）
- [x] object-contain 下应计算显示矩形后再叠加预览层，避免错位
- [x] 轮廓等视觉参数应相对字号归一，减少平台差异
- [x] **字幕条边框空隙问题修复**: 字幕容器定位逻辑错误会导致字幕条随边框宽度增加而向内收缩，产生镜像空隙。修复方案是调整字幕容器的left和bottom属性，确保字幕条始终与图片边缘对齐，实现"所见即所得"效果。
- [x] **CSS定位逻辑优化**: 在预览渲染中，字幕容器的left属性应设为图片位置而非"图片位置+边框宽度"，width属性应使用完整图片宽度而非"图片宽度-边框宽度×2"，bottom属性应设为0px而非边框占用空间。