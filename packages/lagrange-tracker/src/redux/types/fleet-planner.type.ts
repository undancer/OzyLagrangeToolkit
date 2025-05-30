import { ShipTypes } from "../../components/data/ship-data-types";

export enum FleetPlannerSetting {
    DisplayOwned,
    DisplayControl,
    MainModuleFirst,
}

export interface FleetPlannerState {
    [index: string]: FleetPlan;
}

export enum FleetType {
    main,
    reinforcement,
    aircraft,
}

export interface FleetPlan {
    accountId: string;
    availableShipTypes: ShipTypes[];
    shipIgnoreList: string[];
    maxPopulation: number;
    onlyDisplayOwned: boolean;
    displayControl: boolean;
    mainModuleFirst: boolean;
    selectedFleet: { index: number; type: FleetType };
    fleetLimit: number;
    fleets: Fleet[];
}

export interface Fleet {
    name: string;
    mainFleet: ShipInFleet[];
    reinforcement: ShipInFleet[];
    aircraft: AircraftInFleet[];
}

export interface ShipInFleet {
    shipId: string;
    variant: number;
    count: number;
    adjusted: boolean;
    leveled: boolean;
    inComplete?: boolean;
}

export interface AircraftInFleet {
    shipId: string;
    variant: number;
    count: number;
    distribution: AircraftDistribution[];
    adjusted: boolean;
    leveled: boolean;
}

export interface AircraftDistribution {
    shipId: string;
    variant: number;
    count: number;
}

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
