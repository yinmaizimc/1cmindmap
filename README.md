# 思维导图生成工具

本项目是一个基于 React + markmap 的极简思维导图生成工具，支持：
- 结构化文本（如 Markdown）一键生成可编辑思维导图
- 通过 DeepSeek 搜索自动生成大纲并转为导图
- 支持导图 SVG/PNG/JPG/XMind 下载
- 界面简洁直观

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/textomindmap)

## 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/yourusername/textomindmap.git
cd textomindmap
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量示例文件
cp env.example .env.local

# 编辑 .env.local 文件，设置你的 DeepSeek API Key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. **启动项目**
```bash
npm run dev
```

浏览器访问终端输出的本地地址（如 http://localhost:5173 ）。

### 获取 DeepSeek API Key

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/api_keys)
2. 注册并登录账户
3. 创建新的 API Key
4. 将 API Key 复制到环境变量中

## 部署到 Vercel

### 方法一：一键部署

点击上方 [Deploy with Vercel] 按钮，按照提示完成部署。

### 方法二：手动部署

1. **准备项目**
```bash
# 确保代码已提交到 GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **在 Vercel 中导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置环境变量：
     - `VITE_DEEPSEEK_API_KEY`: 你的 DeepSeek API Key

3. **部署配置**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **点击 Deploy**

### 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `VITE_DEEPSEEK_API_KEY` | DeepSeek API Key | ✅ |
| `VITE_APP_NAME` | 应用名称 | ❌ |
| `VITE_APP_VERSION` | 应用版本 | ❌ |

## 主要依赖
- [React](https://react.dev/) - 前端框架
- [markmap-lib](https://github.com/markmap/markmap) - 思维导图核心库
- [markmap-view](https://github.com/markmap/markmap) - 思维导图视图组件
- [MUI](https://mui.com/) - UI 组件库
- [axios](https://axios-http.com/) - HTTP 客户端
- [Vite](https://vitejs.dev/) - 构建工具

## 目录结构
```
├── src/
│   ├── components/
│   │   ├── MarkdownInput.tsx      # 文本输入组件
│   │   ├── MindMapEditor.tsx      # 思维导图编辑器
│   │   └── SearchToMarkdown.tsx   # 搜索转Markdown组件
│   ├── utils/
│   │   ├── deepseek.ts           # DeepSeek API 集成
│   │   └── smartTextToMarkdown.ts # 智能文本转换
│   ├── App.tsx                   # 主应用组件
│   └── main.tsx                  # 应用入口
├── public/                       # 静态资源
├── vercel.json                   # Vercel 部署配置
├── env.example                   # 环境变量示例
└── package.json                  # 项目配置
```

## 功能演示
- **左侧**: 输入 Markdown 或通过关键词搜索生成大纲
- **中间**: Markdown 富文本预览和编辑
- **右侧**: 实时思维导图渲染
- **顶部**: 一键下载 SVG/PNG/JPG/XMind 格式

## 开发脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # TypeScript 类型检查
npm run preview      # 预览构建结果
```

## 故障排除

### 常见问题

1. **API Key 错误**
   - 确保 `VITE_DEEPSEEK_API_KEY` 已正确设置
   - 检查 API Key 是否有效且未过期

2. **构建失败**
   - 确保 Node.js 版本 >= 18.0.0
   - 清除 node_modules 并重新安装依赖

3. **部署失败**
   - 检查 Vercel 环境变量配置
   - 确保所有必需的环境变量都已设置

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---
如有问题欢迎反馈！
