import { ShipTypes } from "../../components/data/ship-data-types";
import { FleetType } from "../fleet-planner";

export interface AvailableShipTypes {
    accountId: string;
    types: ShipTypes[];
}

export interface FleetAction {
    accountId: string;
    name: string;
}

export interface AddShip {
    accountId: string;
    shipId: string;
    variant: number;
}

export interface EditRemoveShipOrAircraft {
    accountId: string;
    type: FleetType;
    fleetIndex: number;
    shipIndex: number;
}

export interface RemoveFleet {
    accountId: string;
    index: number;
}

export interface SelectedFleet {
    accountId: string;
    index: number;
    type: FleetType;
}

export interface FleetPlannerSettings {
    accountId: string;
    settings: number[];
}

export interface FleetNameChange {
    accountId: string;
    fleetIndex: number;
    name: string;
}
