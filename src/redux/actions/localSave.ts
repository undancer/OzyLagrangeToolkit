import { RootState } from "../core/store";

export const saveState = (state: RootState) => {
    try {
        console.log("Saving state");
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
        localStorage.setItem("stateVersion", "1");
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
        if (version === null) {
            Object.keys(parsedState.gameAccount).forEach((key) => {
                delete parsedState.gameAccount[key].battle;
                parsedState.gameAccount[key].agreement = [];
            });
        }
        return parsedState;
    } catch (err) {
        console.warn("Error loading state.");
        throw new Error("Failed to load app state");
    }
}
