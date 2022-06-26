import { createAction } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";

export enum TimerType {
    construction = "construction",
    baseUpgrade = "baseUpgrade",
    ship = "ship",
    miner = "miner",
    capitalship = "capitalship",
    research = "research",
    agreement= "agreement",
}

export const addTimer = createAction("addGameTimer", (accountId: string, type: TimerType, minute: number) => {
    return {
        payload: {
            accountId,
            type,
            id: uuidV4(),
            minute,
        }
    }
});

export const clearTimer = createAction("clearGameTimer", (accountId: string, timerId: string) => {
    return {
        payload: {
            accountId,
            timerId
        }
    }
})