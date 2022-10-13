import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./core/store";
import { addAccount, removeAccount } from "./actions/game-account";
import {
    AcquiredAircraft,
    AcquiredShip,
    AcquiredSuperCap,
    AddRemoveAircraftAction,
    AddRemoveModel,
    AddRemoveShipAction,
    AddRemoveSuperCapAction,
    UpdateTechPoint,
} from "./types/acquired-blue-print.type";
import { ShipTypes } from "../components/data/ship-data-types";

interface AcquiredBluePrintsState {
    [index: string]: AcquiredBluePrints;
}

interface AcquiredBluePrints {
    accountId: string;
    superCapitals: AcquiredSuperCap[];
    ships: AcquiredShip[];
    aircraft: AcquiredAircraft[];
}

function emptyAccountData(id: string): AcquiredBluePrints {
    return { accountId: id, superCapitals: [], ships: [], aircraft: [] };
}

const initialState: AcquiredBluePrintsState = {};

export const timerGroupSlice = createSlice({
    name: "timerGroup",
    initialState,
    reducers: {
        // Ship Related Actions
        addShip: handleAddShip,
        removeShip: handleRemoveShip,
        addAircraft: handleAddAircraft,
        removeAircraft: handleRemoveAircraft,
        addSuperCap: handleAddSuperCapital,
        removeSuperCap: handleRemoveSuperCapital,
        updateTechPoint: handleUpdateTechPoint,
        addModel: handleAddModule,
        removeModel: handleRemoveModel,
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

function getAccountByAccountId(state: AcquiredBluePrintsState, id: string): AcquiredBluePrints | undefined {
    if (state[id] === undefined) {
        console.warn(`Can't find accountId ${id} for acquired ship.`);
        return undefined;
    }
    return state[id];
}

function handleAddShip(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveShipAction>) {
    const { accountId, shipId, variant } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    let ship = account.ships.find((innerShip) => innerShip.id === shipId);
    if (ship === undefined) {
        ship = { id: shipId, techPoint: 0, variants: [] };
        account.ships.push(ship);
    }

    ship.variants.push(variant);
    ship.variants.sort();
}

function handleRemoveShip(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveShipAction>) {
    const { accountId, shipId, variant } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    const shipIndex = account.ships.findIndex((innerShip) => innerShip.id === shipId);
    if (shipIndex === -1) return;
    const ship = account.ships[shipIndex];

    const index = ship.variants.findIndex((savedVariant) => savedVariant === variant);
    if (index !== -1) ship.variants.splice(index, 1);

    if (ship.variants.length <= 0) account.ships.splice(shipIndex, 1);
}

function handleAddAircraft(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveAircraftAction>) {
    const { accountId, aircraftId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    let aircraft = account.aircraft.find((craft) => craft.id === aircraftId);
    if (aircraft === undefined) {
        aircraft = { id: aircraftId, techPoint: 0 };
        account.aircraft.push(aircraft);
    }
}

function handleRemoveAircraft(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveAircraftAction>) {
    const { accountId, aircraftId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    const aircraftIndex = account.aircraft.findIndex((craft) => craft.id === aircraftId);
    if (aircraftIndex === -1) return;

    account.aircraft.splice(aircraftIndex, 1);
}

function handleAddSuperCapital(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveSuperCapAction>) {
    const { accountId, superCapId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    let superCapitals = account.superCapitals.find((craft) => craft.id === superCapId);
    if (superCapitals === undefined) {
        superCapitals = { id: superCapId, techPoint: 0, modules: [] };
        account.superCapitals.push(superCapitals);
    }
}

function handleRemoveSuperCapital(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveSuperCapAction>) {
    const { accountId, superCapId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return;

    account.superCapitals.splice(superCapitalsIndex, 1);
}

function handleAddModule(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveModel>) {
    const { accountId, superCapId, moduleId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return;

    account.superCapitals[superCapitalsIndex].modules.push(moduleId);
}

function handleRemoveModel(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveModel>) {
    const { accountId, superCapId, moduleId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return;

    const modelIndex = account.superCapitals[superCapitalsIndex].modules.findIndex((id) => id === moduleId);

    account.superCapitals[superCapitalsIndex].modules.splice(modelIndex, 1);
}

function handleUpdateTechPoint(state: AcquiredBluePrintsState, action: PayloadAction<UpdateTechPoint>) {
    const { accountId, shipId, shipType, techPoint } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;

    let bluePrint: AcquiredAircraft | AcquiredShip | AcquiredSuperCap | undefined;
    let index = -1;

    switch (shipType) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
            index = account.ships.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.ships[index];
            break;
        case ShipTypes.aircraft:
            index = account.aircraft.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.aircraft[index];
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            index = account.superCapitals.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.superCapitals[index];
            break;
        default:
        // Do nothing
    }

    // Couldn't find the ship
    if (bluePrint === undefined) return;

    bluePrint.techPoint = techPoint;
}

// Selectors
export const selectAllAcquiredBluePrints = (state: RootState) =>
    Object.keys(state.acquiredBluePrint).map((key) => state.acquiredBluePrint[key]);
export const selectAcquiredBluePrint = (state: RootState, id: string) => state.acquiredBluePrint[id];

export function hasShipVariant(state: RootState, accountId: string, shipId: string, variant: number) {
    const localState = state.acquiredBluePrint;
    // Verify account exist
    const bluePrints = localState[accountId];
    if (bluePrints === undefined) return false;
    // Verify ship exist
    const shipIndex = bluePrints.ships.findIndex((ship) => ship.id === shipId);
    if (shipIndex === -1) return false;
    // Verify variant exist
    const { variants } = bluePrints.ships[shipIndex];
    const variantIndex = variants.findIndex((local) => local === variant);
    if (variantIndex === -1) return false;
    return true;
}

export function hasAircraft(state: RootState, accountId: string, aircraftId: string) {
    const localState = state.acquiredBluePrint;
    // Verify account exist
    const bluePrints = localState[accountId];
    if (bluePrints === undefined) return false;
    // Verify aircraft exist
    const aircraftIndex = bluePrints.aircraft.findIndex((aircraft) => aircraft.id === aircraftId);
    if (aircraftIndex === -1) return false;
    return true;
}

export function hasSuperCap(state: RootState, accountId: string, superCapId: string) {
    const localState = state.acquiredBluePrint;
    // Verify account exist
    const bluePrints = localState[accountId];
    if (bluePrints === undefined) return false;
    // Verify aircraft exist
    const superCapIndex = bluePrints.superCapitals.findIndex((ship) => ship.id === superCapId);
    if (superCapIndex === -1) return false;
    return true;
}

export function hasModule(state: RootState, accountId: string, superCapId: string, moduleId: string) {
    const localState = state.acquiredBluePrint;

    const account = getAccountByAccountId(localState, accountId);
    if (!account) return false;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return false;

    const modelIndex = account.superCapitals[superCapitalsIndex].modules.findIndex((id) => id === moduleId);
    if (modelIndex === -1) return false;
    return true;
}

export function techpointByAccount(state: RootState, accountId: string, type: ShipTypes, shipId: string) {
    const localState = state.acquiredBluePrint;

    const account = getAccountByAccountId(localState, accountId);
    if (!account) return 0;

    let bluePrint: AcquiredAircraft | AcquiredShip | AcquiredSuperCap | undefined;
    let index = -1;

    switch (type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
            index = account.ships.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.ships[index];
            break;
        case ShipTypes.aircraft:
            index = account.aircraft.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.aircraft[index];
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            index = account.superCapitals.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.superCapitals[index];
            break;
        default:
        // Do nothing
    }

    // Couldn't find the ship
    if (bluePrint === undefined) return -1;

    return bluePrint.techPoint;
}

// Action exports
export const {
    addShip,
    removeShip,
    addAircraft,
    removeAircraft,
    addSuperCap,
    removeSuperCap,
    updateTechPoint,
    addModel,
    removeModel,
} = timerGroupSlice.actions;

export default timerGroupSlice.reducer;
