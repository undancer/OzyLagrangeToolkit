import { ShipTypes } from "../../components/data/ship-data-types";

export interface AvailableShipTypes {
    id: string;
    types: ShipTypes[];
}

export interface FleetAction {
    id: string;
    name: string;
}
