import { RootState } from "../core/store";
import { FleetPlannerSetting, FleetType } from "../fleet-planner";

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
    return settings;
}

export function displayOnlyOwnedShip(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return [];
    return plan.onlyDisplayOwned;
}

export function displayControl(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return [];
    return plan.displayControl;
}
