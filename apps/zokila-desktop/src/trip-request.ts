

// 节奏：放松/适中/紧凑
export type TravelPace = "relaxed" | "balanced" | "packed";

export interface Budget {
    amount: number;
    currency: string; // 先不做枚举，比如“CNY”
    scope: "per-person" | "group"
}


export interface TripRequest {
    destination: string;
    startDate: string;
    endDate: string;
    partySize: number;
    pace: TravelPace;
    interests: string[] // 自由文本，目的地不同兴趣词不同
    constraints: string[]; // 用户明确提出的硬约束，如“带老人，少走路”
    budgets?: Budget[]; // 可选 = 用户未提供，由 draft 的 assumptions 承接，空数组等于未知

}
