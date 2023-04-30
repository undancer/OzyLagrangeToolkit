import { createSelector } from "@reduxjs/toolkit";
import { addCapacity, AirCapacity, ShipAirCapacity, SuperCapAirCapacity } from "../../components/data/air-capacity";
import { lookUpShipById } from "../../components/data/ship-data";
import { ShipTypes } from "../../components/data/ship-data-types";
import { RootState } from "../core/store";
import { FleetPlannerSetting, FleetType } from "../fleet-planner";
import { getOwnedSuperCapLookUpTable } from "./acquired-blue-prints";
import { techPointDisplayData } from "../../components/fleet-plan-ship-table";

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

// The Selector that retuns the total number of ships and population in the fleet of the current selected account
export function getFleetDataTotal(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];
    const result = plan.fleets.map((fleet) => {
        const main = fleet.mainFleet.reduce(
            (acc, cur) => {
                const population = lookUpShipById(cur.shipId)?.pop ?? 0;
                acc.count += cur.count;
                acc.population += population * cur.count;
                return acc;
            },
            { count: 0, population: 0 },
        );
        const reinforce = fleet.reinforcement.reduce(
            (acc, cur) => {
                const population = lookUpShipById(cur.shipId)?.pop ?? 0;
                acc.count += cur.count;
                acc.population += population * cur.count;
                return acc;
            },
            { count: 0, population: 0 },
        );
        return { main, reinforce };
    });
    return result;
}

// The Selector that returns the total number of aircraft and corvette in the fleet of the current selected account
export function getFleetAirTotal(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];
    const fleetCapacity = plan.fleets.map((fleet) => {
        const { aircraft } = fleet;
        const total: AirCapacity = { corvette: 0, midAir: 0, heavyAir: 0 };
        aircraft.forEach((plane) => {
            const data = lookUpShipById(plane.shipId);
            if (!data) return;
            if (data.type === ShipTypes.corvette) {
                total.corvette += plane.count;
            } else if (data.type === ShipTypes.aircraft && data.aircraftType === "mid") {
                total.midAir += plane.count;
            } else if (data.type === ShipTypes.aircraft && data.aircraftType === "large") {
                total.heavyAir += plane.count;
            }
        });
        return total;
    });
    return fleetCapacity;
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

export const getFleetShipTechPointLookupTable = createSelector(
    (state: RootState) => {
        const { accountId } = state.selectedAccount;
        return state.acquiredBluePrint[accountId];
    },
    (state: RootState) => {
        const { accountId } = state.selectedAccount;
        return state.fleetPlanner[accountId].fleets;
    },
    (bluePrints, fleets) => {
        // for all ships in each fleets, find the corresponding ship in bluePrints based on IP and return the techpoints
        const lookUpObject: { [index: string]: techPointDisplayData } = {};
        fleets.forEach((fleet) => {
            const { aircraft, mainFleet, reinforcement } = fleet;
            aircraft.forEach((ship) => {
                const { shipId } = ship;
                let bluePrint = bluePrints.aircraft.find((bp) => bp.id === shipId);
                if (!bluePrint) {
                    bluePrint = bluePrints.ships.find((bp) => bp.id === shipId);
                }
                if (!bluePrint) return;

                lookUpObject[shipId] = techPointsToDisplayValue(bluePrint.techPoint, shipId);
            });
            mainFleet.forEach((ship) => {
                const { shipId } = ship;
                const bluePrint = bluePrints.ships.find((bp) => bp.id === shipId);
                if (!bluePrint) return;

                lookUpObject[ship.shipId] = techPointsToDisplayValue(bluePrint.techPoint, shipId);
            });
            reinforcement.forEach((ship) => {
                const { shipId } = ship;
                const bluePrint = bluePrints.superCapitals.find((bp) => bp.id === shipId);
                if (!bluePrint) return;

                lookUpObject[ship.shipId] = techPointsToDisplayValue(bluePrint.techPoint, shipId);
            });
        });
        return lookUpObject;
    },
);

function techPointsToDisplayValue(inputTechPoint: number, shipId: string): techPointDisplayData {
    const shipData = lookUpShipById(shipId);
    let goldBreakPoints = 100;
    let additionalTechPoints = 30;
    if (shipData !== undefined) {
        if (shipData.type === ShipTypes.carrier || shipData.type === ShipTypes.battleCruiser) {
            goldBreakPoints = 200;
        }
        if (shipData.type === ShipTypes.aircraft || shipData.type === ShipTypes.corvette) {
            additionalTechPoints = 40;
        }
    }

    const techPoint = (inputTechPoint ?? 0) + additionalTechPoints;
    // techPoints divided by 100, round down than plus 1 to get the main version
    const mainVersion = Math.floor(techPoint / 100) + 1;
    // techPoints divided by 100 and get the remainder to get sub version
    const subVersion = techPoint % 100;
    // display tech point as mainVersion.subVersion, subVersion is always 2 digits
    const text = `v${mainVersion}.${subVersion.toString().padStart(2, "0")}`;

    if (!shipData) return { text, type: "tech-normal" }; // This should never happen

    // Determines which color and style to use for the tech point display
    const type = techPoint < goldBreakPoints ? "tech-normal" : "tech-gold";
    return { text, type };
}
