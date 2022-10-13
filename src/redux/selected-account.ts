import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addAccount, removeAccount } from "./actions/game-account";
import { RootState } from "./core/store";

export interface SelectedAccountState {
    accountId: string;
}

const initialState: SelectedAccountState = { accountId: "" };

export const selectedAccountSlice = createSlice({
    name: "selectedAccount",
    initialState,
    reducers: {
        changeSelectedAccount: (state, action: PayloadAction<string>) => {
            state.accountId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addAccount, (state, action) => {
            const { id } = action.payload;
            if (state.accountId === "") state.accountId = id;
        });
        builder.addCase(removeAccount, (state, action) => {
            const { id, subId } = action.payload;
            if (id === state.accountId) state.accountId = subId;
        });
    },
});

export const getSelectedAccountId = (state: RootState) => state.selectedAccount.accountId;

export const { changeSelectedAccount } = selectedAccountSlice.actions;

export default selectedAccountSlice.reducer;
