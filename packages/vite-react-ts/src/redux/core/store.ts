import { configureStore } from "@reduxjs/toolkit";
import { saveState, loadState } from "../actions/local-save";
import gameAccountReducer from "../game-account";
import taskTimeStampReducer from "../task-time-stamp";
import timerGroupReducer from "../timer-group";
import acquiredBluePrintReducer from "../acquired-blue-print";
import selectedAccountReducer from "../selected-account";
import fleetPlannerReducer from "../fleet-planner";
import angulumCityDataReducer from "../angulum-city-data";

export const store = configureStore({
    reducer: {
        // @ts-ignore can't get type working here
        gameAccount: gameAccountReducer,
        timerGroup: timerGroupReducer,
        taskTimeStamp: taskTimeStampReducer,
        acquiredBluePrint: acquiredBluePrintReducer,
        selectedAccount: selectedAccountReducer,
        fleetPlanner: fleetPlannerReducer,
        angulumCityData: angulumCityDataReducer,
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
        fleetPlanner: store.getState().fleetPlanner,
        angulumCityData: store.getState().angulumCityData,
    });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
