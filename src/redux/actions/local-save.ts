/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "../core/store";

export const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
        localStorage.setItem("stateVersion", "2");
    } catch {
        console.warn("Save state error.");
    }
};

export function loadState() {
    try {
        const serializedState = localStorage.getItem("state");
        const version = localStorage.getItem("stateVersion");
        if (serializedState === null) {
            return undefined;
        }
        const parsedState = JSON.parse(serializedState);
        updateState(version, parsedState);
        return parsedState;
    } catch (err) {
        console.warn("Error loading state.");
        throw new Error("Failed to load app state");
    }
}

function updateState(currentVersion: string | null, state: any): any {
    let version = currentVersion;
    if (version === null) {
        Object.keys(state.gameAccount).forEach((key) => {
            delete state.gameAccount[key].battle;
            state.gameAccount[key].agreement = [];
        });
        version = "1";
    }
    if (version === "1") {
        delete state.operation;
        delete state.operationTimeStamp;
        if (state.timerGroup === undefined) state.timerGroup = {};
        Object.keys(state.gameAccount).forEach((key) => {
            const account = state.gameAccount[key];
            const timerGroup = { ...account };
            delete timerGroup.name;
            const newAccountState = { id: account.id, name: account.name };
            state.timerGroup[key] = timerGroup;
            state.gameAccount[key] = newAccountState;
        });
    }
}
