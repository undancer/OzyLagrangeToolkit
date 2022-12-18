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
    variants: string[];
}

export interface AircraftData {
    id: string;
    name: string;
    type: "mid" | "large";
}

export interface SuperCapData {
    id: string;
    name: string;
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

interface ShipDataGroup {
    label: string;
    type: ShipTypes.cruiser | ShipTypes.destroyer | ShipTypes.frigate | ShipTypes.corvette;
    list: ShipData[];
}

interface SuperCapDataGroup {
    label: string;
    type: ShipTypes.battleCruiser | ShipTypes.carrier;
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
