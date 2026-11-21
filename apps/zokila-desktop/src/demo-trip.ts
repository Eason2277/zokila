// 演示数据：不是 Pi 生成的真实行程。价格、时间、来源均为占位，用于在接入 Agent 之前
// 开发和验证界面。接上真实数据源后，这个文件删除，替换为 Pi 返回的 ItineraryDraft。
//
// 文件名故意叫 demo-trip 而不是 fixture：fixture 是测试术语，这里的用途是"界面演示数据"。

import type { ItineraryDraft } from "./itinerary";
import type { TripRequest } from "./trip-request";

// 用户输入部分：模拟旅行者在表单里填写的条件。
// 注意 budget 是按团（group）计算的 3000 元，不是每人 3000。
export const demoRequest: TripRequest = {
	destination: "杭州",
	startDate: "2026-12-20",
	endDate: "2026-12-21",
	partySize: 2,
	pace: "balanced",
	interests: ["美食", "西湖", "博物馆"],
	constraints: ["带老人，少走路"],
	budgets: [{ amount: 3000, currency: "CNY", scope: "group" }],
};

// Agent 输出部分：模拟一份已经生成好的草稿。
// 四天行程项分别覆盖 sourced / unverified / inferred / userConfirmed 四种状态，
// 让界面开发时每个分支都有数据可看。
export const demoDraft: ItineraryDraft = {
	request: demoRequest,
	generatedAt: "2026-11-21T10:00:00+08:00",

	// 用户跳过的问题：Agent 代为假设，并在这里留痕，用户之后可以推翻。
	assumptions: ["用户没有确认是否需要无障碍路线，暂时按“少走路”处理，每天只安排一个主要景点。"],

	// 仍需用户确认的信息：影响行程可行性，但不该由 Agent 替用户决定。
	openQuestions: ["第一天晚上是否需要在西湖边用餐？这会影响 18:00 之后的安排。"],

	// 检测到的冲突或风险：展示给用户判断，不静默处理。
	warnings: ["12 月 20 日下午的博物馆闭馆时间未核实，与晚饭时间可能冲突。"],

	// 预算提示：说明估算依据，并标出可能超限的项目。
	budgetNotes: ["两天餐饮按每人 400 元估算，合计 800 元；若加一顿湖景餐厅晚餐，可能超出预算。"],

	days: [
		{
			date: "2026-12-20",
			stops: [
				{
					id: "d1-s1",
					title: "西湖东岸散步",
					kind: "sight",
					startTime: "09:30",
					durationMinutes: 90,
					location: "断桥残雪 → 白堤",
					notes: "地势平坦，适合少走路的安排；建议早上出发避开人流。",
					// 有来源和查询时间，所以状态是 sourced。
					sources: [
						{
							label: "杭州市文化广电旅游局",
							url: "https://example.com/hangzhou/west-lake",
							retrievedAt: "2026-11-20T09:30:00+08:00",
						},
					],
					status: "sourced",
					// 用户已经确认过这一项：之后重排一天时不能替换或删除它。
					userConfirmed: true,
				},
				{
					id: "d1-s2",
					title: "楼外楼午餐",
					kind: "meal",
					startTime: "11:30",
					durationMinutes: 60,
					location: "孤山路",
					notes: "价格和排队情况未核实。",
					// 没有来源：界面要标"待核查"，不能显示成确定的事实。
					sources: [],
					status: "unverified",
					userConfirmed: false,
				},
				{
					id: "d1-s3",
					title: "浙江省博物馆（孤山馆区）",
					kind: "activity",
					startTime: "13:30",
					durationMinutes: 120,
					location: "孤山路 25 号",
					notes: "这是 Agent 的建议，不是已核实的事实；先去官网确认当天是否开放。",
					sources: [],
					status: "inferred",
					userConfirmed: false,
				},
				{
					id: "d1-s4",
					title: "返回酒店休息",
					kind: "rest",
					startTime: "16:00",
					durationMinutes: 90,
					notes: "按“少走路”约束加入的休息段，地点待用户补充。",
					sources: [],
					status: "inferred",
					userConfirmed: false,
				},
			],
		},
		{
			date: "2026-12-21",
			stops: [
				{
					id: "d2-s1",
					title: "灵隐寺",
					kind: "sight",
					startTime: "09:00",
					durationMinutes: 150,
					location: "灵隐路法云弄 1 号",
					notes: "景区较大，建议预留休息时间；门票和开放时间需再核对。",
					sources: [
						{
							label: "灵隐寺官网",
							url: "https://example.com/lingyin",
							retrievedAt: "2026-11-20T10:00:00+08:00",
						},
					],
					status: "sourced",
					userConfirmed: false,
				},
				{
					id: "d2-s2",
					title: "龙井村午餐",
					kind: "meal",
					startTime: "12:00",
					durationMinutes: 75,
					location: "龙井村",
					notes: "餐厅和价格未核实，作为备选保留。",
					sources: [],
					status: "unverified",
					userConfirmed: false,
				},
				{
					id: "d2-s3",
					title: "地铁返程",
					kind: "transport",
					startTime: "15:00",
					durationMinutes: 60,
					notes: "路线和耗时是估计值，出发前用地图确认。",
					sources: [],
					status: "inferred",
					userConfirmed: false,
				},
			],
		},
	],
};
