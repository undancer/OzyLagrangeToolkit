import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./core/store";
import { addTimer, clearTimer, TimerType } from "./actions/game-timer";
import { addAccount, removeAccount } from "./actions/game-account";
import { removeElementByValue } from "./utils/arrayhelper";

interface TimerGroupState {
    [index: string]: TimerGroup;
}

interface TimerGroup {
    accountId: string;

    // Construction Category
    construction: string[];
    baseUpgrade: string[];

    // Shipyard Category
    ship: string[];
    miner: string[];
    capitalShip: string[];

    // Research Category
    research: string[];
    agreement: string[];
}

function emptyTimerGrup(id: string): TimerGroup {
    return {
        accountId: id,
        construction: [],
        baseUpgrade: [],
        ship: [],
        miner: [],
        capitalShip: [],
        research: [],
        agreement: [],
    };
}

const initialState: TimerGroupState = {};

export const timerGroupSlice = createSlice({
    name: "timerGroup",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addAccount, (state, action) => {
            const { id } = action.payload;
            state[id] = emptyTimerGrup(id);
        });
        builder.addCase(removeAccount, (state, action) => {
            const { id } = action.payload;
            if (id) delete state[id];
        });
        builder.addCase(addTimer, (state, action) => {
            const { accountId, type, id } = action.payload;
            const account = state[accountId];
            switch (type) {
                case TimerType.baseUpgrade:
                    account.baseUpgrade.push(id);
                    break;
                case TimerType.construction:
                    account.construction.push(id);
                    break;
                case TimerType.ship:
                    account.ship.push(id);
                    break;
                case TimerType.miner:
                    account.miner.push(id);
                    break;
                case TimerType.capitalship:
                    account.capitalShip.push(id);
                    break;
                case TimerType.research:
                    account.research.push(id);
                    break;
                case TimerType.agreement:
                    account.agreement.push(id);
                    break;
                default:
                    console.warn("Case not supported.");
            }
        });
        builder.addCase(clearTimer, (state, action) => {
            const { accountId, timerId } = action.payload;
            const account = state[accountId];

            if (!account) {
                console.warn(`ClearTimer with non-existing accountId: ${accountId}`);
                return;
            }

            // Construction Category
            removeElementByValue(account.construction, timerId);
            removeElementByValue(account.baseUpgrade, timerId);

            // Ship Yard Category
            removeElementByValue(account.ship, timerId);
            removeElementByValue(account.miner, timerId);
            removeElementByValue(account.capitalShip, timerId);

            // Research Category
            removeElementByValue(account.research, timerId);
            removeElementByValue(account.agreement, timerId);
        });
    },
});

// Selectors
export const selectAllTimerGroups = (state: RootState) =>
    Object.keys(state.timerGroup).map((key) => state.timerGroup[key]);
export const selectTimerGroup = (state: RootState, id: string) => state.timerGroup[id];

export default timerGroupSlice.reducer;
