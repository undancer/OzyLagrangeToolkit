import { RootState } from "../core/store";

export interface VersionedState {
    state: RootState;
    stateVersion: string;
}

export function getStateExportLink(state: RootState): string {
    const versionedState: VersionedState = { state, stateVersion: "6" };
    const serilizedState = JSON.stringify(versionedState);
    const bb = new Blob([serilizedState], { type: "text/plain" });
    const url = window.URL.createObjectURL(bb);
    return url;
}

export function importStateIntoLocalStorage(file: File) {
    const reader = new FileReader();
    reader.onload = (evt) => {
        if (!evt?.target?.result) {
            return;
        }

        const { result } = evt.target;
        const data: VersionedState = JSON.parse(result as string);
        console.log(data);
        try {
            const serializedState = JSON.stringify(data.state);
            localStorage.setItem("state", serializedState);
            localStorage.setItem("stateVersion", data.stateVersion);
        } catch {
            console.warn("Save state error.");
        }
    };
    reader.readAsBinaryString(file);
}
