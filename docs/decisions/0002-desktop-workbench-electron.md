# 决策 0002：用 Electron 开始桌面工作台

- 日期：2026-10-25
- 状态：历史技术决定；产品转向后需复核桌面形态，见 0004

## 背景

产品首版需要一个面向内部市场/交付团队的桌面工作台。Pi Agent 是 Node.js/TypeScript 项目，并提供 TypeScript SDK；当前没有产品界面。

## 决定

在 Pi monorepo 的 `apps/market-research-workbench/` 创建 Electron 桌面应用原型。renderer 用本地 HTML/CSS/JavaScript 展示市场研究流程；后续由受控主进程接入 Pi SDK。

## 理由

- Electron 与 Pi 的 Node.js 运行环境相近，后续可让主进程直接管理 Pi SDK 会话。
- 先用无框架 renderer 验证工作流，避免在需求未验证时引入 React、构建器和额外依赖。
- 主进程与 renderer 分离，renderer 禁用 Node 集成，并启用 context isolation 和 sandbox。

## 当前边界

- 界面数据为演示内容，不表示真实德国市场研究结论。
- 暂未接入 Pi SDK、模型认证、网络搜索、来源存储、文档上传、导出或任务持久化。
- 浏览器预览已验证页面布局与新建任务表单；Electron 45.0.0 的本机二进制下载未完成，桌面壳启动尚未验证。

## 代价与重新评估条件

- Electron 会增加应用体积和运行时维护成本。
- 若后续目标转为浏览器 SaaS，或需要更小的原生包体，再比较纯 Web、Tauri 等方案。
- 下一步应让用户审核工作台流程，再实现通过主进程调用 Pi SDK 的单次研究对话切片。

> 历史路径说明：文中的 `apps/market-research-workbench/` 是当时的目录名；现行桌面原型目录为 `apps/zokila-desktop/`。本决策的市场研究功能描述不再代表当前产品方向。
