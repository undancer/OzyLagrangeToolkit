import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { lookUpShipById } from "../components/data/ship-data";
import { ShipTypes } from "../components/data/ship-data-types";
import { addAccount, removeAccount } from "./actions/game-account";
import {
    AddShip,
    AvailableShipTypes,
    FleetAction,
    EditRemoveShipOrAircraft,
    SelectedFleet,
    FleetPlannerSettings,
    FleetNameChange,
    RemoveFleet,
    FleetPlan,
    FleetPlannerState,
    FleetType,
    FleetPlannerSetting,
} from "./types/fleet-planner.type";

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
        onlyDisplayOwned: true,
        displayControl: true,
        mainModuleFirst: false,
        selectedFleet: { index: -1, type: FleetType.main },
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
        removeFleet: handleRemoveFleet,
        addShip: handleAddShip,
        addAircraft: handleAddAircraft,
        removeShipOrAircraft: handleRemoveShipOrAircraft,
        changeSelectedFleet: handleChangeSelectedFleet,
        increaseShipCount: handleIncreaseShipCount,
        decreaseShipCount: handleDecreateShipCount,
        flipLeveledFlag: handleFlipLeveledFlag,
        flipAdjustedFlag: handleFlipAdjustedFlag,
        updateSettings: handleUpdateSetting,
        changeFleetName: handleChangeFleetName,
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
    const { accountId, types } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    account.availableShipTypes = types.sort();
}

function handleAddFleet(state: FleetPlannerState, action: PayloadAction<FleetAction>) {
    const { accountId, name } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    account.fleets.push({ name, mainFleet: [], reinforcement: [], aircraft: [] });
    if (account.selectedFleet.index === -1) account.selectedFleet.index = 0;
}

function handleRemoveFleet(state: FleetPlannerState, action: PayloadAction<RemoveFleet>) {
    const { accountId, index } = action.payload;
    const account = state[accountId];
    if (!account) return;
    account.fleets.splice(index, 1);
    if (account.fleets.length < 1) account.selectedFleet.index = -1;
    else if (account.selectedFleet.index >= account.fleets.length) account.selectedFleet.index = account.fleets.length;
}

function handleAddShip(state: FleetPlannerState, action: PayloadAction<AddShip>) {
    const { accountId, shipId, variant } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    const selectedFleet = account.fleets[account.selectedFleet.index];
    const shipData = lookUpShipById(shipId);
    if (!shipData) return; // This should never happened

    if (account.selectedFleet.type === FleetType.main) {
        const { mainFleet } = selectedFleet;
        if (mainFleet.findIndex((ship) => ship.shipId === shipId && ship.variant === variant) === -1)
            mainFleet.push({ shipId, variant, count: shipData.limit, adjusted: false, leveled: false });
    } else if (account.selectedFleet.type === FleetType.reinforcement) {
        const { reinforcement } = selectedFleet;
        if (reinforcement.findIndex((ship) => ship.shipId === shipId && ship.variant === variant) === -1)
            reinforcement.push({ shipId, variant, count: shipData.limit, adjusted: false, leveled: false });
    }
}

function handleRemoveShipOrAircraft(state: FleetPlannerState, action: PayloadAction<EditRemoveShipOrAircraft>) {
    const { accountId, type, fleetIndex, shipIndex } = action.payload;
    const account = state[accountId];
    if (!account) return;
    const selectedFleet = account.fleets[fleetIndex];
    if (type === FleetType.main) {
        selectedFleet.mainFleet.splice(shipIndex, 1);
    } else if (type === FleetType.reinforcement) {
        selectedFleet.reinforcement.splice(shipIndex, 1);
    } else if (type === FleetType.aircraft) {
        selectedFleet.aircraft.splice(shipIndex, 1);
    }
}

function handleAddAircraft(state: FleetPlannerState, action: PayloadAction<AddShip>) {
    const { accountId, shipId, variant } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    const selectedFleet = account.fleets[account.selectedFleet.index];
    const shipData = lookUpShipById(shipId);
    if (!shipData) return; // This should never happened

    const { aircraft } = selectedFleet;
    if (aircraft.findIndex((plane) => plane.shipId === shipId && plane.variant === variant) === -1)
        aircraft.push({ shipId, variant, count: shipData.limit, distribution: [], adjusted: false, leveled: false });
    aircraft.sort((aircraftA, aircraftB) => {
        return aircraftA.shipId[0].localeCompare(aircraftB.shipId[0]);
    });
}

function handleChangeSelectedFleet(state: FleetPlannerState, action: PayloadAction<SelectedFleet>) {
    const { accountId, index, type } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    account.selectedFleet = { index, type };
}

function handleIncreaseShipCount(state: FleetPlannerState, action: PayloadAction<EditRemoveShipOrAircraft>) {
    const { accountId, type, fleetIndex, shipIndex } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    const selectedFleet = account.fleets[fleetIndex];
    if (type === FleetType.main) {
        selectedFleet.mainFleet[shipIndex].count += 1;
    } else if (type === FleetType.reinforcement) {
        selectedFleet.reinforcement[shipIndex].count += 1;
    } else if (type === FleetType.aircraft) {
        selectedFleet.aircraft[shipIndex].count += 1;
    }
}

function handleDecreateShipCount(state: FleetPlannerState, action: PayloadAction<EditRemoveShipOrAircraft>) {
    const { accountId, type, fleetIndex, shipIndex } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    const selectedFleet = account.fleets[fleetIndex];
    if (type === FleetType.main) {
        selectedFleet.mainFleet[shipIndex].count -= 1;
    } else if (type === FleetType.reinforcement) {
        selectedFleet.reinforcement[shipIndex].count -= 1;
    } else if (type === FleetType.aircraft) {
        selectedFleet.aircraft[shipIndex].count -= 1;
    }
}

function handleFlipAdjustedFlag(state: FleetPlannerState, action: PayloadAction<EditRemoveShipOrAircraft>) {
    const { accountId, type, fleetIndex, shipIndex } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    const selectedFleet = account.fleets[fleetIndex];
    if (type === FleetType.main) {
        selectedFleet.mainFleet[shipIndex].adjusted = !selectedFleet.mainFleet[shipIndex].adjusted;
    } else if (type === FleetType.reinforcement) {
        selectedFleet.reinforcement[shipIndex].adjusted = !selectedFleet.reinforcement[shipIndex].adjusted;
    } else if (type === FleetType.aircraft) {
        selectedFleet.aircraft[shipIndex].adjusted = !selectedFleet.aircraft[shipIndex].adjusted;
    }
}

function handleFlipLeveledFlag(state: FleetPlannerState, action: PayloadAction<EditRemoveShipOrAircraft>) {
    const { accountId, type, fleetIndex, shipIndex } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    const selectedFleet = account.fleets[fleetIndex];
    if (type === FleetType.main) {
        selectedFleet.mainFleet[shipIndex].leveled = !selectedFleet.mainFleet[shipIndex].leveled;
    } else if (type === FleetType.reinforcement) {
        selectedFleet.reinforcement[shipIndex].leveled = !selectedFleet.reinforcement[shipIndex].leveled;
    } else if (type === FleetType.aircraft) {
        selectedFleet.aircraft[shipIndex].leveled = !selectedFleet.aircraft[shipIndex].leveled;
    }
}

function handleUpdateSetting(state: FleetPlannerState, action: PayloadAction<FleetPlannerSettings>) {
    const { accountId, settings } = action.payload;
    let account = state[accountId];
    if (!account) account = createAccount(state, accountId);
    if (settings.findIndex((value) => value === FleetPlannerSetting.DisplayOwned) !== -1)
        account.onlyDisplayOwned = true;
    else account.onlyDisplayOwned = false;
    if (settings.findIndex((value) => value === FleetPlannerSetting.DisplayControl) !== -1)
        account.displayControl = true;
    else account.displayControl = false;
    if (settings.findIndex((value) => value === FleetPlannerSetting.MainModuleFirst) !== -1)
        account.mainModuleFirst = true;
    else account.mainModuleFirst = false;
}

function handleChangeFleetName(state: FleetPlannerState, action: PayloadAction<FleetNameChange>) {
    const { accountId, fleetIndex, name } = action.payload;

    const account = state[accountId];
    if (!account) return;
    const selectedFleet = account.fleets[fleetIndex];
    selectedFleet.name = name;
}

export const {
    updateAvailableShipTypes,
    addFleet,
    removeFleet,
    addShip,
    addAircraft,
    removeShipOrAircraft,
    changeSelectedFleet,
    increaseShipCount,
    decreaseShipCount,
    flipAdjustedFlag,
    flipLeveledFlag,
    updateSettings,
    changeFleetName,
} = fleetPlannerSlice.actions;

export default fleetPlannerSlice.reducer;
