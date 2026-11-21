const { contextBridge, ipcRenderer } = require("electron");

// 页面只能用这里列出的功能，不能直接使用 Electron 的全部能力。
contextBridge.exposeInMainWorld("zokilaWindow", {
	platform: process.platform,
	// invoke 把请求送到主进程，并把处理结果作为 Promise 返回给页面。
	minimize: () => ipcRenderer.invoke("zokila:window:minimize"),
	toggleMaximize: () => ipcRenderer.invoke("zokila:window:toggle-maximize"),
	toggleFullScreen: () => ipcRenderer.invoke("zokila:window:toggle-fullscreen"),
	isMaximized: () => ipcRenderer.invoke("zokila:window:is-maximized"),
	close: () => ipcRenderer.invoke("zokila:window:close"),
	onMaximizedChange: (callback) => {
		const listener = (_event, isLarge) => callback(isLarge);
		ipcRenderer.on("zokila:window:large-state", listener);
		// 调用方离开时用返回的函数取消监听，防止旧页面继续接收事件。
		return () => ipcRenderer.removeListener("zokila:window:large-state", listener);
	},
});
