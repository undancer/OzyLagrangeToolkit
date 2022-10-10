import { configureStore } from "@reduxjs/toolkit";
import { saveState, loadState } from "../actions/local-save";
import gameAccountReducer from "../game-account";
import taskTimeStampReducer from "../task-time-stamp";
import timerGroupReducer from "../timer-group";

export const store = configureStore({
    reducer: {
        gameAccount: gameAccountReducer,
        timerGroup: timerGroupReducer,
        taskTimeStamp: taskTimeStampReducer,
    },
    preloadedState: loadState(),
});

store.subscribe(() => {
    saveState({
        gameAccount: store.getState().gameAccount,
        taskTimeStamp: store.getState().taskTimeStamp,
        timerGroup: store.getState().timerGroup,
    });
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
