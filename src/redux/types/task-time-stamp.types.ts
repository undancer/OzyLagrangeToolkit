export interface TaskTimeStampState {
    [index: string]: TaskTimeStamp;
}

interface TaskTimeStamp {
    id: string;
    duration: number;
    startTime: number;
}
