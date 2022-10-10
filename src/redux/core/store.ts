import { configureStore } from "@reduxjs/toolkit";
import { saveState, loadState } from "../actions/localSave";
import gameAccountReducer from "../gameAccount";
import taskTimeStampReducer from "../taskTimeStamp";

export const store = configureStore({
    reducer: {
        gameAccount: gameAccountReducer,
        taskTimeStamp: taskTimeStampReducer,
    },
    preloadedState: loadState(),
});

store.subscribe(() => {
    saveState({
        gameAccount: store.getState().gameAccount,
        taskTimeStamp: store.getState().taskTimeStamp,
    });
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
