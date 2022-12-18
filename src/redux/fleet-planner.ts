import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShipTypes } from "../components/data/ship-data-types";
import { addAccount, removeAccount } from "./actions/game-account";
import { AvailableShipTypes, FleetAction } from "./types/fleet-planner.type";

interface FleetPlannerState {
    [index: string]: FleetPlan;
}

interface FleetPlan {
    accountId: string;
    availableShipTypes: ShipTypes[];
    shipIgnoreList: string[];
    maxPopulation: number;
    currentFleet: number;
    fleetLimit: number;
    fleets: Fleet[];
}

interface Fleet {
    name: string;
    mainFleet: ShipInFleet[];
    reinforcement: ShipInFleet[];
}

interface ShipInFleet {
    id: string;
    variant: string;
    count: string;
}

function emptyAccountData(id: string): FleetPlan {
    return {
        accountId: id,
        availableShipTypes: [
            ShipTypes.carrier,
            ShipTypes.battleCruiser,
            ShipTypes.cruiser,
            ShipTypes.destroyer,
            ShipTypes.frigate,
            ShipTypes.corvette,
            ShipTypes.aircraft,
        ],
        shipIgnoreList: [],
        maxPopulation: 1400,
        fleetLimit: 300,
        currentFleet: -1,
        fleets: [],
    };
}

const initialState: FleetPlannerState = {};

export const fleetPlannerSlice = createSlice({
    name: "fleetPlanner",
    initialState,
    reducers: {
        updateAvailableShipTypes: handleUpdateAvailableShipTypes,
        addFleet: handleAddFleet,
    },
    extraReducers: (builder) => {
        builder.addCase(addAccount, (state, action) => {
            const { id } = action.payload;
            state[id] = emptyAccountData(id);
        });
        builder.addCase(removeAccount, (state, action) => {
            const { id } = action.payload;
            if (id) delete state[id];
        });
    },
});

function createAccount(state: FleetPlannerState, id: string): FleetPlan {
    state[id] = emptyAccountData(id);
    return state[id];
}

function handleUpdateAvailableShipTypes(state: FleetPlannerState, action: PayloadAction<AvailableShipTypes>) {
    const { id, types } = action.payload;
    let account = state[id];
    if (!account) account = createAccount(state, id);
    account.availableShipTypes = types.sort();
}

function handleAddFleet(state: FleetPlannerState, action: PayloadAction<FleetAction>) {
    const { id, name } = action.payload;
    let account = state[id];
    if (!account) account = createAccount(state, id);
    account.fleets.push({ name, mainFleet: [], reinforcement: [] });
}

export const { updateAvailableShipTypes } = fleetPlannerSlice.actions;

export default fleetPlannerSlice.reducer;
