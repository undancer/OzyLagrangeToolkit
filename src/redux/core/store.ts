import { configureStore } from "@reduxjs/toolkit";
import { saveState, loadState } from "../actions/local-save";
import gameAccountReducer from "../game-account";
import taskTimeStampReducer from "../task-time-stamp";
import timerGroupReducer from "../timer-group";
import acquiredBluePrintReducer from "../acquired-blue-print";
import selectedAccountReducer from "../selected-account";

export const store = configureStore({
    reducer: {
        gameAccount: gameAccountReducer,
        timerGroup: timerGroupReducer,
        taskTimeStamp: taskTimeStampReducer,
        acquiredBluePrint: acquiredBluePrintReducer,
        selectedAccount: selectedAccountReducer,
    },
    preloadedState: loadState(),
});

store.subscribe(() => {
    saveState({
        gameAccount: store.getState().gameAccount,
        taskTimeStamp: store.getState().taskTimeStamp,
        timerGroup: store.getState().timerGroup,
        acquiredBluePrint: store.getState().acquiredBluePrint,
        selectedAccount: store.getState().selectedAccount,
    });
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
