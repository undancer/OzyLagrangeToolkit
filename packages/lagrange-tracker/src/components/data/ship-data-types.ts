export enum ShipTypes {
    carrier,
    battleCruiser,
    cruiser,
    destroyer,
    frigate,
    corvette,
    aircraft,
    bomber,
}

export interface ShipData {
    id: string;
    name: string;
    type: ShipWithVariants;
    variants: string[];
    pop: number[];
    limit: number;
}

export interface AircraftData {
    id: string;
    name: string;
    type: ShipTypes.aircraft | ShipTypes.bomber | ShipTypes.corvette;
    variants: string[];
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
export type UnitDataWithVariants = ShipData | AircraftData;
export type UnitDataWithPopulation = ShipData | SuperCapData;
export type UnitData = ShipData | SuperCapData | AircraftData;
export type ShipWithVariants = ShipTypes.cruiser | ShipTypes.destroyer | ShipTypes.frigate;
export type AircraftWithVariants = ShipTypes.aircraft | ShipTypes.bomber | ShipTypes.corvette;
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
    type: AircraftWithVariants;
    list: AircraftData[];
}

export interface UnitDataBase {
    carriers: SuperCapDataGroup;
    battleCruisers: SuperCapDataGroup;
    cruisers: ShipDataGroup;
    destroyers: ShipDataGroup;
    frigates: ShipDataGroup;
    aircrafts: AircraftDataGroup;
    bombers: AircraftDataGroup;
    corvettes: AircraftDataGroup;
}

export function combineAircraft(data: AircraftDataGroup[]): AircraftDataGroup {
    const list: AircraftData[] = [];
    data.forEach((group) => {
        list.push(...group.list);
    });
    return { label: data[0].label, type: ShipTypes.aircraft, list };
}

export function isShipData(data: UnitData): data is ShipData {
    const { type } = data;
    return type === ShipTypes.cruiser || type === ShipTypes.destroyer || type === ShipTypes.frigate;
}

export function isAircraft(data: UnitData): data is AircraftData {
    const { type } = data;
    return type === ShipTypes.aircraft || type === ShipTypes.bomber || type === ShipTypes.corvette;
}

export function isSuperCap(data: UnitData): data is SuperCapData {
    const { type } = data;
    return type === ShipTypes.battleCruiser || type === ShipTypes.carrier;
}
