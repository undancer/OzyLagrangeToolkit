// 安古鲁姆城市数据相关类型定义
export interface City {
    id: string;
    name: string;
    // 添加其他城市属性
}

export interface AngulumCityDataState {
    requestState: "idle" | "loading" | "succeeded" | "failed";
    cities: City[];
    error: string | undefined;
    selectedIndex?: number;
}