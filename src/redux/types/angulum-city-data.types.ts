import { City } from "../../API";

export interface AngulumCityDataState {
    requestState: "idle" | "loading" | "succeeded" | "failed";
    cities: City[];
    error: string | undefined;
    selectedIndex?: number;
}
