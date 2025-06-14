// import { GraphQLQuery, generateClient } from "@aws-amplify/api";
// import { fetchUserAttributes } from "aws-amplify/auth";
import React, { useState } from "react";
// import { CreateCityInput, CreateCityMutation, CreateCordinateInput, CreateCordinateMutation } from "../API";
// import * as mutations from "../graphql/mutations";
import { CityData, Coordinate } from "./data/coordinates";
import { useAppContext } from "../context";
import { Button } from "./ui/button";
import { TextField } from "./ui/text-field";
import { Alert } from "./ui/alert";
import { Snackbar } from "./ui/snackbar";

export function AddAngulumCity(): React.JSX.Element {
  const [cityLevel, setCityLevel] = useState<number>(-1);
  const [coordString, setCoordString] = useState<string>("");
  const [cityCoord, setCityCoord] = useState<Coordinate>({ x: 0, y: 0 });
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const { dispatch } = useAppContext();
  // const client = generateClient({ authMode: "userPool" });

  async function createCity(city: CityData) {
    if (
      (city.level !== 0 && city.level < 2) ||
      cityCoord.x === 0 ||
      cityCoord.y === 0
    ) {
      setSnackOpen(true);
      setCityLevel(-1);
      setCoordString("");
      setCityCoord({ x: 0, y: 0 });
      return;
    }

    // const posDetail: CreateCordinateInput = {
    //     x: city.pos.x,
    //     y: city.pos.y,
    // };
    // try {
    //     const newCoordinate = await client.graphql<GraphQLQuery<CreateCordinateMutation>>({
    //         query: mutations.createCordinate,
    //         variables: { input: posDetail },
    //     });

    //     if (newCoordinate.data === undefined) throw new Error("Failed to create coordinate");
    //     if (newCoordinate.data.createCordinate === undefined || newCoordinate.data.createCordinate === null)
    //         throw new Error("Failed to create coordinate");
    //     const attributes = await fetchUserAttributes();
    //     const userName = attributes.name || "";

    //     const cityDetail: CreateCityInput = {
    //         level: city.level,
    //         type: "CITY",
    //         submitter: userName,
    //         cityPosId: newCoordinate.data.createCordinate.id,
    //     };

    //     const newCity = await client.graphql<GraphQLQuery<CreateCityMutation>>({
    //         query: mutations.createCity,
    //         variables: { input: cityDetail },
    //     });

    //     if (newCity.data === undefined) throw new Error("Failed to create city");
    // } catch (error) {
    //     console.log(error);
    //     throw error;
    // }

    setCityLevel(-1);
    setCoordString("");
    setCityCoord({ x: 0, y: 0 });

    // 使用Context的dispatch替代Redux的dispatch
    dispatch({ type: "ANGULUM_FETCH_CITIES_REQUEST" });
    try {
      // 这里应该有实际的API调用来获取城市数据
      // 成功后dispatch成功的action
      dispatch({
        type: "ANGULUM_FETCH_CITIES_SUCCESS",
        payload: [], // 这里应该是实际的城市数据
      });
      dispatch({ type: "ANGULUM_SELECT_CITY", payload: 0 });
    } catch (error) {
      // 失败后dispatch失败的action
      dispatch({
        type: "ANGULUM_FETCH_CITIES_FAILURE",
        payload: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  function handleSetCityLevel(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (e.target.value === "X" || e.target.value === "x") {
      setCityLevel(0);
      return;
    }

    const inputNumber = parseInt(value, 10);
    let resultLevel = -1;

    if (inputNumber > 0 && inputNumber <= 10) resultLevel = inputNumber;
    else if (inputNumber > 10) resultLevel = 10;

    setCityLevel(resultLevel);
  }

  function cityLevelToText(level: number): string {
    if (level === -1) return "";
    if (level === 0) return "X";
    return level.toString();
  }

  function cityLevelToDisplayText(level: number): string {
    if (level === -1) return "未知";
    if (level === 0) return "消失";
    return level.toString();
  }

  function handleCoordinateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    // remove all non-digit characters except comma
    const newCoordString = value.replace(/[^\d,]/g, "");
    setCoordString(newCoordString);
    const coordArray = newCoordString.split(",");
    if (coordArray.length !== 2) {
      setCityCoord({ x: 0, y: 0 });
      return;
    }
    const x = parseInt(coordArray[0], 10);
    const y = parseInt(coordArray[1], 10);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      setCityCoord({ x: 0, y: 0 });
      return;
    }
    setCityCoord({ x, y });
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackOpen(false)}>
          添加失败
        </Alert>
      </Snackbar>
      <div className="map-add-city">
        <TextField
          className="add-city-level-input"
          label="等级"
          variant="outlined"
          value={cityLevelToText(cityLevel)}
          onChange={handleSetCityLevel}
        />
        <TextField
          label="坐标"
          variant="outlined"
          value={coordString}
          onChange={handleCoordinateChange}
        />
        <Button
          variant="contained"
          onClick={() => createCity({ level: cityLevel, pos: cityCoord })}
        >
          添加城市
        </Button>
      </div>
      <div className="add-city-label">{`城市等级: ${cityLevelToDisplayText(cityLevel)} 坐标:(${cityCoord.x},${
        cityCoord.y
      })`}</div>
    </div>
  );
}
