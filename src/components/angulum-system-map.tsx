import React, { useState } from "react";
import { Container, Table, TableBody, TableHead, TableCell, TableRow, Button, TextField } from "@mui/material";
import { Stage, Layer, Star, Rect, Line, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { API, Auth } from "aws-amplify";
import { GRAPHQL_AUTH_MODE, GraphQLQuery } from "@aws-amplify/api";
import { useAppSelector } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/game-account";
import "./css/angulum-system-map.css";
import NoAccountWarning from "./no-account-warning";
import {
    CityData,
    Coordinate,
    getLinePoints,
    MAP_BORDERS,
    objCoord,
    STAGE_HEIGHT,
    STAGE_WIDTH,
    starRatio,
} from "./data/coordinates";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import {
    City,
    ListCitiesQuery,
    CreateCityInput,
    CreateCityMutation,
    CreateCordinateInput,
    CreateCordinateMutation,
} from "../API";

function AngulumMap() {
    const [hasUser, setHasUser] = useState<boolean>(false);
    const gameAccounts = useAppSelector((state) => selectAllAccounts(state));

    React.useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then(() => setHasUser(true))
            .catch(() => setHasUser(false));
    }, []);

    const warningMessage = (
        <div className="map-warning-message">本功能为赤树风暴注册用户专有功能，请注册后找OZY认证账号后使用。</div>
    );

    let content = <div className="map-content-container">{hasUser ? <Map /> : warningMessage}</div>;
    if (gameAccounts.length <= 0) content = <NoAccountWarning />;

    return <Container maxWidth="xl">{content}</Container>;
}

function Map() {
    const [selectedCityIndex, setSelectedCityIndex] = useState<number>(-1);
    const [mapScale, setMapScale] = useState<number>(1);
    const [cities, setCities] = useState<City[]>([]);
    const [unauthorized, setUnauthorized] = useState<boolean>(false);

    React.useEffect(() => {
        fetchCities();
    }, []);

    async function fetchCities(): Promise<void> {
        try {
            const apiData = await API.graphql<GraphQLQuery<ListCitiesQuery>>({
                query: queries.listCities,
                authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
            });
            if (apiData.data === undefined) throw new Error("Failed to fetch cities");
            if (apiData.data.listCities === undefined || apiData.data.listCities === null)
                throw new Error("Failed to fetch cities");
            const citiesFromAPI = apiData.data.listCities.items.filter((city) => city !== null) as City[];
            setCities(citiesFromAPI);
        } catch (error) {
            console.log(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((error as any).errors[0].errorType === "Unauthorized") setUnauthorized(true);
            throw error;
        }
    }

    function selectCity(e: KonvaEventObject<MouseEvent>): void {
        setSelectedCityIndex(parseInt(e.target.id(), 10));
    }

    function handleWheel(e: KonvaEventObject<WheelEvent>) {
        let scale = mapScale * (1 - e.evt.deltaY / 1000);
        if (scale < 1) scale = 1;
        if (scale > 3.5) scale = 3.5;
        setMapScale(scale);
    }

    const borderLines = MAP_BORDERS.map((border, index) => (
        <Line points={getLinePoints(border)} stroke={"black"} key={index} />
    ));
    const stars = cityLabels(cities, mapScale, selectedCityIndex, selectCity);

    const warningMessage = (
        <Text
            x={STAGE_WIDTH / 2 - 200}
            y={STAGE_HEIGHT / 2 - 100}
            width={400}
            text="账户权限不足，请联系OZY获得更高权限以使用此功能。"
            fill="red"
            fontSize={30}
        />
    );
    return (
        <div className="map-container">
            <div className="map-box">
                <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
                    <Layer scaleX={mapScale} scaleY={mapScale} draggable onWheel={handleWheel}>
                        <Rect x={0} y={0} width={STAGE_WIDTH} height={STAGE_HEIGHT} fill="white" />
                        {stars}
                        {borderLines}
                        {unauthorized ? warningMessage : null}
                    </Layer>
                </Stage>
            </div>
            <div className="map-selection">
                <CityTable cities={cities} selectedCity={selectedCityIndex} />
                <AddCityContainer fetchCityCallBack={fetchCities} />
            </div>
        </div>
    );
}

function AddCityContainer(props: { fetchCityCallBack: () => Promise<void> }): JSX.Element {
    const [cityLevel, setCityLevel] = useState<number>(0);
    const [coordString, setCoordString] = useState<string>("");
    const [cityCoord, setCityCoord] = useState<Coordinate>({ x: 0, y: 0 });
    const fetchCities = props.fetchCityCallBack;

    async function createCity(city: CityData) {
        const posDetail: CreateCordinateInput = {
            x: city.pos.x,
            y: city.pos.y,
        };
        try {
            const newCoordinate = await API.graphql<GraphQLQuery<CreateCordinateMutation>>({
                query: mutations.createCordinate,
                variables: { input: posDetail },
                authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
            });

            if (newCoordinate.data === undefined) throw new Error("Failed to create coordinate");
            if (newCoordinate.data.createCordinate === undefined || newCoordinate.data.createCordinate === null)
                throw new Error("Failed to create coordinate");
            const user = await Auth.currentAuthenticatedUser();
            const userName = user.attributes.name;

            const cityDetail: CreateCityInput = {
                level: city.level,
                submitter: userName,
                cityPosId: newCoordinate.data.createCordinate.id,
            };

            const newCity = await API.graphql<GraphQLQuery<CreateCityMutation>>({
                query: mutations.createCity,
                variables: { input: cityDetail },
                authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
            });

            if (newCity.data === undefined) throw new Error("Failed to create city");
        } catch (error) {
            console.log(error);
            throw error;
        }

        fetchCities();
    }

    function handleSetCityLevel(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;
        let level = parseInt(value, 10);
        if (level > 10) level = 10;
        if (level < 0) level = 0;
        if (Number.isNaN(level)) level = 0;
        setCityLevel(level);
    }

    function handleCoordinateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;
        // remove all non-digit characters except comma
        const newCoordString = value.replace(/[^\d,]/g, "");
        console.log(`1: ${newCoordString}`);
        setCoordString(newCoordString);
        const coordArray = newCoordString.split(",");
        if (coordArray.length !== 2) setCityCoord({ x: 0, y: 0 });
        const x = parseInt(coordArray[0], 10);
        const y = parseInt(coordArray[1], 10);
        if (Number.isNaN(x) || Number.isNaN(y)) setCityCoord({ x: 0, y: 0 });
        setCityCoord({ x, y });
    }

    return (
        <div>
            <div className="map-add-city">
                <TextField
                    className="add-city-level-input"
                    label="等级"
                    variant="outlined"
                    value={cityLevel > 0 ? cityLevel : ""}
                    onChange={handleSetCityLevel}
                />
                <TextField label="坐标" variant="outlined" value={coordString} onChange={handleCoordinateChange} />
                <Button onClick={() => createCity({ level: cityLevel, pos: cityCoord })}>添加城市</Button>
            </div>
            <div className="add-city-label">{`城市等级： ${cityLevel},  坐标：(${cityCoord.x},${cityCoord.y})`}</div>
        </div>
    );
}

function CityTable(props: { cities: City[]; selectedCity: number }): JSX.Element {
    const { cities } = props;
    const rows = cities.map((city, index) => {
        const className = index === props.selectedCity ? "map-city selected-city" : "map-city";
        const time = new Date(city.createdAt);
        return (
            <TableRow key={index}>
                <TableCell className={className} align="center">
                    {city.level}
                </TableCell>
                <TableCell className={className}>{`(${city.pos.x},${city.pos.y})`}</TableCell>
                <TableCell>{city.submitter}</TableCell>
                <TableCell>{`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}</TableCell>
            </TableRow>
        );
    });

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>等级</TableCell>
                    <TableCell align="center">城市坐标</TableCell>
                    <TableCell align="center">发现人</TableCell>
                    <TableCell>发现日期</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
        </Table>
    );
}

function cityLabels(
    cities: City[],
    mapScale: number,
    selectedCity: number,
    selectCity: (e: KonvaEventObject<WheelEvent>) => void,
): JSX.Element[] {
    const starRadius = 20;
    const stars = cities.map((city, index) => {
        const coord = objCoord(city.pos);
        const radius = starRatio(city.level) * (1 / mapScale) * starRadius;
        let color = "#89b717";
        if (index === selectedCity) color = "#ff0000";
        return (
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
                onClick={selectCity}
            />
        );
    });

    return stars;
}

export default AngulumMap;
