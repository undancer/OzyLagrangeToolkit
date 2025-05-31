import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./core/store";
import { addAccount, removeAccount } from "./actions/game-account";
import { AccountNameChangeAction, GameAccountState } from "./types/game-account.type";

const initialState: GameAccountState = {};

export const gameAccountSlice = createSlice({
    name: "gameAccount",
    initialState,
    reducers: {
        changeAccountName: (state, action: PayloadAction<AccountNameChangeAction>) => {
            const { id, name } = action.payload;
            state[id].name = name;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addAccount, (state, action) => {
            const { id } = action.payload;
            state[id] = { ...action.payload };
        });
        builder.addCase(removeAccount, (state, action) => {
            const { id } = action.payload;
            if (id) delete state[id];
        });
    },
});

export const selectAllAccounts = (state: RootState) =>
    Object.keys(state.gameAccount).map((key) => state.gameAccount[key]);
export const selectAccount = (state: RootState, id: string) => state.gameAccount[id];

export default gameAccountSlice.reducer;
export const { changeAccountName } = gameAccountSlice.actions;
