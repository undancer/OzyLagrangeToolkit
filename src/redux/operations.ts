import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";
import { addTimer, clearTimer, OperationTimerType } from "./actions/operationTimer";
import { removeElementByValue } from "./utils/arrayhelper";
import { RootState } from "./core/store";

interface OperationState {
    [index: string]: Participant;
}

interface Participant {
    id: string;
    name: string;
    move: string[];
    outpost: string[];
    platform: string[];
    reinforce: string[];
    repair: string[];
}

const initialState: OperationState = {};

export const operationTimerSlice = createSlice({
    name: "operationTimeStamp",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            const id = uuidV4();
            state[id] = {
                id,
                name: action.payload,
                move: [],
                outpost: [],
                platform: [],
                reinforce: [],
                repair: [],
            };
        },
        remove: (state, action: PayloadAction<string>) => {
            if (state[action.payload]) delete state[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTimer, (state, action) => {
            const { participantId, type, id } = action.payload;
            const participant = state[participantId];
            switch (type) {
                case OperationTimerType.move:
                    participant.move.push(id);
                    break;
                case OperationTimerType.outpost:
                    participant.outpost.push(id);
                    break;
                case OperationTimerType.platform:
                    participant.platform.push(id);
                    break;
                case OperationTimerType.reinforce:
                    participant.reinforce.push(id);
                    break;
                case OperationTimerType.repair:
                    participant.repair.push(id);
                    break;
                default:
                    console.log("Case not supported.");
            }
        });
        builder.addCase(clearTimer, (state, action) => {
            const { participantId, timerId } = action.payload;
            const participant = state[participantId];

            removeElementByValue(participant.move, timerId);
            removeElementByValue(participant.outpost, timerId);
            removeElementByValue(participant.platform, timerId);
            removeElementByValue(participant.reinforce, timerId);
            removeElementByValue(participant.repair, participantId);
        });
    },
});

export const { add, remove } = operationTimerSlice.actions;

export const selectParticipant = (state: RootState) => state;

export default operationTimerSlice.reducer;
