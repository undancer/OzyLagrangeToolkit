import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./core/store";
import { addAccount, removeAccount } from "./actions/game-account";

interface AcquiredBluePrintsState {
    [index: string]: AcquiredBluePrints;
}

interface AcquiredBluePrints {
    accountId: string;
    superCapitals: AcquiredSuperCap[];
    ships: AcquiredShip[];
    aircraft: AcquiredAircraft[];
}

interface AcquiredSuperCap {
    id: string;
    techPoint: number;
    modules: string[];
}

interface AcquiredShip {
    id: string;
    techPoint: number;
    variantIndex: number[];
}

interface AcquiredAircraft {
    id: string;
    techPoint: number;
}

function emptyData(id: string): AcquiredBluePrints {
    return { accountId: id, superCapitals: [], ships: [], aircraft: [] };
}

const initialState: AcquiredBluePrintsState = {};

export const timerGroupSlice = createSlice({
    name: "timerGroup",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addAccount, (state, action) => {
            const { id } = action.payload;
            state[id] = emptyData(id);
        });
        builder.addCase(removeAccount, (state, action) => {
            const { id } = action.payload;
            if (id) delete state[id];
        });
    },
});

// Selectors
export const selectAllAcquiredBluePrints = (state: RootState) =>
    Object.keys(state.acquiredBluePrint).map((key) => state.acquiredBluePrint[key]);
export const selectAcquiredBluePrint = (state: RootState, id: string) => state.acquiredBluePrint[id];

export default timerGroupSlice.reducer;
