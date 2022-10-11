export interface AcquiredSuperCap {
    id: string;
    techPoint: number;
    modules: string[];
}

export interface AcquiredShip {
    id: string;
    techPoint: number;
    variants: number[];
}

export interface AcquiredAircraft {
    id: string;
    techPoint: number;
}

export interface AddShipAction {
    accountId: string;
    shipId: string;
    variant: number;
}

export interface RemoveShipAction {
    accountId: string;
    shipId: string;
    variant: number;
}

export interface AddRemoveAircraftAction {
    accountId: string;
    aircraftId: string;
}

export interface AddSuperCapAction {
    accountId: string;
    superCapId: string;
}
