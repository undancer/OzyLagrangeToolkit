export enum ShipTypes {
    carrier,
    battleCruiser,
    cruiser,
    destroyer,
    frigate,
    corvette,
    aircraft,
}

export interface ShipData {
    id: string;
    name: string;
    type: ShipWithVariants;
    variants: string[];
    pop: number;
    limit: number;
}

export interface AircraftData {
    id: string;
    name: string;
    type: ShipTypes.aircraft;
    aircraftType: "mid" | "large";
    pop: number;
    limit: number;
}

export interface SuperCapData {
    id: string;
    name: string;
    type: ShipWithModules;
    pop: number;
    limit: number;
    modules: {
        [key: string]: SuperCapModule;
    };
}

export interface SuperCapModule {
    id: string;
    name: string;
    isBase: boolean;
    important?: boolean;
    shortName: string;
}

export type UnitDataGroup = ShipDataGroup | SuperCapDataGroup | AircraftDataGroup;
export type UnitData = ShipData | SuperCapData | AircraftData;
export type ShipWithVariants = ShipTypes.cruiser | ShipTypes.destroyer | ShipTypes.frigate | ShipTypes.corvette;
export type ShipWithModules = ShipTypes.battleCruiser | ShipTypes.carrier;

interface ShipDataGroup {
    label: string;
    type: ShipWithVariants;
    list: ShipData[];
}

interface SuperCapDataGroup {
    label: string;
    type: ShipWithModules;
    list: SuperCapData[];
}

interface AircraftDataGroup {
    label: string;
    type: ShipTypes.aircraft;
    list: AircraftData[];
}

export interface UnitDataBase {
    carriers: SuperCapDataGroup;
    battleCruisers: SuperCapDataGroup;
    cruisers: ShipDataGroup;
    destroyers: ShipDataGroup;
    frigates: ShipDataGroup;
    aircrafts: AircraftDataGroup;
    corvettes: ShipDataGroup;
}

export function isShipData(data: UnitData): data is ShipData {
    const { type } = data;
    return (
        type === ShipTypes.cruiser ||
        type === ShipTypes.destroyer ||
        type === ShipTypes.frigate ||
        type === ShipTypes.corvette
    );
}
