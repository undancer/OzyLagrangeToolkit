import React, { useState } from "react";
import {
    Container,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Button,
    TextField,
    Paper,
    TableContainer,
    TablePagination,
    Snackbar,
    Alert,
    Box,
    Tab,
    Tabs,
} from "@mui/material";
import { Stage, Layer, Star, Rect, Line, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { API, Auth } from "aws-amplify";
import { GRAPHQL_AUTH_MODE, GraphQLQuery } from "@aws-amplify/api";
import moment from "moment";
import { Divider } from "@aws-amplify/ui-react";
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
    CreateCityInput,
    CreateCityMutation,
    CreateCordinateInput,
    CreateCordinateMutation,
    ModelSortDirection,
    ListCitiesWithSortedTimeQuery,
    ListCitiesWithSortedTimeQueryVariables,
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
    const [tabIndex, setTabIndex] = useState<number>(0);

    React.useEffect(() => {
        fetchCities();
    }, []);

    async function fetchCities(): Promise<void> {
        try {
            const vars: ListCitiesWithSortedTimeQueryVariables = {
                type: "CITY",
                limit: 1000,
                sortDirection: ModelSortDirection.DESC,
            };
            const apiData = await API.graphql<GraphQLQuery<ListCitiesWithSortedTimeQuery>>({
                query: queries.listCitiesWithSortedTime,
                authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
                variables: vars,
            });
            if (apiData.data === undefined) throw new Error("Failed to fetch cities");
            if (apiData.data.listCitiesWithSortedTime === undefined || apiData.data.listCitiesWithSortedTime === null)
                throw new Error("Failed to fetch cities");
            const citiesFromAPI = apiData.data.listCitiesWithSortedTime.items.filter((city) => city !== null) as City[];
            setSelectedCityIndex(-1);
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
            text="账户权限不足,请联系OZY获得更高权限以使用此功能。"
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
                <Box>
                    <Tabs value={tabIndex} onChange={(_e, newValue) => setTabIndex(newValue)}>
                        <Tab label="城市报告" />
                        <Tab label="总数据" />
                    </Tabs>
                </Box>
                <div hidden={tabIndex === 0}>
                    <CityTable cities={cities} selectedCity={selectedCityIndex} selectCity={setSelectedCityIndex} />
                </div>
                <div hidden={tabIndex === 1}>
                    <SelectedCityDisplay
                        cities={cities}
                        selectedIndex={selectedCityIndex}
                        selectCity={setSelectedCityIndex}
                    />
                </div>
                <AddCityContainer fetchCityCallBack={fetchCities} />
            </div>
        </div>
    );
}

function SelectedCityDisplay(props: {
    cities: City[];
    selectedIndex: number;
    selectCity: (index: number) => void;
}): JSX.Element {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const { cities, selectedIndex, selectCity } = props;
    const selectedCity = cities[selectedIndex];

    function handlePageChange(_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        setPage(newPage);
    }

    function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }

    const minRange = page * rowsPerPage;
    const maxRange = (page + 1) * rowsPerPage;
    let cityLevel = "无";
    let pos = "( 0 . - )";
    let recentChangeTime = "无";
    if (selectedCity !== undefined) {
        cityLevel = `${selectedCity.level}`;
        pos = `(${selectedCity.pos.x}, ${selectedCity.pos.y})`;
        recentChangeTime = moment(selectedCity.updatedAt).fromNow();
    }

    moment.updateLocale("zh", {
        relativeTime: {
            future: "%s内",
            past: "%s前",
            s: "几秒",
            ss: "%d秒",
            m: "1分钟",
            mm: "%d分钟",
            h: "1小时",
            hh: "%d小时",
            d: "1天",
            dd: "%d天",
            M: "1个月",
            MM: "%d个月",
            y: "1年",
            yy: "%d年",
        },
    });
    moment.locale("zh");

    const filteredRow: JSX.Element[] = [];
    const resultRows: JSX.Element[] = [];

    cities.forEach((city, index) => {
        if (city.pos.x === selectedCity?.pos.x && city.pos.y === selectedCity?.pos.y) {
            const className = index === selectedIndex ? "map-city selected-city" : "map-city";
            const result = (
                <TableRow key={index}>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {index}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {city.submitter}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {city.level}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {moment(city.updatedAt).fromNow()}
                    </TableCell>
                </TableRow>
            );
            filteredRow.push(result);
        }
    });

    filteredRow.forEach((city, index) => {
        if (index >= minRange && index < maxRange) resultRows.push(city);
    });

    return (
        <div className="city-detail-container">
            <div className="city-detail-title">城市讯息</div>
            <Divider />
            <div className="city-detail-content">
                <div className="city-detail-info-box">
                    <div className="city-detail-data-level">{cityLevel}</div>
                    <div className="city-detail-data-label">当前等级</div>
                </div>
                <div className="city-detail-info-box">
                    <div className="city-detail-data">{pos}</div>
                    <div className="city-detail-data-label">坐标</div>
                </div>
                <div className="city-detail-info-box">
                    <div className="city-detail-data">{recentChangeTime}</div>
                    <div className="city-detail-data-label">最近更新</div>
                </div>
            </div>
            <Divider />
            <div>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">发现人</TableCell>
                                <TableCell align="center">等级</TableCell>
                                <TableCell align="center">更新日期</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{resultRows}</TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    count={resultRows.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[4, 8]}
                />
            </div>
        </div>
    );
}

function AddCityContainer(props: { fetchCityCallBack: () => Promise<void> }): JSX.Element {
    const [cityLevel, setCityLevel] = useState<number>(-1);
    const [coordString, setCoordString] = useState<string>("");
    const [cityCoord, setCityCoord] = useState<Coordinate>({ x: 0, y: 0 });
    const [snackOpen, setSnackOpen] = useState<boolean>(false);
    const fetchCities = props.fetchCityCallBack;

    async function createCity(city: CityData) {
        if ((city.level !== 0 && city.level < 2) || cityCoord.x === 0 || cityCoord.y === 0) {
            setSnackOpen(true);
            setCityLevel(-1);
            setCoordString("");
            setCityCoord({ x: 0, y: 0 });
            return;
        }

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
                type: "CITY",
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

        setCityLevel(-1);
        setCoordString("");
        setCityCoord({ x: 0, y: 0 });
        fetchCities();
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
                <TextField label="坐标" variant="outlined" value={coordString} onChange={handleCoordinateChange} />
                <Button onClick={() => createCity({ level: cityLevel, pos: cityCoord })}>添加城市</Button>
            </div>
            <div className="add-city-label">{`城市等级: ${cityLevelToDisplayText(cityLevel)} 坐标:(${cityCoord.x},${
                cityCoord.y
            })`}</div>
        </div>
    );
}

function CityTable(props: { cities: City[]; selectedCity: number; selectCity: (index: number) => void }): JSX.Element {
    const { cities, selectCity } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    function handlePageChange(_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        setPage(newPage);
    }

    function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }

    const minRange = page * rowsPerPage;
    const maxRange = (page + 1) * rowsPerPage;
    const resultRows: JSX.Element[] = [];

    cities.forEach((city, index) => {
        if (index >= minRange && index < maxRange) {
            const className = index === props.selectedCity ? "map-city selected-city" : "map-city";
            const time = new Date(city.createdAt);
            const hourMinuteString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            const monthDayString = `${time.getMonth() + 1}/${time.getDate()}`;
            const result = (
                <TableRow key={index}>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {index}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {city.level}
                    </TableCell>
                    <TableCell
                        className={className}
                        onClick={() => selectCity(index)}
                    >{`(${city.pos.x},${city.pos.y})`}</TableCell>
                    <TableCell>{city.submitter}</TableCell>
                    <TableCell>{`${monthDayString} - ${hourMinuteString}`}</TableCell>
                </TableRow>
            );
            resultRows.push(result);
        }
    });

    return (
        <div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>等级</TableCell>
                            <TableCell align="center">城市坐标</TableCell>
                            <TableCell align="center">发现人</TableCell>
                            <TableCell>发现日期</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{resultRows}</TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                count={cities.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[8, 16]}
            />
        </div>
    );
}

function cityLabels(
    cities: City[],
    mapScale: number,
    selectedCity: number,
    selectCity: (e: KonvaEventObject<WheelEvent>) => void,
): JSX.Element[] {
    const starRadius = 20;
    const uniqueCities = new Set<string>();
    const labels: JSX.Element[] = [];
    cities.forEach((city, index) => {
        if (uniqueCities.has(`${city.pos.x},${city.pos.y}`)) return;
        uniqueCities.add(`${city.pos.x},${city.pos.y}`);
        const coord = objCoord(city.pos);
        const radius = starRatio(city.level) * (1 / mapScale) * starRadius;
        let color = "#89b717";
        if (index === selectedCity) color = "#ff0000";
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
                onClick={selectCity}
            />,
        );
    });

    return labels;
}

export default AngulumMap;
