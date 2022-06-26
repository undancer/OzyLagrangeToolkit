import { createAction } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";

export enum OperationTimerType {
    move = "move",
    outpost = "outpost",
    platform = "platform",
    reinforce = "reinforce",
    repair = "repair"
}

export const addTimer = createAction("addOperationTimer", (participantId: string, type: OperationTimerType, minute: number) => {
    return {
        payload: {
            participantId,
            type,
            id: uuidV4(),
            minute,
        }
    }
});

export const clearTimer = createAction("clearOperationTimer", (participantId: string, timerId: string) => {
    return {
        payload: {
            participantId,
            timerId
        }
    }
})