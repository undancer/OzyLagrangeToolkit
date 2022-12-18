import { RootState } from "../core/store";

export function selectAvailableShipTypes(state: RootState) {
    const { accountId } = state.selectedAccount;
    const plan = state.fleetPlanner[accountId];

    if (!plan) return [];
    return plan.availableShipTypes;
}
