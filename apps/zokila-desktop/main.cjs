const path = require("node:path");
const fs = require("node:fs");
const { app, BrowserWindow, ipcMain, protocol } = require("electron");

let mainWindow;
const distPath = path.resolve(__dirname, "dist");
const contentTypes = new Map([
	[".css", "text/css; charset=utf-8"],
	[".html", "text/html; charset=utf-8"],
	[".js", "text/javascript; charset=utf-8"],
	[".svg", "image/svg+xml"],
	[".png", "image/png"],
	[".woff2", "font/woff2"],
]);

protocol.registerSchemesAsPrivileged([
	{ scheme: "zokila", privileges: { standard: true, secure: true } },
]);

function registerLocalProtocol() {
	// 正式运行时从 dist 目录提供页面文件，不让页面随意读取电脑上的文件。
		protocol.handle("zokila", (request) => {
		const decodedPath = decodeURIComponent(new URL(request.url).pathname);
		const relativePath = decodedPath.replace(/^\/+/, "") || "index.html";
		const assetPath = path.resolve(distPath, relativePath);
		const relativeToDist = path.relative(distPath, assetPath);
		// 如果路径试图跳出 dist（例如使用 ../），直接拒绝请求。
		if (relativeToDist.startsWith("..") || path.isAbsolute(relativeToDist)) {
			return new Response("Forbidden", { status: 403 });
		}

		try {
			const content = fs.readFileSync(assetPath);
			const contentType = contentTypes.get(path.extname(assetPath)) ?? "application/octet-stream";
			return new Response(content, { headers: { "Content-Type": contentType } });
		} catch {
			return new Response("Not found", { status: 404 });
		}
	});
}

function assertMainWindow(event) {
	// 只处理本应用窗口发来的请求，避免其他页面控制桌面窗口。
	const senderWindow = BrowserWindow.fromWebContents(event.sender);
	if (!senderWindow || senderWindow !== mainWindow) {
		throw new Error("Window controls are only available to the Zokila window.");
	}
	return senderWindow;
}

function sendWindowSizeState() {
	if (!mainWindow || mainWindow.isDestroyed()) return;
	mainWindow.webContents.send("zokila:window:large-state", mainWindow.isMaximized() || mainWindow.isFullScreen());
}

// 接收 preload 转来的请求，并在主进程里实际控制窗口。
ipcMain.handle("zokila:window:minimize", (event) => {
	assertMainWindow(event).minimize();
});

ipcMain.handle("zokila:window:toggle-maximize", (event) => {
	const window = assertMainWindow(event);
	if (window.isMaximized()) window.unmaximize();
	else window.maximize();
	return window.isMaximized() || window.isFullScreen();
});

ipcMain.handle("zokila:window:toggle-fullscreen", (event) => {
	const window = assertMainWindow(event);
	window.setFullScreen(!window.isFullScreen());
	return window.isMaximized() || window.isFullScreen();
});

ipcMain.handle("zokila:window:is-maximized", (event) => {
	const window = assertMainWindow(event);
	return window.isMaximized() || window.isFullScreen();
});

ipcMain.handle("zokila:window:close", (event) => {
	assertMainWindow(event).close();
});

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1440,
		height: 940,
		minWidth: 1100,
		minHeight: 720,
		backgroundColor: "#211f1d",
		title: "Zokila · 走起啦",
		frame: false,
		autoHideMenuBar: true,
		roundedCorners: true,
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			// 页面不能直接使用 Node.js；需要的能力由 preload 一项项开放。
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
	});
	mainWindow.on("maximize", sendWindowSizeState);
	mainWindow.on("unmaximize", sendWindowSizeState);
	mainWindow.on("enter-full-screen", sendWindowSizeState);
	mainWindow.on("leave-full-screen", sendWindowSizeState);

	mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
	mainWindow.webContents.on("will-navigate", (event, url) => {
		const isAppUrl = url.startsWith("zokila://app/");
		const devOrigin = process.env.ZOKILA_DEV_URL ? new URL(process.env.ZOKILA_DEV_URL).origin : undefined;
		const isDevelopmentUrl = devOrigin && new URL(url).origin === devOrigin;
		if (!isAppUrl && !isDevelopmentUrl) event.preventDefault();
	});
	mainWindow.loadURL(process.env.ZOKILA_DEV_URL ?? "zokila://app/");
}

app.whenReady().then(() => {
	registerLocalProtocol();
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
