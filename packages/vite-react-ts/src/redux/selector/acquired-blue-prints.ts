import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../core/store";
import {
    AcquiredShip,
    AcquiredSuperCap,
    BluePrintReport,
    BluePrintSetting,
    BPDisplayMode,
} from "../types/acquired-blue-print.type";
import { ShipTypes, UnitDataWithVariants } from "../../components/data/ship-data-types";
import { UNIT_DATA_BASE } from "../../components/data/ship-data";
import { getAccountByAccountId } from "../acquired-blue-print";

export function selectAllAcquiredBluePrints(state: RootState) {
    return Object.keys(state.acquiredBluePrint).map((key) => state.acquiredBluePrint[key]);
}

export function selectAcquiredBluePrint(state: RootState, id: string) {
    return state.acquiredBluePrint[id];
}

export function bluePrintSettingForSelectedAccount(state: RootState): BluePrintSetting {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;
    const bluePrints = localState[accountId];
    if (bluePrints === undefined)
        return { displayMode: BPDisplayMode.percent, editLock: false, showZeroPercent: false };
    return {
        displayMode: bluePrints.displayMode,
        editLock: bluePrints.editLock,
        showZeroPercent: bluePrints.showZeroPercentBluePrint,
    };
}

export function hasShipVariant(state: RootState, shipId: string, variant: number) {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;
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

export function getShipVariantProgress(state: RootState, shipId: string, variant: number): number {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;
    // Verify account exist
    const bluePrints = localState[accountId];
    if (bluePrints === undefined) return 0;
    // Verify ship exist
    const shipIndex = bluePrints.ships.findIndex((ship) => ship.id === shipId);
    if (shipIndex === -1) return 0;
    // Verify variant exist
    const { partialComplete } = bluePrints.ships[shipIndex];
    if (partialComplete === undefined) return 0;
    if (partialComplete[variant] === undefined) return 0;
    return partialComplete[variant];
}

export function hasSuperCap(state: RootState, superCapId: string) {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;
    // Verify account exist
    const bluePrints = localState[accountId];
    if (bluePrints === undefined) return false;
    // Verify aircraft exist
    const superCapIndex = bluePrints.superCapitals.findIndex((ship) => ship.id === superCapId);
    if (superCapIndex === -1) return false;
    return true;
}

export function hasModule(state: RootState, superCapId: string, moduleId: string) {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;

    const account = getAccountByAccountId(localState, accountId);
    if (!account) return false;

    const superCapitalsIndex = account.superCapitals.findIndex((craft) => craft.id === superCapId);

    if (superCapitalsIndex === -1) return false;

    const modelIndex = account.superCapitals[superCapitalsIndex].modules.findIndex((id) => id === moduleId);
    if (modelIndex === -1) return false;
    return true;
}

function cumulate(shipIds: string[], result: BluePrintReport, ship: UnitDataWithVariants) {
    shipIds.push(ship.id);
    result.totalBluePrint += ship.variants.length;
}

export function techPointByShipType(state: RootState, type: ShipTypes): BluePrintReport {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;

    const account = getAccountByAccountId(localState, accountId);
    const result = { totalTechPoint: 0, acquiredBluePrint: 0, totalBluePrint: 0 };
    if (!account) return result;

    const shipIds: string[] = [];

    switch (type) {
        case ShipTypes.cruiser:
            UNIT_DATA_BASE.cruisers.list.forEach((ship) => cumulate(shipIds, result, ship));
            break;
        case ShipTypes.destroyer:
            UNIT_DATA_BASE.destroyers.list.forEach((ship) => cumulate(shipIds, result, ship));
            break;
        case ShipTypes.frigate:
            UNIT_DATA_BASE.frigates.list.forEach((ship) => cumulate(shipIds, result, ship));
            break;
        case ShipTypes.corvette:
            UNIT_DATA_BASE.corvettes.list.forEach((ship) => cumulate(shipIds, result, ship));
            break;
        case ShipTypes.aircraft:
            UNIT_DATA_BASE.aircrafts.list.forEach((ship) => cumulate(shipIds, result, ship));
            break;
        case ShipTypes.bomber:
            UNIT_DATA_BASE.bombers.list.forEach((ship) => cumulate(shipIds, result, ship));
            break;
        case ShipTypes.battleCruiser:
            UNIT_DATA_BASE.battleCruisers.list.forEach((ship) => shipIds.push(ship.id));
            result.totalBluePrint += UNIT_DATA_BASE.battleCruisers.list.length;
            break;
        case ShipTypes.carrier:
            UNIT_DATA_BASE.carriers.list.forEach((ship) => shipIds.push(ship.id));
            result.totalBluePrint += UNIT_DATA_BASE.carriers.list.length;
            break;
        default:
        // Do nothing
    }

    switch (type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
        case ShipTypes.aircraft:
        case ShipTypes.bomber:
            account.ships.forEach((ship) => {
                const index = shipIds.findIndex((id) => id === ship.id);
                if (index !== -1) {
                    result.totalTechPoint += ship.techPoint;
                    result.acquiredBluePrint += ship.variants.length;
                }
            });
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            account.superCapitals.forEach((ship) => {
                const index = shipIds.findIndex((id) => id === ship.id);
                if (index !== -1) {
                    result.totalTechPoint += ship.techPoint;
                    result.acquiredBluePrint += 1;
                }
            });
            break;
        default:
    }
    return result;
}

export function techPointsByShip(state: RootState, type: ShipTypes, shipId: string) {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;

    const account = getAccountByAccountId(localState, accountId);
    if (!account) return 0;

    let bluePrint: AcquiredShip | AcquiredSuperCap | undefined;
    let index = -1;

    switch (type) {
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
    if (bluePrint === undefined) return -1;

    return bluePrint.techPoint;
}

export function reportForSelectedAccount(state: RootState): BluePrintReport {
    const localState = state.acquiredBluePrint;
    const { accountId } = state.selectedAccount;

    const account = getAccountByAccountId(localState, accountId);
    const result = { totalTechPoint: 0, acquiredBluePrint: 0, totalBluePrint: 0 };
    if (!account) return result;

    // eslint-disable-next-line no-return-assign
    account.superCapitals.forEach((superCap) => (result.totalTechPoint += superCap.techPoint));
    result.acquiredBluePrint += account.superCapitals.length;

    account.ships.forEach((ship) => {
        result.totalTechPoint += ship.techPoint;
        result.acquiredBluePrint += ship.variants.length;
    });

    result.totalBluePrint += UNIT_DATA_BASE.battleCruisers.list.length;
    result.totalBluePrint += UNIT_DATA_BASE.carriers.list.length;
    // eslint-disable-next-line no-return-assign
    UNIT_DATA_BASE.cruisers.list.forEach((ship) => (result.totalBluePrint += ship.variants.length));
    // eslint-disable-next-line no-return-assign
    UNIT_DATA_BASE.destroyers.list.forEach((ship) => (result.totalBluePrint += ship.variants.length));
    // eslint-disable-next-line no-return-assign
    UNIT_DATA_BASE.frigates.list.forEach((ship) => (result.totalBluePrint += ship.variants.length));
    // eslint-disable-next-line no-return-assign
    UNIT_DATA_BASE.corvettes.list.forEach((ship) => (result.totalBluePrint += ship.variants.length));
    // eslint-disable-next-line no-return-assign
    UNIT_DATA_BASE.aircrafts.list.forEach((ship) => (result.totalBluePrint += ship.variants.length));
    // eslint-disable-next-line no-return-assign
    UNIT_DATA_BASE.bombers.list.forEach((ship) => (result.totalBluePrint += ship.variants.length));

    return result;
}

export const getOwnedShipLookUpTable = createSelector(
    (state: RootState) => state.acquiredBluePrint,
    (state: RootState) => state.selectedAccount.accountId,
    (bluePrints, accountId) => {
        const bluePrint = bluePrints[accountId];
        if (bluePrint === undefined) return {};
        const lookUpObject: { [index: string]: AcquiredShip } = {};
        bluePrint.ships.forEach((ship) => {
            lookUpObject[ship.id] = ship;
        });
        return lookUpObject;
    },
);

export const getOwnedSuperCapLookUpTable = createSelector(
    (state: RootState) => state.acquiredBluePrint,
    (state: RootState) => state.selectedAccount.accountId,
    (bluePrints, accountId) => {
        const bluePrint = bluePrints[accountId];
        if (bluePrint === undefined) return {};
        const lookUpObject: { [index: string]: AcquiredSuperCap } = {};
        bluePrint.superCapitals.forEach((ship) => {
            lookUpObject[ship.id] = ship;
        });
        return lookUpObject;
    },
);
