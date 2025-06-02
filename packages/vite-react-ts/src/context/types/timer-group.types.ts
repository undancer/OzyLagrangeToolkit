// 计时器组相关类型定义
export interface TimerGroupState {
    [index: string]: TimerGroup;
}

export interface TimerGroup {
    accountId: string;

    // Construction Category
    construction: string[];
    baseUpgrade: string[];

    // Shipyard Category
    ship: string[];
    miner: string[];
    capitalShip: string[];

    // Research Category
    research: string[];
    agreement: string[];
}