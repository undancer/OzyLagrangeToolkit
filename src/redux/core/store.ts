import { configureStore } from "@reduxjs/toolkit";
import { saveState, loadState } from "../actions/localSave";
import gameAccountReducer from "../gameAccount";
import taskTimeStampReducer from "../taskTimeStamp";
import operationReducer from "../operations";
import operationTimeStampReducer from "../operationTimeStamp";

export const store = configureStore({
    reducer: {
        gameAccount: gameAccountReducer,
        taskTimeStamp: taskTimeStampReducer,
        operation: operationReducer,
        operationTimeStamp: operationTimeStampReducer,
    },
    preloadedState: loadState(),
});

store.subscribe(() => {
    saveState({
        gameAccount: store.getState().gameAccount,
        taskTimeStamp: store.getState().taskTimeStamp,
        operation: store.getState().operation,
        operationTimeStamp: store.getState().operationTimeStamp,
    });
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
