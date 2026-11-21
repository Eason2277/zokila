import type { ItineraryDraft, StopKind, EvidenceStatus } from "./itinerary.ts";

// 把行程数据里的类别转换为用户看到的中文名称
const kindLabels: Record<StopKind, string> = {
    sight: "景点",
    meal: "用餐",
    transport: "交通",
    activity: "活动",
    rest: "休息",
};

const statusLabels: Record<EvidenceStatus, string> = {
    sourced: "有来源",
    unverified: "待核查",
    inferred: "建议"
}







export function ItineraryView({ draft } : { draft: ItineraryDraft}) {
    // 1. 顶部条件： 目的地，日期，人数，节奏，预算
    // 2. draft.days.map 渲染每一天，再 map 每个stop
    // 3. draft.assumpitions / openQuestions / warnings / budgetNotes 各渲染一个小列表
    return (
        <div>
			<h2>
                {draft.request.destination} · {draft.days.length} 天行程
            </h2>

            <p>
                {draft.request.startDate} 至 {draft.request.endDate} · {draft.request.partySize} 人
            </p>
            {/*draft.days.map 渲染每一天，再 map 每个stop*/}
            {draft.days.map((day) => (
                <div key={day.date}>
                    <h3>
                        {day.date}
                    </h3>

                    <ul>
                        {day.stops.map((stop) => (
                            <li key={stop.id}>
                                {stop.startTime ?? "待定"} · {stop.title} · {kindLabels[stop.kind]} {statusLabels[stop.status]}
                                <div>
                                    {stop.sources.length === 0 ? "无来源" :
                                        stop.sources.map((source) => `${source.label} (${source.retrievedAt.slice(0, 10)})`).join("、")}
                                </div>


                                    {stop.userConfirmed &&  <div>已确认</div>}

                            </li>



                        ))}
                    </ul>

                </div>
            ))}


            <section>
                <h3>
                    行程假设
                </h3>

                <ul>
                    {draft.assumptions.map((assumption, index) => (
                        <li key={index}>
                            {assumption}
                        </li>
                    ))}
                </ul>
            </section>
		</div>
    )
}
