import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";
import { RootState } from "./core/store";
import { addTimer, clearTimer, TimerType } from "./actions/gameTimer";
import { removeElementByValue } from "./utils/arrayhelper";

interface GameAccountState {
    [index: string]: GameAccount;
}

interface GameAccount {
    id: string;
    name: string;

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

function emptyGameAccount(name: string, id: string): GameAccount {
    return {
        id,
        name,
        construction: [],
        baseUpgrade: [],
        ship: [],
        miner: [],
        capitalShip: [],
        research: [],
        agreement: [],
    };
}

const initialState: GameAccountState = {};

export const gameAccountSlice = createSlice({
    name: "gameAccount",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            const id = uuidV4();
            state[id] = emptyGameAccount(action.payload, id);
        },
        remove: (state, action: PayloadAction<string>) => {
            const allAccountId = Object.keys(state);
            // Find the accountId by user provided name, case doesn't matter
            const accountId = allAccountId.find((id) => state[id].name.toLowerCase() === action.payload.toLowerCase());
            if (accountId) delete state[accountId];
        },
    },
    extraReducers: (builder) => {
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
                    console.log("Case not supported.");
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

export const { add, remove } = gameAccountSlice.actions;

export const selectAllAccounts = (state: RootState) =>
    Object.keys(state.gameAccount).map((key) => state.gameAccount[key]);
export const selectAccount = (state: RootState, id: string) => state.gameAccount[id];

export default gameAccountSlice.reducer;
