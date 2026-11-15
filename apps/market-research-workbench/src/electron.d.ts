export {};

declare global {
	interface Window {
		// 告诉 TypeScript 页面能调用哪些 preload 方法；具体实现见 preload.cjs。
		// 这里只影响编译期提示，不会创建方法；运行时实现仍在 preload.cjs。
		marketDeskWindow?: {
			platform: string;
			minimize: () => Promise<void>;
			toggleMaximize: () => Promise<boolean>;
			toggleFullScreen: () => Promise<boolean>;
			isMaximized: () => Promise<boolean>;
			close: () => Promise<void>;
			onMaximizedChange: (callback: (isLarge: boolean) => void) => () => void;
		};
	}
}
