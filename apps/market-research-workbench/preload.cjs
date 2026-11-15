const { contextBridge, ipcRenderer } = require("electron");

// 页面只能用这里列出的功能，不能直接使用 Electron 的全部能力。
contextBridge.exposeInMainWorld("marketDeskWindow", {
	platform: process.platform,
	// invoke 把请求送到主进程，并把处理结果作为 Promise 返回给页面。
	minimize: () => ipcRenderer.invoke("marketdesk:window:minimize"),
	toggleMaximize: () => ipcRenderer.invoke("marketdesk:window:toggle-maximize"),
	toggleFullScreen: () => ipcRenderer.invoke("marketdesk:window:toggle-fullscreen"),
	isMaximized: () => ipcRenderer.invoke("marketdesk:window:is-maximized"),
	close: () => ipcRenderer.invoke("marketdesk:window:close"),
	onMaximizedChange: (callback) => {
		const listener = (_event, isLarge) => callback(isLarge);
		ipcRenderer.on("marketdesk:window:large-state", listener);
		// 调用方离开时用返回的函数取消监听，防止旧页面继续接收事件。
		return () => ipcRenderer.removeListener("marketdesk:window:large-state", listener);
	},
});
