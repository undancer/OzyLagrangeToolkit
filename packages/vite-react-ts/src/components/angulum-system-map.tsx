import React, { useEffect, useState } from "react";
import { Circle, Layer, Line, Rect, Stage, Star, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
// import { getCurrentUser } from "aws-amplify/auth";
import { useAppContext } from "../context";
import "./css/angulum-system-map.css";
import {
  getLinePoints,
  MAP_BORDERS,
  objCoord,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  starRatio,
} from "./data/coordinates";
import { AddAngulumCity } from "./add-angulum-city";
import { AngulumFullRecordTable } from "./angulum-full-record-table";
import { AngulumSelectedCity } from "./angulum-selected-city";
import { Box } from "./ui/box";
import { Container } from "./ui/container";
import { Slider } from "./ui/slider";
import { Tab, Tabs } from "./ui/tabs";

const BACK_GROUND_COLOR = "#14213d";
const BORDER_LINE_COLOR = "#ffffff";
const SELECTED_COLOR = "#ff0000";
const CITY_COLOR = "#caffbf";
const POINT_OF_INTEREST_COLOR = "#ffc300";
const CITY_ICON_RADIUS = 15;

function AngulumMap() {
  let [hasUser, setHasUser] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const { state } = useAppContext();
  const gameAccount = state.gameAccount;

  hasUser = true;

  // React.useEffect(() => {
  //     getCurrentUser()
  //         .then(() => setHasUser(true))
  //         .catch(() => setHasUser(false));
  // }, []);

  const warningMessage = (
    <div className="map-warning-message">
      本功能为赤树风暴注册用户专有功能，请注册后找OZY认证账号后使用。
    </div>
  );

  let content = (
    <div className="map-content-container">
      {hasUser ? <Map /> : warningMessage}
    </div>
  );
  if (Object.values(gameAccount).length <= 0)
    content = <div className="map-warning-message">请先添加游戏账号</div>;

  return <Container maxWidth="xl">{content}</Container>;
}

function Map() {
  const [mapScale, setMapScale] = useState<number>(1);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [cityLevelLimit, setCityLevelLimit] = useState<number>(3);
  const { state, dispatch } = useAppContext();
  const selectedIndex = state.angulumCityData.selectedIndex;
  const unauthorized = state.angulumCityData.requestState === "failed";
  const levels = [10, 7, 5, 4, 3, 2];

  useEffect(() => {
    dispatch({ type: "ANGULUM_FETCH_CITIES_REQUEST" });
    try {
      // 这里应该有实际的API调用来获取城市数据
      // 成功后dispatch成功的action
      dispatch({
        type: "ANGULUM_FETCH_CITIES_SUCCESS",
        payload: [], // 这里应该是实际的城市数据
      });
    } catch (error) {
      // 失败后dispatch失败的action
      dispatch({
        type: "ANGULUM_FETCH_CITIES_FAILURE",
        payload: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, []);

  function uiCitySelection(e: KonvaEventObject<MouseEvent>): void {
    const index = parseInt(e.target.id(), 10);
    dispatch({ type: "ANGULUM_SELECT_CITY", payload: index });
  }

  function handleWheel(e: KonvaEventObject<WheelEvent>) {
    let scale = mapScale * (1 - e.evt.deltaY / 1000);
    if (scale < 1) scale = 1;
    if (scale > 3.5) scale = 3.5;
    setMapScale(scale);
  }

  const borderLines = MAP_BORDERS.map((border, index) => (
    <Line
      points={getLinePoints(border)}
      stroke={BORDER_LINE_COLOR}
      key={index}
    />
  ));
  const stars = cityLabels(
    mapScale,
    selectedIndex,
    uiCitySelection,
    levels[cityLevelLimit],
  );

  const warningMessage = (
    <Text
      x={STAGE_WIDTH / 2 - 200}
      y={STAGE_HEIGHT / 2 - 100}
      width={400}
      text="账户权限不足,请联系OZY获得更高权限以使用此功能。"
      fill="red"
      fontSize={30}
    />
  );

  const marks: { value: number; label: string }[] = [];
  levels.forEach((level, index) =>
    marks.push({ value: index, label: level.toString() }),
  );

  return (
    <div className="map-container">
      <div className="map-box">
        <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
          <Layer
            scaleX={mapScale}
            scaleY={mapScale}
            draggable
            onWheel={handleWheel}
          >
            <Rect
              x={0}
              y={0}
              width={STAGE_WIDTH}
              height={STAGE_HEIGHT}
              fill={BACK_GROUND_COLOR}
            />
            {stars}
            {borderLines}
            {unauthorized ? warningMessage : null}
          </Layer>
        </Stage>
      </div>
      <div className="map-selection">
        <Box className="border-b border-gray-200">
          <Tabs value={tabIndex} onChange={(newValue) => setTabIndex(newValue)}>
            <Tab
              label="城市报告"
              value={0}
              selected={tabIndex === 0}
              onChange={() => {}}
            />
            <Tab
              label="总数据"
              value={1}
              selected={tabIndex === 1}
              onChange={() => {}}
            />
            <Tab
              label="城市筛选"
              value={2}
              selected={tabIndex === 2}
              onChange={() => {}}
            />
          </Tabs>
        </Box>
        <div className={tabIndex !== 0 ? "hidden" : ""}>
          <AngulumSelectedCity />
        </div>
        <div className={tabIndex !== 1 ? "hidden" : ""}>
          <AngulumFullRecordTable />
        </div>
        <div className={tabIndex !== 2 ? "hidden" : ""}>
          <label className="block mb-2">城市等级</label>
          <Slider
            defaultValue={6}
            min={0}
            max={levels.length - 1}
            value={cityLevelLimit}
            onChange={(_e, value) => setCityLevelLimit(value as number)}
            marks={marks}
            aria-valuetext="city-level-limit"
          />
        </div>
        <div className={tabIndex > 1 ? "hidden" : ""}>
          <AddAngulumCity />
        </div>
      </div>
    </div>
  );
}

function cityLabels(
  mapScale: number,
  selectedCity: number,
  uiCitySelect: (e: KonvaEventObject<WheelEvent>) => void,
  levelFilter: number,
): React.JSX.Element[] {
  const { state } = useAppContext();
  const cities = state.angulumCityData.cities;
  const uniqueCities = new Set<string>();
  const labels: React.JSX.Element[] = [];
  cities.forEach((city, index) => {
    if (uniqueCities.has(`${city.pos.x},${city.pos.y}`)) return;
    uniqueCities.add(`${city.pos.x},${city.pos.y}`);
    const coord = objCoord(city.pos);
    let radius = starRatio(city.level) * (1 / mapScale) * CITY_ICON_RADIUS;
    if (city.level < levelFilter)
      radius = starRatio(0) * (1 / mapScale) * CITY_ICON_RADIUS;
    let color = city.level === 0 ? POINT_OF_INTEREST_COLOR : CITY_COLOR;
    if (index === selectedCity) color = SELECTED_COLOR;
    if (city.level < levelFilter) {
      labels.push(
        <Circle
          x={coord.x}
          y={coord.y}
          radius={radius / 2}
          fill={color}
          key={index}
          id={index.toString()}
          onClick={uiCitySelect}
        />,
      );
    } else {
      labels.push(
        <Star
          x={coord.x}
          y={coord.y}
          innerRadius={radius / 2}
          outerRadius={radius}
          numPoints={city.level}
          key={index}
          id={index.toString()}
          fill={color}
          opacity={0.8}
          rotation={0}
          onClick={uiCitySelect}
        />,
      );
    }
  });

  return labels;
}

export default AngulumMap;
