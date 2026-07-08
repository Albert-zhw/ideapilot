# IdeaPilot 项目规则

## 技术栈
- Next.js 16 App Router + TypeScript + TailwindCSS
- Prisma + SQLite（本地开发）/ PostgreSQL（生产）
- NextAuth.js 认证（Credentials Provider）
- Vercel AI SDK + OpenAI（真实 LLM 调用，API Key 缺失时降级为本地模拟）
- @react-pdf/renderer + remark（PDF 与 Markdown 导出）

## 工程分层（严格遵守）
- `repositories/`：只做数据库 CRUD，一个表对应一个 Repository，不含业务逻辑
- `services/`：业务逻辑编排，调用 Repository 和外部 API（LLM），是测试重点
- `actions/`：Server Actions，薄封装，做参数校验 + 调 Service + 返回结果给页面，不含业务逻辑
- `components/`：页面组件，只负责展示和交互，通过 Server Actions 拿数据
- `lib/`：基础设施（db 客户端、auth 配置、AI 引擎、导出工具）

## 命名约定
- 文件：camelCase（userRepository.ts）
- 类型：PascalCase（AnalysisResult）
- 数据库表：snake_case（analysis_results）
- Server Action：动词开头（createIdea, analyzeIdea）
- API 路由：小写连字符

## 视觉风格
- 深空蓝背景 #030713
- 青蓝/紫罗兰渐变（#6fe8ff → #2f7bff → #a66bff）
- 玻璃拟态卡片 + 光泽扫过
- 雷达核心动画保留（首页 Hero 区）
- 移动端响应式（sm: md: 断点）

## 安全
- 所有 Server Action 校验登录状态
- 用户只能访问自己的想法（数据隔离）
- 密码用 bcryptjs 哈希，不存明文
- LLM API Key 只在服务端使用，不暴露给前端

## Next.js 16 注意事项
- 本项目使用 Next.js 16（非 14），有 breaking changes
- 编写页面/Server Action 前参考 node_modules/next/dist/docs/ 中的文档
- 注意遵守 Next.js 16 的 App Router 约定和 deprecation 提示

## AI 降级策略
- 当 OPENAI_API_KEY 为空或调用失败时，降级为本地关键词匹配模拟
- 降级结果需在返回值中标记 source: 'mock' | 'ai'
- 保证无 API Key 时也能完整体验功能闭环
