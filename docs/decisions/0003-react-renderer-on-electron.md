# 决策 0003：保留 Electron，逐步将工作台 renderer 迁到 React

- 日期：2026-10-25
- 状态：历史技术决定；现有实现仍采用此结构，产品转向后需复核，见 0004

## 背景

Pi 是 Node.js/TypeScript Agent 项目，产品方向是面向制造业数字化与出海服务团队的桌面市场研究工作台。现有工作台由 Electron 承载，renderer 最初使用原生 HTML/CSS/JavaScript。用户希望把产品做成规模更大的应用，并明确要求保留 Electron、逐步迁移到 React。

## 决定

- 保留 Electron 作为桌面容器和 Node.js 主进程。
- 以 React + TypeScript 作为工作台 renderer，用 Vite 开发和构建。
- 继续使用受限 preload API 与 IPC 边界；renderer 不直接访问 Node.js、文件系统或 Pi SDK。
- 分阶段迁移现有 UI 行为；旧静态页面暂时保留为回退参考，不加载到新 renderer。

## 理由

- Electron 和 React 属于不同层：Electron 管桌面窗口与主进程，React 管 renderer 的界面组件和状态。
- Pi 提供 Node.js/TypeScript SDK，Electron 主进程可作为后续 Pi 会话宿主；React renderer 可保持对该宿主的依赖受限。
- React 适合继续拆分复杂工作台界面，也保留将 renderer 迁到浏览器产品的可能性。

## 边界

- React renderer 当前仍使用演示数据；Pi SDK、搜索、项目持久化、导出和团队协作未接入。
- Electron 原生启动尚未验证；Electron 运行时下载之前遇到网络失败。
- 若将来需要多人账号、云端任务和跨设备状态，另行设计后端服务；React 本身不会解决这些服务端规模问题。
- 不引入复杂路由、状态管理或服务端框架，直到多屏工作流或共享状态需要它们。

## 当前验证与下一步

- 工作台 TypeScript 检查通过，Vite 本地预览和研究表单/列表筛选已验证。
- Pi monorepo 的 `npm run check` 在上游模型类型检查处失败，与该 renderer 改动无关。
- 下一步将一个窄的研究任务请求通过 preload API 发送到 Electron 主进程，再由主进程调用 Pi SDK；调用前先明确工具 allowlist、任务取消和错误显示方式。
