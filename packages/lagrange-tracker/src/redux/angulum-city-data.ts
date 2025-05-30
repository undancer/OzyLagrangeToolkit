import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { GraphQLQuery, generateClient } from "@aws-amplify/api";
// import {
//     City,
//     ListCitiesWithSortedTimeQuery,
//     ListCitiesWithSortedTimeQueryVariables,
//     ModelSortDirection,
// } from "../API";
// import * as queries from "../graphql/queries";
import { RootState } from "./core/store";
import { AngulumCityDataState } from "./types/angulum-city-data.types";

const initialState: AngulumCityDataState = {
    requestState: "idle",
    cities: [],
    error: undefined,
};

const angulumCityDataSlice = createSlice({
    name: "angulumCityData",
    initialState,
    reducers: {
        selectCity(state, action) {
            state.selectedIndex = action.payload;
        },
        clearSelectedCity(state) {
            state.selectedIndex = undefined;
        },
    },
    extraReducers: (builder) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        builder.addCase(fetchCities.fulfilled, (state, action) => {
            // const cities = action.payload;
            // state.cities = cities;
            state.requestState = "succeeded";
            state.error = undefined;
        });
        builder.addCase(fetchCities.rejected, (state, action) => {
            state.requestState = "failed";
            state.error = action.error.message;
        });
        builder.addCase(fetchCities.pending, (state) => {
            state.requestState = "loading";
        });
    },
});

export const fetchCities = createAsyncThunk("angulumCityData/fetch", async () => {
    // const client = generateClient({ authMode: "userPool" });
    // const vars: ListCitiesWithSortedTimeQueryVariables = {
    //     type: "CITY",
    //     limit: 1000,
    //     sortDirection: ModelSortDirection.DESC,
    // };
    // const apiData = await client.graphql<GraphQLQuery<ListCitiesWithSortedTimeQuery>>({
    //     query: queries.listCitiesWithSortedTime,
    //     variables: vars,
    // });
    // if (apiData.data === undefined) throw new Error("Failed to fetch cities");
    // if (apiData.data.listCitiesWithSortedTime === undefined || apiData.data.listCitiesWithSortedTime === null)
    //     throw new Error("Failed to fetch cities");
    // const citiesFromAPI = apiData.data.listCitiesWithSortedTime.items.filter((city) => city !== null) as City[];
    // return citiesFromAPI;
    return {};
});

export default angulumCityDataSlice.reducer;
export const { selectCity, clearSelectedCity } = angulumCityDataSlice.actions;
export const selectCities = (state: RootState) => state.angulumCityData.cities;
export const selectSelectedIndex = (state: RootState) => state.angulumCityData.selectedIndex ?? -1;
