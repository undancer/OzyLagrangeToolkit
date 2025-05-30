/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./core/store";
import { addTimer, clearTimer } from "./actions/game-timer";
import { TaskTimeStampState } from "./types/task-time-stamp.types";

const initialState: TaskTimeStampState = {};

export const taskTimeStampSlice = createSlice({
    name: "gameTimers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTimer, (state, action) => {
            const startTime = new Date().getTime();
            const { id, minute } = action.payload;
            state[id] = { id, duration: minute * 1000 * 60, startTime };
        });
        builder.addCase(clearTimer, (state, action) => {
            if (state[action.payload.timerId]) {
                delete state[action.payload.timerId];
            } else {
                console.warn(`Removing non-existing task timer, id: ${action.payload.timerId}`);
            }
        });
    },
});

export const selectTimer = (state: RootState, id: string) => {
    if (state.taskTimeStamp[id]) return state.taskTimeStamp[id];
    console.warn(`Can not find timer with id: ${id}`);
    return { id, duration: 0, startTime: 0 };
};

export default taskTimeStampSlice.reducer;
