import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

type Platform = "darwin" | "win32" | "linux" | "web";
type WindowAction = "close" | "minimize" | "toggle-fullscreen" | "toggle-maximize";
type IconName =
	| "search"
	| "home"
	| "grid"
	| "plus"
	| "sources"
	| "more"
	| "clock"
	| "folder"
	| "document"
	| "settings"
	| "personAdd"
	| "edit"
	| "check"
	| "list"
	| "back"
	| "forward"
	| "external"
	| "target"
	| "compass"
	| "question"
	| "play"
	| "download"
	| "chevronDown"
	| "spark"
	| "close"
	| "arrowUp";

// 图标统一在这里按名称查找，页面其他位置只传名称，不用重复写 SVG。
function Icon({ name, size = 16, className = "" }: { name: IconName; size?: number; className?: string }) {
	const shapes: Record<IconName, ReactNode> = {
		search: (
			<>
				<circle cx="7" cy="7" r="4.2" />
				<path d="m10.2 10.2 3.3 3.3" />
			</>
		),
		home: <path d="m2.5 7 5.5-4.5L13.5 7v6h-4V9.5h-3V13h-4z" />,
		grid: (
			<>
				<rect x="2.5" y="2.5" width="4.5" height="4.5" rx=".7" />
				<rect x="9" y="2.5" width="4.5" height="4.5" rx=".7" />
				<rect x="2.5" y="9" width="4.5" height="4.5" rx=".7" />
				<rect x="9" y="9" width="4.5" height="4.5" rx=".7" />
			</>
		),
		plus: <path d="M8 3.2v9.6M3.2 8h9.6" />,
		sources: (
			<>
				<circle cx="8" cy="8" r="5.6" />
				<path d="M8 5v3.4l2.4 1.4" />
			</>
		),
		more: (
			<>
				<circle cx="3" cy="8" r=".75" fill="currentColor" stroke="none" />
				<circle cx="8" cy="8" r=".75" fill="currentColor" stroke="none" />
				<circle cx="13" cy="8" r=".75" fill="currentColor" stroke="none" />
			</>
		),
		clock: (
			<>
				<circle cx="8" cy="8" r="5.7" />
				<path d="M8 4.5v3.8l2.5 1.5" />
			</>
		),
		folder: <path d="M2.5 4.2h4l1.2 1.3h5.8v6.3H2.5z" />,
		document: (
			<>
				<path d="M4 2.5h5.5l2.5 2.5v8.5H4z" />
				<path d="M9.5 2.7v2.6H12M6 8h4M6 10.5h4" />
			</>
		),
		settings: (
			<>
				<circle cx="8" cy="8" r="2.3" />
				<path
					d="m8 2.4.7 1.2 1.5.4 1.3-.5 1.1 1.1-.5 1.3.4 1.5 1.2.7v1.6l-1.2.7-.4 1.5.5 1.3-1.1 1.1-1.3-.5-1.5.4-.7 1.2H6.4l-.7-1.2-1.5-.4-1.3.5-1.1-1.1.5-1.3-.4-1.5-1.2-.7V8.1l1.2-.7.4-1.5-.5-1.3 1.1-1.1 1.3.5 1.5-.4.7-1.2z"
					transform="translate(1.6 0) scale(.8)"
				/>
			</>
		),
		personAdd: (
			<>
				<circle cx="6" cy="5.5" r="2.3" />
				<path d="M1.8 13c.4-2.2 1.9-3.4 4.2-3.4 1.1 0 2 .3 2.7.8M11.5 5.5v5M9 8h5" />
			</>
		),
		edit: (
			<>
				<path d="m3 10.8-.7 3 3-.7 7-7-2.3-2.3z" />
				<path d="m8.9 4.9 2.3 2.3" />
			</>
		),
		check: <path d="m3.1 8.2 3.1 3.1 6.8-6.8" />,
		list: (
			<>
				<path d="M5.5 4h8M5.5 8h8M5.5 12h8" />
				<circle cx="2.5" cy="4" r=".5" fill="currentColor" stroke="none" />
				<circle cx="2.5" cy="8" r=".5" fill="currentColor" stroke="none" />
				<circle cx="2.5" cy="12" r=".5" fill="currentColor" stroke="none" />
			</>
		),
		back: <path d="m9.75 3.5-4.5 4.5 4.5 4.5" />,
		forward: <path d="m6.25 3.5 4.5 4.5-4.5 4.5" />,
		external: (
			<>
				<path d="M8.5 3h4.5v4.5M13 3 7 9" />
				<path d="M11.5 8.5v4h-8v-8h4" />
			</>
		),
		target: (
			<>
				<circle cx="8" cy="8" r="5.7" />
				<circle cx="8" cy="8" r="2.1" />
				<path d="M8 1.3v2M14.7 8h-2" />
			</>
		),
		compass: (
			<>
				<circle cx="8" cy="8" r="5.7" />
				<path d="m10.4 5.6-1.2 3.6-3.6 1.2 1.2-3.6z" />
			</>
		),
		question: (
			<>
				<circle cx="8" cy="8" r="5.7" />
				<path d="M6.6 6.3a1.5 1.5 0 1 1 2.5 1.1c-.7.6-1.1.9-1.1 1.9M8 11.6v.1" />
			</>
		),
		play: <path d="m5.2 3.7 7.1 4.3-7.1 4.3z" fill="currentColor" stroke="none" />,
		download: (
			<>
				<path d="M8 2.7v7.1M5.2 7.3 8 10.1l2.8-2.8" />
				<path d="M3 11.5v1.8h10v-1.8" />
			</>
		),
		chevronDown: <path d="m4.5 6.5 3.5 3 3.5-3" />,
		spark: (
			<>
				<path d="M8 1.7 9.5 6.5 14.3 8 9.5 9.5 8 14.3 6.5 9.5 1.7 8l4.8-1.5z" />
				<path d="m12.4 1.7.5 1.7 1.7.5-1.7.5-.5 1.7-.5-1.7-1.7-.5 1.7-.5z" />
			</>
		),
		close: <path d="m4 4 8 8M12 4l-8 8" />,
		arrowUp: (
			<>
				<path d="M8 13V3M4.5 6.5 8 3l3.5 3.5" />
			</>
		),
	};

	return (
		<svg
			className={`ui-icon ${className}`}
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{shapes[name]}
		</svg>
	);
}

// 页面显示项目用的信息。现在表单数据也放在这里，接入 Agent 时再把两者分开。
interface Project {
	title: string;
	client: string;
	product: string;
	market: string;
	subtitle: string;
}

interface Finding {
	id: string;
	icon: IconName;
	iconClass: string;
	title: string;
	description: string;
	kind: string;
	source: string;
	sourceIcon: IconName;
	sourceNote?: string;
	status: string;
	statusClass: string;
	search: string;
}

// 以下是原型里的演示数据，不是 Pi 生成的真实市场结论。
const initialProject: Project = {
	title: "德国市场进入研究",
	client: "远帆精密",
	product: "工业伺服电机",
	market: "德国",
	subtitle: "梳理目标市场机会、潜在客户与进入条件，为团队下一步判断提供依据。",
};

const projects = [
	{ title: "德国市场进入研究", detail: "远帆精密 · 伺服电机", cover: "DE", coverClass: "cover-germany" },
	{ title: "东南亚工厂数字化需求", detail: "亚洲市场 · 数字化", cover: "SEA", coverClass: "cover-asia" },
	{ title: "北美渠道初步扫描", detail: "北美市场 · 渠道", cover: "US", coverClass: "cover-america" },
];

const findings: Finding[] = [
	{
		id: "01",
		icon: "compass",
		iconClass: "icon-market",
		title: "市场概览",
		description: "德国工业自动化需求与汽车、机械设备和工厂自动化场景相关；当前资料不足以判断细分市场规模与增速。",
		kind: "市场线索",
		source: "来源 A",
		sourceIcon: "external",
		sourceNote: "占位",
		status: "待核查",
		statusClass: "status-check",
		search: "德国市场概览 工业自动化 伺服电机 市场规模",
	},
	{
		id: "02",
		icon: "target",
		iconClass: "icon-buyer",
		title: "潜在客户与渠道",
		description: "可优先研究设备制造商、系统集成商及工业自动化分销渠道，并核实其本地服务要求。",
		kind: "渠道线索",
		source: "客户材料",
		sourceIcon: "document",
		sourceNote: "未添加",
		status: "分析推断",
		statusClass: "status-inference",
		search: "潜在客户 渠道 设备制造商 系统集成商 工业分销",
	},
	{
		id: "03",
		icon: "settings",
		iconClass: "icon-entry",
		title: "进入条件与本地化",
		description: "产品认证、售后响应、调试支持和交付周期需要结合目标行业逐项确认。",
		kind: "进入条件",
		source: "添加来源",
		sourceIcon: "plus",
		status: "待补资料",
		statusClass: "status-open",
		search: "本地化 认证 售后 服务 交付周期",
	},
	{
		id: "04",
		icon: "question",
		iconClass: "icon-question",
		title: "建议下一步核查",
		description: "明确首批目标行业，并补充可验证的竞品、渠道与采购周期样本。",
		kind: "待回答问题",
		source: "研究助手",
		sourceIcon: "spark",
		sourceNote: "草稿",
		status: "需确认",
		statusClass: "status-open",
		search: "下一步 问题 目标行业 竞品 样本",
	},
];

function getPlatform(): Platform {
	// Electron 模式优先读取主进程提供的平台；浏览器预览时再看地址参数或系统信息。
	const appPlatform = window.marketDeskWindow?.platform;
	if (appPlatform === "darwin" || appPlatform === "win32" || appPlatform === "linux") return appPlatform;

	const previewPlatform = new URLSearchParams(window.location.search).get("platform");
	if (previewPlatform === "darwin" || previewPlatform === "win32" || previewPlatform === "linux")
		return previewPlatform;

	const browserPlatform = navigator.platform.toLowerCase();
	if (browserPlatform.includes("mac")) return "darwin";
	if (browserPlatform.includes("win")) return "win32";
	return "web";
}

function WindowControls({
	platform,
	onAction,
	location,
}: {
	platform: Platform;
	onAction: (action: WindowAction) => void;
	location: "sidebar" | "topbar";
}) {
	// macOS 控件放在侧栏，Windows 控件放在顶部；点击后统一通知 App 处理。
	if (platform === "darwin" || platform === "web") {
		if (location === "topbar") return null;
		return (
			<div className="window-controls mac-window-controls" aria-label="macOS 窗口控制">
				<button
					className="window-dot close"
					type="button"
					onClick={() => onAction("close")}
					aria-label="关闭窗口"
				/>
				<button
					className="window-dot minimize"
					type="button"
					onClick={() => onAction("minimize")}
					aria-label="最小化窗口"
				/>
				<button
					className="window-dot maximize"
					type="button"
					onClick={() => onAction("toggle-fullscreen")}
					aria-label="进入或退出全屏"
				/>
			</div>
		);
	}
	if (location === "sidebar") return null;

	return (
		<div className="window-controls windows-window-controls" aria-label="Windows 窗口控制">
			<button
				className="window-action"
				type="button"
				onClick={() => onAction("minimize")}
				aria-label="最小化窗口"
			>
				<svg viewBox="0 0 12 12" aria-hidden="true">
					<path d="M2 6h8" />
				</svg>
			</button>
			<button
				className="window-action"
				type="button"
				onClick={() => onAction("toggle-maximize")}
				aria-label="最大化或还原窗口"
			>
				<svg className="maximize-glyph" viewBox="0 0 12 12" aria-hidden="true">
					<rect x="2.25" y="2.25" width="7.5" height="7.5" rx=".6" />
				</svg>
				<svg className="restore-glyph" viewBox="0 0 12 12" aria-hidden="true">
					<path d="M4 2.5h5.5v5.5M8 4H2.5v5.5H8z" />
				</svg>
			</button>
			<button
				className="window-action close-action"
				type="button"
				onClick={() => onAction("close")}
				aria-label="关闭窗口"
			>
				<svg viewBox="0 0 12 12" aria-hidden="true">
					<path d="m3 3 6 6M9 3 3 9" />
				</svg>
			</button>
		</div>
	);
}

function Sidebar({
	activeView,
	projectTitle,
	onNewResearch,
	onWindowAction,
	onNavigate,
	onSelectProject,
}: {
	activeView: string;
	projectTitle: string;
	onNewResearch: () => void;
	onWindowAction: (action: WindowAction) => void;
	onNavigate: (view: string) => void;
	onSelectProject: (title: string) => void;
}) {
	// 侧栏只负责显示导航和项目列表；当前项目和页面选择状态由 App 持有，再通过 props 传进来。
	return (
		<aside className="sidebar">
			<WindowControls platform={getPlatform()} onAction={onWindowAction} location="sidebar" />
			<div className="brand-lockup">
				<div className="brand-mark" aria-hidden="true">
					<span>M</span>
				</div>
				<div>
					<div className="brand-name">Market Desk</div>
					<div className="brand-caption">市场研究工作台</div>
				</div>
			</div>

			<button
				className="sidebar-search"
				type="button"
				onClick={() => document.getElementById("researchSearch")?.focus()}
			>
				<Icon name="search" size={18} /> 搜索 <kbd>⌘ K</kbd>
			</button>
			<nav className="main-nav" aria-label="主导航">
				<button
					className={`nav-item ${activeView === "home" ? "active" : ""}`}
					type="button"
					onClick={() => onNavigate("home")}
				>
					<span className="nav-icon">
						<Icon name="home" />
					</span>
					<span>首页</span>
				</button>
				<button
					className={`nav-item ${activeView === "workspace" ? "active" : ""}`}
					type="button"
					onClick={() => onNavigate("workspace")}
				>
					<span className="nav-icon">
						<Icon name="grid" />
					</span>
					<span>研究工作台</span>
					<span className="nav-count">3</span>
				</button>
				<button className="nav-item" type="button" onClick={onNewResearch}>
					<span className="nav-icon">
						<Icon name="plus" />
					</span>
					<span>新建研究</span>
				</button>
				<button
					className={`nav-item ${activeView === "sources" ? "active" : ""}`}
					type="button"
					onClick={() => onNavigate("sources")}
				>
					<span className="nav-icon">
						<Icon name="sources" />
					</span>
					<span>资料来源</span>
				</button>
			</nav>

			<div className="sidebar-section">
				<div className="sidebar-heading">
					客户项目{" "}
					<button className="sidebar-more" type="button" aria-label="更多项目">
						<Icon name="more" />
					</button>
				</div>
				<div className="recent-list">
					{projects.map((project) => (
						<button
							className={`recent-item ${project.title === projectTitle ? "selected" : ""}`}
							key={project.title}
							type="button"
							onClick={() => onSelectProject(project.title)}
						>
							<span className={`mini-cover ${project.coverClass}`}>{project.cover}</span>
							<span className="recent-copy">
								<strong>{project.title}</strong>
								<small>{project.detail}</small>
							</span>
						</button>
					))}
				</div>
			</div>

			<div className="sidebar-section library-section">
				<div className="sidebar-heading">资料库</div>
				<button className="library-item" type="button">
					<span className="library-icon">
						<Icon name="clock" />
					</span>{" "}
					最近添加 <small>12</small>
				</button>
				<button className="library-item" type="button">
					<span className="library-icon">
						<Icon name="folder" />
					</span>{" "}
					行业资料 <small>8</small>
				</button>
				<button className="library-item" type="button">
					<span className="library-icon">
						<Icon name="document" />
					</span>{" "}
					客户文件 <small>4</small>
				</button>
			</div>

			<div className="sidebar-bottom">
				<div className="workspace-switcher">
					<div className="workspace-avatar">远</div>
					<div className="workspace-copy">
						<strong>远帆咨询</strong>
						<span>团队工作空间</span>
					</div>
					<span className="switch-chevron">⌄</span>
				</div>
				<button className="settings-link" type="button">
					<span className="settings-icon">
						<Icon name="settings" />
					</span>{" "}
					设置与偏好
				</button>
			</div>
		</aside>
	);
}

function Topbar({
	platform,
	onWindowAction,
	query,
	onQueryChange,
	onShare,
	onEdit,
}: {
	platform: Platform;
	onWindowAction: (action: WindowAction) => void;
	query: string;
	onQueryChange: (value: string) => void;
	onShare: () => void;
	onEdit: () => void;
}) {
	// 搜索框是受控输入：文字存在 App 的 query 状态里，筛选由 App 统一计算。
	return (
		<header className="topbar">
			<div className="window-navigation">
				<button className="round-control" type="button" aria-label="后退">
					<Icon name="back" />
				</button>
				<button className="round-control" type="button" aria-label="前进">
					<Icon name="forward" />
				</button>
			</div>
			<div className="topbar-actions">
				<button className="round-control" type="button" onClick={onShare} aria-label="分享项目">
					<Icon name="personAdd" />
				</button>
				<button className="round-control" type="button" onClick={onEdit} aria-label="编辑简报">
					<Icon name="edit" />
				</button>
				<button className="toolbar-pill" type="button" onClick={onEdit}>
					<span className="check-mark">
						<Icon name="check" />
					</span>
					<span className="toolbar-more">
						<Icon name="more" />
					</span>
				</button>
				<button className="round-control" type="button" aria-label="列表视图">
					<Icon name="list" />
				</button>
				<label className="top-search">
					<Icon name="search" size={18} />
					<input
						type="search"
						value={query}
						onChange={(event) => onQueryChange(event.currentTarget.value)}
						placeholder="搜索这份研究"
					/>
					<kbd>⌘ F</kbd>
				</label>
				<WindowControls platform={platform} onAction={onWindowAction} location="topbar" />
			</div>
		</header>
	);
}

function Hero({
	project,
	onEdit,
	onExport,
	onContinue,
}: {
	project: Project;
	onEdit: () => void;
	onExport: () => void;
	onContinue: () => void;
}) {
	// Hero 展示当前项目；按钮点击通知 App，具体编辑和导出功能还没有接入。
	return (
		<section className="hero-section" aria-labelledby="pageTitle">
			<div className="hero-art" aria-label={`${project.market}工业市场研究主题封面`}>
				<div className="art-grid" />
				<div className="art-orbit orbit-one" />
				<div className="art-orbit orbit-two" />
				<div className="art-core" />
				<div className="art-index">
					FIELD NOTES <span>·</span> 001
				</div>
				<div className="art-country">
					{project.market === "德国" ? "DE" : project.market.slice(0, 2).toUpperCase()}
				</div>
				<div className="art-bottom">
					<span>{project.market.toUpperCase()}</span>
					<span>INDUSTRY / MARKET</span>
				</div>
			</div>
			<div className="hero-copy">
				<div className="hero-kicker">
					<span className="kicker-line" /> MARKET INTELLIGENCE <span className="kicker-dot">•</span> 研究简报
				</div>
				<h1 id="pageTitle">{project.title}</h1>
				<div className="hero-project">
					<strong>{project.client}</strong>
					<span />
					<span>
						{project.market} · {project.product}
					</span>
				</div>
				<p className="page-subtitle">{project.subtitle}</p>
				<div className="hero-actions">
					<button className="button button-primary" type="button" onClick={onContinue}>
						<Icon name="play" size={13} />
						继续研究
					</button>
					<button className="button button-soft" type="button" onClick={onExport}>
						<Icon name="download" size={15} />
						导出简报
					</button>
					<button className="button-icon" type="button" onClick={onEdit} aria-label="调整研究范围">
						<Icon name="more" />
					</button>
				</div>
				<div className="hero-meta">
					<span>
						<i className="meta-dot" />
						研究草稿
					</span>
					<span>·</span>
					<span>3 个研究章节</span>
					<span>·</span>
					<span>最近更新 10月25日</span>
				</div>
			</div>
		</section>
	);
}

function Findings({
	items,
	onSourceClick,
	onSources,
	onAddSource,
}: {
	items: Finding[];
	onSourceClick: () => void;
	onSources: () => void;
	onAddSource: () => void;
}) {
	// 研究条目由父组件传入；这里负责显示列表，不负责搜索来源或修改研究数据。
	return (
		<section className="findings-section" aria-labelledby="findingsTitle">
			<div className="section-heading">
				<div>
					<div className="section-eyebrow">RESEARCH NOTES</div>
					<h2 id="findingsTitle">研究发现</h2>
					<p>每条发现都应能追溯来源，或明确标注为推断与待核查。</p>
				</div>
				<div className="list-actions">
					<button className="filter-button" type="button" onClick={onSources}>
						全部来源
						<Icon name="chevronDown" size={13} />
					</button>
					<button className="filter-button" type="button" onClick={onAddSource}>
						<Icon name="plus" size={13} />
						添加资料
					</button>
				</div>
			</div>
			<div className="finding-table">
				<div className="table-head">
					<span>发现</span>
					<span>类型</span>
					<span>来源</span>
					<span>状态</span>
					<span />
				</div>
				{items.map((finding) => (
					<article className="finding-row" key={finding.id}>
						<span className="finding-index">{finding.id}</span>
						<div className="finding-main">
							<div className={`finding-icon ${finding.iconClass}`}>
								<Icon name={finding.icon} />
							</div>
							<div>
								<h3>{finding.title}</h3>
								<p>{finding.description}</p>
							</div>
						</div>
						<span className="finding-kind">{finding.kind}</span>
						<button className="source-chip" type="button" onClick={onSourceClick}>
							<span className="source-symbol">
								<Icon name={finding.sourceIcon} size={12} />
							</span>
							{finding.source}
							{finding.sourceNote && <small>{finding.sourceNote}</small>}
						</button>
						<span className={`finding-status ${finding.statusClass}`}>
							<i />
							{finding.status}
						</span>
						<button
							className="row-more"
							type="button"
							onClick={onSourceClick}
							aria-label={`${finding.title}更多操作`}
						>
							<Icon name="more" />
						</button>
					</article>
				))}
				{items.length === 0 && <div className="empty-findings">没有匹配的研究条目。</div>}
			</div>
			<div className="table-foot">
				<span>{items.length} 条研究记录</span>
				<span>内容由 Agent 整理，交付前请人工核验</span>
			</div>
		</section>
	);
}

function AssistantDock({
	value,
	onChange,
	onSubmit,
	onSuggestion,
}: {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onSuggestion: (prompt: string) => void;
}) {
	// 输入框内容由 App 管理。当前发送只显示演示提示，不会请求模型。
	return (
		<div className="assistant-dock">
			<div className="dock-agent">
				<span className="agent-mark">
					<Icon name="spark" size={15} />
				</span>
				<div>
					<strong>研究助手</strong>
					<small>
						<i /> 演示模式
					</small>
				</div>
			</div>
			<form className="chat-composer" onSubmit={onSubmit}>
				<textarea
					rows={1}
					value={value}
					onChange={(event) => onChange(event.currentTarget.value)}
					placeholder="追问、补充背景，或告诉研究助手下一步做什么…"
				/>
				<div className="composer-actions">
					<button
						type="button"
						className="dock-suggestion"
						onClick={() => onSuggestion("列出这份简报最需要补充的证据")}
					>
						待补证据
					</button>
					<button
						type="button"
						className="dock-suggestion"
						onClick={() => onSuggestion("帮我细化德国市场的目标客户类型")}
					>
						细化客户
					</button>
					<span className="composer-hint">演示模式 · 不会调用模型</span>
					<button className="send-button" type="submit" aria-label="发送消息">
						<Icon name="arrowUp" size={15} />
					</button>
				</div>
			</form>
		</div>
	);
}

function ResearchDialog({
	isOpen,
	onClose,
	onCreate,
}: {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (project: Project) => void;
}) {
	if (!isOpen) return null;

	function submit(event: FormEvent<HTMLFormElement>) {
		// 阻止浏览器默认刷新，然后按 input 的 name 取值并清理首尾空格。
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const client = String(formData.get("client") ?? "").trim();
		const product = String(formData.get("product") ?? "").trim();
		const market = String(formData.get("market") ?? "").trim();
		const question = String(formData.get("question") ?? "").trim();
		// 把弹窗收集到的数据交给 App。当前回调只更新演示页面，还没有发给 Pi。
		onCreate({
			client,
			product,
			market,
			title: `${market} · ${product}市场研究`,
			subtitle: `围绕“${question}”整理研究提纲，为${client}的市场判断提供依据。`,
		});
		// 提交后清空表单，避免下次打开时残留上一次输入。
		event.currentTarget.reset();
	}

	return (
		<div
			className="modal-backdrop"
			onMouseDown={(event) => {
				// 只有点在遮罩空白处才关闭弹窗；点表单内容时不关闭。
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<section className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
				<div className="modal-heading">
					<div>
						<span className="section-eyebrow">NEW RESEARCH</span>
						<h2 id="modalTitle">创建市场研究任务</h2>
						<p>先确定研究对象和目标市场，后续可以继续补充。</p>
					</div>
					<button className="modal-close" type="button" onClick={onClose} aria-label="关闭">
						<Icon name="close" />
					</button>
				</div>
				<form className="research-form" onSubmit={submit}>
					<label>
						客户或项目名称
						<input name="client" placeholder="例如：远帆精密" required autoFocus />
					</label>
					<div className="form-grid">
						<label>
							产品 / 业务
							<input name="product" placeholder="例如：工业伺服电机" required />
						</label>
						<label>
							目标国家或地区
							<input name="market" placeholder="例如：德国" required />
						</label>
					</div>
					<label>
						本次想回答的问题
						<textarea
							name="question"
							rows={3}
							placeholder="例如：优先进入哪些行业？需要核查哪些本地要求？"
							required
						/>
					</label>
					<div className="form-note">
						<span>i</span> 创建后会先生成研究提纲。演示版本不会调用 Pi 或外部服务。
					</div>
					<div className="modal-actions">
						<button className="button button-soft" type="button" onClick={onClose}>
							取消
						</button>
						<button className="button button-primary" type="submit">
							创建研究任务 <Icon name="forward" size={13} />
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export function App() {
	// App 是当前页面的状态所有者：子组件通过 props 展示数据、把用户操作回报上来。
	const platform = useMemo(getPlatform, []);
	const [project, setProject] = useState(initialProject);
	const [activeView, setActiveView] = useState("workspace");
	const [query, setQuery] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [noticeVisible, setNoticeVisible] = useState(true);
	const [toast, setToast] = useState("");
	const [chatValue, setChatValue] = useState("");
	const [isWindowLarge, setIsWindowLarge] = useState(false);
	const toastTimer = useRef<number | undefined>(undefined);
	// 搜索结果由 query 和演示数据算出来，不另存一份可能过期的列表。
	const filteredFindings = useMemo(() => {
		const normalizedQuery = query.trim().toLocaleLowerCase();
		return normalizedQuery
			? findings.filter((finding) =>
					`${finding.title} ${finding.description} ${finding.kind} ${finding.search}`
						.toLocaleLowerCase()
						.includes(normalizedQuery),
				)
			: findings;
	}, [query]);

	useEffect(() => {
		// 平台样式加在 body 上；离开页面时移除，避免样式状态残留。
		document.body.classList.add(`platform-${platform}`);
		return () => document.body.classList.remove(`platform-${platform}`);
	}, [platform]);

	useEffect(() => {
		// Electron 页面启动后先读取窗口大小状态，再订阅后续变化。
		const api = window.marketDeskWindow;
		if (!api) return;
		void api
			.isMaximized()
			.then(setIsWindowLarge)
			.catch(() => undefined);
		return api.onMaximizedChange(setIsWindowLarge);
	}, []);

	// 页面卸载时清除计时器，避免提示框回调在页面离开后继续改状态。
	useEffect(() => () => window.clearTimeout(toastTimer.current), []);

	useEffect(() => {
		// Escape 关闭弹窗；清理函数负责移除全局键盘监听。
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setModalOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		// 最大化状态只控制页面样式；真正的窗口变化由 Electron 主进程执行。
		document.body.classList.toggle("is-maximized", isWindowLarge);
	}, [isWindowLarge]);

	function showToast(message: string) {
		setToast(message);
		// 连续弹提示时重置计时，让最新一条完整显示 2.8 秒。
		window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(""), 2800);
	}

	// 窗口操作先交给 preload，再由 Electron 主进程执行。
	async function handleWindowAction(action: WindowAction) {
		const api = window.marketDeskWindow;
		if (!api) {
			showToast("窗口按钮会在 Electron 桌面应用中控制窗口。");
			return;
		}
		try {
			// 最大化和全屏会返回新状态，App 用它更新样式；最小化和关闭不需要返回值。
			if (action === "minimize") await api.minimize();
			if (action === "close") await api.close();
			if (action === "toggle-maximize") setIsWindowLarge(await api.toggleMaximize());
			if (action === "toggle-fullscreen") setIsWindowLarge(await api.toggleFullScreen());
		} catch {
			showToast("窗口控制暂时不可用。");
		}
	}

	function handleCreateProject(nextProject: Project) {
		// 更新页面显示；当前只是演示，不会保存任务或调用 Pi。
		setProject(nextProject);
		setModalOpen(false);
		showToast("研究任务已创建。演示版本不会调用 Pi Agent；真实研究流程尚未接入。");
	}

	function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!chatValue.trim()) return;
		// 现在只模拟收到消息；这里没有调用 Pi 会话，也不会把输入发到外部服务。
		showToast("消息已在本地交互中接收；Pi Agent 尚未接入。演示模式不会发送数据。");
		setChatValue("");
	}

	function handleAction(action: string) {
		showToast(`${action}将在接入研究数据与 Pi Agent 后实现。`);
	}

	function handleNavigate(view: string) {
		setActiveView(view);
		if (view !== "workspace") showToast("该页面尚在产品原型范围之外，当前展示研究工作台。");
	}

	function handleSelectProject(title: string) {
		if (title !== initialProject.title) {
			showToast(`“${title}”是演示列表项，暂未加载独立研究内容。`);
			return;
		}
		setProject(initialProject);
	}

	return (
		<div className="app-shell">
			<Sidebar
				activeView={activeView}
				projectTitle={project.title}
				onNewResearch={() => setModalOpen(true)}
				onWindowAction={(action) => void handleWindowAction(action)}
				onNavigate={handleNavigate}
				onSelectProject={handleSelectProject}
			/>
			<main className="main-area">
				<Topbar
					platform={platform}
					onWindowAction={(action) => void handleWindowAction(action)}
					query={query}
					onQueryChange={setQuery}
					onShare={() => handleAction("分享")}
					onEdit={() => handleAction("编辑")}
				/>
				<div className="page-scroll">
					<div className="breadcrumb-line">
						<span>研究工作台</span>
						<span className="crumb-slash">/</span>
						<strong>{project.title}</strong>
						<span className="demo-status">
							<i />
							演示草稿
						</span>
					</div>
					<Hero
						project={project}
						onEdit={() => handleAction("调整研究范围")}
						onExport={() => handleAction("导出简报")}
						onContinue={() => handleAction("继续研究")}
					/>
					{noticeVisible && (
						<div className="demo-notice">
							<span className="notice-icon">i</span>
							<span>
								<strong>演示内容</strong>　市场描述与来源均为占位示例，不代表真实研究结论。
							</span>
							<button type="button" onClick={() => setNoticeVisible(false)} aria-label="关闭提示">
								<Icon name="close" size={12} />
							</button>
						</div>
					)}
					<section className="research-progress" aria-label="研究进度">
						<div className="progress-title">
							<span>研究进度</span>
							<strong>
								初步扫描 <em>2 / 4</em>
							</strong>
						</div>
						<div className="progress-track">
							<span />
						</div>
						<div className="progress-steps">
							<span className="step-done">
								<i>✓</i>任务背景
							</span>
							<span className="step-done">
								<i>✓</i>研究提纲
							</span>
							<span className="step-active">
								<i>3</i>证据整理
							</span>
							<span>
								<i>4</i>人工审核
							</span>
						</div>
					</section>
					<Findings
						items={filteredFindings}
						onSourceClick={() => handleAction("查看来源")}
						onSources={() => handleAction("来源筛选")}
						onAddSource={() => handleAction("添加资料")}
					/>
					<div className="source-note">
						<span>
							<Icon name="search" size={17} />
						</span>
						<div>
							<strong>来源与证据</strong>
							<span>查看这份研究引用的公开资料、客户文件和日期信息。</span>
						</div>
						<button type="button" onClick={() => handleAction("查看来源清单")}>
							查看来源清单 <Icon name="external" size={13} />
						</button>
					</div>
				</div>
				<AssistantDock
					value={chatValue}
					onChange={setChatValue}
					onSubmit={handleChatSubmit}
					onSuggestion={setChatValue}
				/>
			</main>
			{toast && (
				<div className="toast" role="status" aria-live="polite">
					{toast}
				</div>
			)}
			<ResearchDialog isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateProject} />
		</div>
	);
}
