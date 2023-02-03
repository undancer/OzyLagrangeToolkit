import { createSelector } from "@reduxjs/toolkit";
import { addCapacity, AirCapacity, ShipAirCapacity, SuperCapAirCapacity } from "../../components/data/air-capacity";
import { lookUpShipById } from "../../components/data/ship-data";
import { ShipTypes } from "../../components/data/ship-data-types";
import { RootState } from "../core/store";
import { FleetPlannerSetting, FleetType } from "../fleet-planner";
import { getOwnedSuperCapLookUpTable } from "./acquired-blue-prints";

export function selectAvailableShipTypes(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return [];
    return plan.availableShipTypes;
}

export function getSelectedFleet(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return { index: -1, type: FleetType.main };
    return plan.selectedFleet;
}

export function getAllFleets(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return [];
    return plan.fleets;
}

export function fleetPlannerControlSetting(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return [];
    const settings: number[] = [];
    if (plan.onlyDisplayOwned) settings.push(FleetPlannerSetting.DisplayOwned);
    if (plan.displayControl) settings.push(FleetPlannerSetting.DisplayControl);
    if (plan.mainModuleFirst) settings.push(FleetPlannerSetting.MainModuleFirst);
    return settings;
}

export function displayOnlyOwnedShip(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return false;
    return plan.onlyDisplayOwned;
}

export function displayControl(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return false;
    return plan.displayControl;
}

export function useMainModule(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return false;
    return plan.mainModuleFirst;
}

export const getFleetsAirCapacity = createSelector(
    (state: RootState) => getAllFleets(state),
    (state: RootState) => getOwnedSuperCapLookUpTable(state),
    (state: RootState) => useMainModule(state),
    (fleets, ownedLookupTable, mainModule) => {
        const capacities = fleets.map((fleet) => {
            const capacity: AirCapacity = { corvette: 0, midAir: 0, heavyAir: 0 };
            const combinedFleet = fleet.mainFleet.concat(fleet.reinforcement);
            combinedFleet.forEach((ship) => {
                const data = lookUpShipById(ship.shipId);
                if (!data) return;
                if (data.type === ShipTypes.carrier || data.type === ShipTypes.battleCruiser) {
                    const ownedSuperCap = ownedLookupTable[ship.shipId];
                    addCapacity(
                        capacity,
                        SuperCapAirCapacity(ship.shipId, ownedSuperCap.modules, mainModule),
                        ship.count,
                    );
                } else {
                    addCapacity(capacity, ShipAirCapacity(ship.shipId, ship.variant), ship.count);
                }
            });
            return capacity;
        });
        return capacities;
    },
);
