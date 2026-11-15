const toast = document.querySelector("#toast");
const modalBackdrop = document.querySelector("#modalBackdrop");
const windowApi = window.marketDeskWindow;
let toastTimer;

const browserPlatform = navigator.platform.toLowerCase();
const previewPlatform = new URLSearchParams(window.location.search).get("platform");
const validPreviewPlatforms = ["darwin", "win32", "linux"];
const platform = windowApi?.platform ?? (validPreviewPlatforms.includes(previewPlatform)
	? previewPlatform
	: browserPlatform.includes("mac")
		? "darwin"
		: browserPlatform.includes("win")
			? "win32"
			: "web");
document.body.classList.add(`platform-${platform}`);

function showToast(message) {
	toast.textContent = message;
	toast.classList.add("visible");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function openModal() {
	modalBackdrop.hidden = false;
	document.querySelector('input[name="client"]').focus();
}

function closeModal() {
	modalBackdrop.hidden = true;
}

document.querySelector("#newResearchButton").addEventListener("click", openModal);
document.querySelector("#closeModal").addEventListener("click", closeModal);
document.querySelector("#cancelModal").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
	if (event.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeModal();
});

document.querySelector("#researchForm").addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);
	const market = formData.get("market").trim();
	const product = formData.get("product").trim();
	const title = `${market} · ${product}市场研究`;
	document.querySelector("#pageTitle").textContent = title;
	document.querySelector("#breadcrumbTitle").textContent = title;
	document.querySelector("#marketLabel").textContent = `${market} · ${product}`;
	document.querySelector(".page-subtitle").textContent = `面向${formData.get("client").trim()}，围绕“${formData.get("question").trim()}”整理研究提纲。`;
	closeModal();
	showToast("研究任务已创建。演示版本不会调用 Pi Agent；真实研究流程尚未接入。");
	event.currentTarget.reset();
});

document.querySelectorAll(".nav-item").forEach((button) => {
	button.addEventListener("click", () => {
		if (button.id === "newResearchButton") return;
		document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
		button.classList.add("active");
		if (button.dataset.view !== "workspace") {
			showToast("该页面尚在产品原型范围之外，当前展示研究工作台。");
		}
	});
});

document.querySelectorAll(".recent-item").forEach((button) => {
	button.addEventListener("click", () => {
		document.querySelectorAll(".recent-item").forEach((item) => item.classList.remove("selected"));
		button.classList.add("selected");
		if (button.dataset.title !== "德国市场进入研究") {
			showToast(`“${button.dataset.title}”是演示列表项，暂未加载独立研究内容。`);
			return;
		}
		document.querySelector("#pageTitle").textContent = button.dataset.title;
		document.querySelector("#breadcrumbTitle").textContent = button.dataset.title;
	});
});

document.querySelector("#chatForm").addEventListener("submit", (event) => {
	event.preventDefault();
	const input = document.querySelector("#chatInput");
	if (!input.value.trim()) return;
	showToast("消息已在本地交互中接收；Pi Agent 尚未接入。演示模式不会发送数据。");
	input.value = "";
});

document.querySelectorAll(".suggestion").forEach((button) => {
	button.addEventListener("click", () => {
		document.querySelector("#chatInput").value = button.dataset.prompt;
		document.querySelector("#chatInput").focus();
	});
});

document.querySelectorAll("#exportButton, #shareButton, #editBriefButton, #editTaskButton, #allSourcesButton, #addSourceButton, #viewSourcesButton, #reviewButton, #continueResearchButton").forEach((button) => {
	button.addEventListener("click", () => showToast("该操作将在接入研究数据与 Pi Agent 后实现。"));
});

document.querySelector("#sidebarSearch").addEventListener("click", () => document.querySelector("#researchSearch").focus());
document.querySelector("#researchSearch").addEventListener("input", (event) => {
	const query = event.currentTarget.value.trim().toLocaleLowerCase();
	document.querySelectorAll(".finding-row").forEach((row) => {
		row.hidden = query.length > 0 && !row.dataset.search.toLocaleLowerCase().includes(query);
	});
});

document.querySelectorAll("[data-window-action]").forEach((button) => {
	button.addEventListener("click", async () => {
		if (!windowApi) {
			showToast("窗口按钮会在 Electron 桌面应用中控制窗口。");
			return;
		}

		try {
			const action = button.dataset.windowAction;
			if (action === "minimize") await windowApi.minimize();
			if (action === "close") await windowApi.close();
			if (action === "toggle-maximize") {
				const maximized = await windowApi.toggleMaximize();
				document.body.classList.toggle("is-maximized", maximized);
			}
			if (action === "toggle-fullscreen") {
				const fullScreen = await windowApi.toggleFullScreen();
				document.body.classList.toggle("is-maximized", fullScreen);
			}
		} catch {
			showToast("窗口控制暂时不可用。");
		}
	});
});

if (windowApi) {
	windowApi.isMaximized().then((maximized) => {
		document.body.classList.toggle("is-maximized", maximized);
	}).catch(() => {});
	const unsubscribeMaximize = windowApi.onMaximizedChange((maximized) => {
		document.body.classList.toggle("is-maximized", maximized);
	});
	window.addEventListener("beforeunload", unsubscribeMaximize, { once: true });

	document.querySelector(".topbar").addEventListener("dblclick", (event) => {
		if (event.target.closest("button, input, label")) return;
		windowApi.toggleMaximize().then((maximized) => {
			document.body.classList.toggle("is-maximized", maximized);
		}).catch(() => {});
	});
}

document.querySelector("#dismissNotice").addEventListener("click", () => {
	document.querySelector(".demo-notice").remove();
});

document.querySelectorAll(".source-chip").forEach((button) => {
	button.addEventListener("click", () => showToast("这是来源占位示例，当前没有可打开的原始资料。"));
});
