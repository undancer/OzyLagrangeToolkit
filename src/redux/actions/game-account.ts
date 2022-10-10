import { createAction } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";

export enum TimerType {
    construction = "construction",
    baseUpgrade = "baseUpgrade",
    ship = "ship",
    miner = "miner",
    capitalship = "capitalship",
    research = "research",
    agreement = "agreement",
}

export const addAccount = createAction("addAccount", (name: string) => {
    return {
        payload: {
            name,
            id: uuidV4(),
        },
    };
});

export const removeAccount = createAction("removeAccount", (id: string) => {
    return {
        payload: { id },
    };
});
