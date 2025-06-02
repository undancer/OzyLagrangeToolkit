// 任务时间戳相关类型定义
export interface TaskTimeStampState {
    [index: string]: TaskTimeStamp;
}

export interface TaskTimeStamp {
    id: string;
    duration: number;
    startTime: number;
}