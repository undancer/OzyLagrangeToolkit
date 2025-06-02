// 舰队规划相关类型定义
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
    adjusted: boolean;
    leveled: boolean;
    inComplete?: boolean;
}

// 从ship-data-types.ts导入的类型
export enum ShipTypes {
    Frigate = 'Frigate',
    Destroyer = 'Destroyer',
    Cruiser = 'Cruiser',
    Battlecruiser = 'Battlecruiser',
    Battleship = 'Battleship',
    Carrier = 'Carrier',
    Auxiliary = 'Auxiliary',
    Fighter = 'Fighter',
    Corvette = 'Corvette',
}