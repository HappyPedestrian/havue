# 项目介绍

[English](./README.md) | 简体中文

## 项目结构

```text
root/
|—— demos/              # 各个功能组件使用示例
|—— docs/               # vitepress 文档
|—— internal/           # 项目构建包
|—— packages/           # 子包
|   |—— build/          # vite打包相关
|   |—— components/     # 组件
|   |—— directives/     # 指令
|   |—— hooks/          # vue composition api
|   |—— havue/           # 全量库
|   |—— shared/         # 项目通用模块
|   |—— solutions/      # 特殊复杂场景解决方案
|   |—— tools/          # 工具函数库
|   |—— utils/          # 组件库工具函数，如给组件添加install属性
|—— scripts/            # 脚本
```

## 命令

### 安装

```bash
pnpm i
```

### vitepress文档

开发模式

```bash
pnpm run docs:dev
```

构建

```bash
pnpm run docs:build
```

### 库打包

#### 构建内部库

构建 `internal/`目录下的包，`scripts/`中的脚本的执行和 `packages/`下的包的构建都依赖此包

```bash
pnpm run build:internal
```

#### 更新库版本号

⚠️ ️️️如果之前未执行过 构建内部库 命令，请先执行该命令！

构建前，请先更新.env文件中的版本号，然后执行以下命令, 全量更新版本号。

```bash
pnpm run update:version
```

### 构建包

```bash
pnpm run build:lib
```

### 注意事项

如果在packages\components下新增组件

1. 需在 `packages\components\package.json`中将该组件添加到dependencies。
2. 在 `packages\components\src\index.ts`中导出新增组件。
3. 在 `packages\havue\src\components.ts`中添加新增组件。
