import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addAccount, removeAccount } from "./actions/game-account";
import {
    AcquiredBluePrints,
    AcquiredBluePrintsState,
    AcquiredShip,
    AcquiredSuperCap,
    AddRemoveModel,
    AddRemoveShipAction,
    AddRemoveSuperCapAction,
    BPDisplayMode,
    UpdateBluePrintSetting,
    UpdateTechPoint,
} from "./types/acquired-blue-print.type";
import { ShipTypes } from "../components/data/ship-data-types";

function emptyAccountData(id: string): AcquiredBluePrints {
    return {
        accountId: id,
        editLock: false,
        displayMode: BPDisplayMode.percent,
        showZeroPercentBluePrint: false,
        superCapitals: [],
        ships: [],
    };
}

const initialState: AcquiredBluePrintsState = {};

export const acquiredBluePrintSlice = createSlice({
    name: "acquiredBluePrint",
    initialState,
    reducers: {
        // Ship Related Actions
        addShip: handleAddShip,
        removeShip: handleRemoveShip,
        updateShipProgress: handleUpdateProgress,
        addSuperCap: handleAddSuperCapital,
        removeSuperCap: handleRemoveSuperCapital,
        updateTechPoint: handleUpdateTechPoint,
        addModel: handleAddModule,
        removeModel: handleRemoveModel,
        changeSetting: updateSetting,
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

export function getAccountByAccountId(state: AcquiredBluePrintsState, id: string): AcquiredBluePrints | undefined {
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
    if (account.editLock) return;

    let ship = account.ships.find((innerShip) => innerShip.id === shipId);
    if (ship === undefined) {
        ship = { id: shipId, techPoint: 0, variants: [], partialComplete: {} };
        account.ships.push(ship);
    }

    ship.variants.push(variant);
    ship.variants.sort();
}

function handleRemoveShip(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveShipAction>) {
    const { accountId, shipId, variant } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    if (account.editLock) return;

    const shipIndex = account.ships.findIndex((innerShip) => innerShip.id === shipId);
    if (shipIndex === -1) return;
    const ship = account.ships[shipIndex];

    const index = ship.variants.findIndex((savedVariant) => savedVariant === variant);
    if (index !== -1) ship.variants.splice(index, 1);

    if (ship.variants.length <= 0) account.ships.splice(shipIndex, 1);
}

function handleAddSuperCapital(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveSuperCapAction>) {
    const { accountId, superCapId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    if (account.editLock) return;

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
    if (account.editLock) return;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return;

    account.superCapitals.splice(superCapitalsIndex, 1);
}

function handleAddModule(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveModel>) {
    const { accountId, superCapId, moduleId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    if (account.editLock) return;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return;

    account.superCapitals[superCapitalsIndex].modules.push(moduleId);
}

function handleRemoveModel(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveModel>) {
    const { accountId, superCapId, moduleId } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    if (account.editLock) return;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return;

    const modelIndex = account.superCapitals[superCapitalsIndex].modules.findIndex((id) => id === moduleId);

    account.superCapitals[superCapitalsIndex].modules.splice(modelIndex, 1);
}

function handleUpdateTechPoint(state: AcquiredBluePrintsState, action: PayloadAction<UpdateTechPoint>) {
    const { accountId, shipId, shipType, techPoint } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    if (account.editLock) return;

    let bluePrint: AcquiredShip | AcquiredSuperCap | undefined;
    let index = -1;

    switch (shipType) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
        case ShipTypes.aircraft:
        case ShipTypes.bomber:
            index = account.ships.findIndex((ship) => ship.id === shipId);
            if (index !== -1) bluePrint = account.ships[index];
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

function handleUpdateProgress(state: AcquiredBluePrintsState, action: PayloadAction<AddRemoveShipAction>) {
    const { accountId, shipId, variant } = action.payload;

    let increment = 20;
    if (shipId.startsWith("f")) increment = 25;
    else if (shipId.startsWith("d") || shipId.startsWith("e")) increment = 35;
    else if (shipId.startsWith("c")) increment = 20;
    if (shipId === "c4" || shipId === "c6") increment = 35;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    if (account.editLock) return;

    const shipIndex = account.ships.findIndex((innerShip) => innerShip.id === shipId);
    if (shipIndex === -1) return;
    const ship = account.ships[shipIndex];

    // initialize the variables if they don't exist yet
    if (ship.partialComplete === undefined) ship.partialComplete = {};
    if (ship.partialComplete[variant] === undefined) ship.partialComplete[variant] = 0;

    ship.partialComplete[variant] += increment;

    if (ship.partialComplete[variant] >= 100) {
        ship.partialComplete[variant] = 0;
    }
}

function updateSetting(state: AcquiredBluePrintsState, action: PayloadAction<UpdateBluePrintSetting>) {
    const { accountId, editLock, displayMode, showZeroPercent } = action.payload;

    const account = getAccountByAccountId(state, accountId);
    if (!account) return;
    state[accountId].displayMode = displayMode;
    state[accountId].editLock = editLock;
    state[accountId].showZeroPercentBluePrint = showZeroPercent;
}

// Action exports
export const {
    addShip,
    removeShip,
    updateShipProgress,
    addSuperCap,
    removeSuperCap,
    updateTechPoint,
    addModel,
    removeModel,
    changeSetting,
} = acquiredBluePrintSlice.actions;

export default acquiredBluePrintSlice.reducer;
