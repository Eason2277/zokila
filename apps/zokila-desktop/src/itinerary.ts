// 行程草稿的数据形状。这里定义的是 Agent 的输出：来源事实、建议、假设和待核查项
// 必须能分开表达，UI 才不会把推断显示成用户确认过的条件。
// 所有字段都是纯数据、可 JSON 序列化，因为将来要经 Electron IPC 从主进程传回渲染层。

import type { TripRequest } from "./trip-request";

// 一条来源：给用户看的名称、可选的链接，以及这条信息是什么时候查到的。
// retrievedAt 用来判断时效性；缺了它就无法说明营业时间、价格等信息是否可能过期。
export interface SourceRef {
	label: string;
	url?: string;
	retrievedAt: string; // ISO 8601，例如 "2026-11-20T09:30:00+08:00"
}

// 每个行程项的核实状态：
// sourced    = 有来源和查询时间，可以点开核对
// unverified = 缺来源、来源过期或信息冲突，UI 标"待核查"
// inferred   = Agent 的建议或推断，不是可核查的事实
export type EvidenceStatus = "sourced" | "unverified" | "inferred";

// 行程项的类别，决定 UI 图标和排序时的区分方式（交通和停留不是一回事）。
export type StopKind = "sight" | "meal" | "transport" | "activity" | "rest";

// 一天里的一个活动。id 必须稳定：重排或替换时靠它识别同一项，
// 不能用数组下标，否则用户确认过的项会被静默换掉。
export interface ItineraryStop {
	id: string;
	title: string;
	kind: StopKind;
	startTime?: string; // "HH:mm"；未知就省略，不要编造
	durationMinutes?: number; // 估计时长；未知就省略
	location?: string;
	notes?: string; // Agent 的补充说明，不作为事实展示
	sources: SourceRef[]; // 空数组表示没有来源，通常对应 unverified
	status: EvidenceStatus; // 以 status 为准，不靠 sources 是否为空反推
	userConfirmed: boolean; // true 时重排不能替换或删除这一项（PRD 第 4 条）
}

// 一天的行程。date 用 YYYY-MM-DD，和 TripRequest 的日期格式保持一致。
export interface ItineraryDay {
	date: string;
	stops: ItineraryStop[];
}

// Agent 返回的完整草稿。request 是生成时用户输入的快照：
// 用户之后改了输入，不会悄悄改写这份草稿，只有重新生成才会变。
export interface ItineraryDraft {
	request: TripRequest;
	days: ItineraryDay[];
	assumptions: string[]; // 用户跳过的问题，Agent 代为采用的假设
	openQuestions: string[]; // 仍需用户确认或补充的信息
	warnings: string[]; // 时间冲突、预算超限、信息可能过期等提示
	budgetNotes: string[]; // 预算提示和可能超出约束的项目
	generatedAt: string; // ISO 8601，草稿生成时间
}
