import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ScienceIcon from "@mui/icons-material/Science";
import { displayControl, getAllFleets, useMainModule } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-plan.css";
import {
    AircraftInFleet,
    decreaseShipCount,
    Fleet,
    FleetType,
    flipAdjustedFlag,
    flipLeveledFlag,
    increaseShipCount,
    removeFleet,
    removeShipOrAircraft,
    ShipInFleet,
} from "../redux/fleet-planner";
import { getSelectedAccountId } from "../redux/selected-account";
import { lookUpShipById } from "./data/ship-data";
import { isShipData, ShipTypes } from "./data/ship-data-types";
import { EditRemoveShipOrAircraft } from "../redux/types/fleet-planner.type";
import { addCapacity, AirCapacity, ShipAirCapacity, SuperCapAirCapacity } from "./data/air-capacity";
import { getOwnedSuperCapLookUpTable } from "../redux/selector/acquired-blue-prints";

export function FleetPlan(): JSX.Element {
    const fleets = useAppSelector(getAllFleets);
    if (fleets.length < 0)
        return (
            <Paper className="fleet-manager-container">
                <Typography>没有舰队啊。</Typography>
            </Paper>
        );

    const fleetControls: JSX.Element[] = fleets.map((fleet, index) => {
        return <IndividualFleetControl fleet={fleet} fleetIndex={index} key={index} />;
    });

    return <div className="fleet-manager-container">{fleetControls}</div>;
}

function IndividualFleetControl(props: { fleet: Fleet; fleetIndex: number }): JSX.Element {
    const accountId = useAppSelector(getSelectedAccountId);
    const showControl = useAppSelector(displayControl);
    const dispatch = useAppDispatch();
    const ownedLookupTable = useAppSelector(getOwnedSuperCapLookUpTable);
    const { fleet, fleetIndex } = props;
    const mainModule = useAppSelector(useMainModule);

    function handleRemoveFleet() {
        dispatch(removeFleet({ accountId, name: fleet.name }));
    }
    const capacity: AirCapacity = { corvette: 0, midAir: 0, heavyAir: 0 };

    let mainTotal = 0;
    let mainCount = 0;

    const mainRows = fleet.mainFleet.map((ship, index) => {
        const data = lookUpShipById(ship.shipId);
        if (!data) return null;
        mainTotal += data.pop * ship.count;
        mainCount += ship.count;
        if (data.type === ShipTypes.carrier || data.type === ShipTypes.battleCruiser) {
            const ownedSuperCap = ownedLookupTable[ship.shipId];
            addCapacity(capacity, SuperCapAirCapacity(ship.shipId, ownedSuperCap.modules, mainModule), ship.count);
        } else {
            addCapacity(capacity, ShipAirCapacity(ship.shipId, ship.variant), ship.count);
        }
        return <ShipTableRow ship={ship} fleetIndex={fleetIndex} shipIndex={index} type={FleetType.main} key={index} />;
    });

    let reinforcementTotal = 0;
    let reinforcementCount = 0;

    const reinforcementRow = fleet.reinforcement.map((ship, index) => {
        const data = lookUpShipById(ship.shipId);
        if (!data) return null;
        reinforcementTotal += data.pop * ship.count;
        reinforcementCount += ship.count;
        if (data.type === ShipTypes.carrier || data.type === ShipTypes.battleCruiser) {
            const ownedSuperCap = ownedLookupTable[ship.shipId];
            addCapacity(capacity, SuperCapAirCapacity(ship.shipId, ownedSuperCap.modules, mainModule), ship.count);
        } else {
            addCapacity(capacity, ShipAirCapacity(ship.shipId, ship.variant), ship.count);
        }
        return (
            <ShipTableRow
                ship={ship}
                fleetIndex={fleetIndex}
                shipIndex={index}
                type={FleetType.reinforcement}
                key={index}
            />
        );
    });

    let aircraftCount = 0;
    let corvetteCount = 0;

    const hideAircraftTable: boolean =
        fleet.aircraft.length < 1 && capacity.corvette === 0 && capacity.heavyAir === 0 && capacity.midAir === 0;

    const aircraftRow = fleet.aircraft.map((aircraft, index) => {
        const data = lookUpShipById(aircraft.shipId);
        if (!data) return null;
        if (data.type === ShipTypes.corvette) corvetteCount += aircraft.count;
        else aircraftCount += aircraft.count;
        return <AircraftTableRow aircraft={aircraft} fleetIndex={fleetIndex} aircraftIndex={index} key={index} />;
    });

    const removeFleetButton: JSX.Element = (
        <IconButton color="error" size="small" onClick={handleRemoveFleet}>
            <DeleteOutlineIcon />
        </IconButton>
    );

    const aircraftTable = (
        <Table sx={{ width: 510 }} size="small">
            <TableHead>
                <TableCell></TableCell>
                <TableCell align="center">飞机/炮艇</TableCell>
                <TableCell width={35}></TableCell>
                <TableCell align="center" width={75}>
                    {`🚁 ${capacity.midAir + capacity.heavyAir} (${capacity.heavyAir})`}
                </TableCell>
                <TableCell align="center" width={40}>
                    🚤 {capacity.corvette}
                </TableCell>
            </TableHead>
            <TableBody>
                {aircraftRow}
                <TableRow>
                    <TableCell colSpan={2} className="no-border"></TableCell>
                    <TableCell>合计</TableCell>
                    <TableCell align="center">{aircraftCount}</TableCell>
                    <TableCell align="center">{corvetteCount}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );

    return (
        <TableContainer component={Paper} sx={{ width: 510 }}>
            <div className="fleet-manager-table-title-box">
                <Typography variant="h5">{fleet.name}</Typography>
                {showControl ? removeFleetButton : null}
            </div>
            <Table sx={{ width: 510 }} size="small">
                <ShipTableHeader titles={["主力部队", "人口", "数量", "总人口"]} />
                <TableBody>
                    {mainRows}
                    <ShipTableFooter values={[mainCount, mainTotal]} />
                </TableBody>
            </Table>
            <div className="fleet-plan-table-divider"></div>
            <Table sx={{ width: 510 }} size="small">
                <ShipTableHeader titles={["增援部队", "人口", "数量", "总人口"]} />
                <TableBody>
                    {reinforcementRow}
                    <ShipTableFooter values={[reinforcementCount, reinforcementTotal]} />
                </TableBody>
            </Table>
            <div className="fleet-plan-table-divider"></div>
            {hideAircraftTable ? null : aircraftTable}
        </TableContainer>
    );
}

function ShipTableHeader(props: { titles: string[] }) {
    const { titles } = props;
    return (
        <TableHead>
            <TableCell colSpan={2} align="center">
                {titles[0]}
            </TableCell>
            <TableCell width={30} align="center">
                {titles[1]}
            </TableCell>
            <TableCell width={30} align="center">
                {titles[2]}
            </TableCell>
            <TableCell width={45} align="center">
                {titles[3]}
            </TableCell>
        </TableHead>
    );
}

function ShipTableFooter(props: { values: number[]; isAir?: boolean }) {
    const { values, isAir } = props;
    return (
        <TableRow>
            <TableCell colSpan={2} className="no-border"></TableCell>
            <TableCell>合计</TableCell>
            <TableCell align="center">{values[0]}</TableCell>
            <TableCell align={isAir ? "center" : "right"}>{values[1]}</TableCell>
        </TableRow>
    );
}

function ShipTableRow(props: {
    ship: ShipInFleet;
    fleetIndex: number;
    shipIndex: number;
    type: FleetType;
}): JSX.Element | null {
    const accountId = useAppSelector(getSelectedAccountId);
    const showControl = useAppSelector(displayControl);
    const dispatch = useAppDispatch();

    const { ship, fleetIndex, shipIndex, type } = props;
    const { shipId, count, variant, leveled, adjusted } = ship;

    function handleRemoveShip() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(removeShipOrAircraft(action));
    }

    function handleIncreaseCount() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(increaseShipCount(action));
    }

    function handleDecreaseCount() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(decreaseShipCount(action));
    }

    function handleLeveled() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(flipLeveledFlag(action));
    }

    function handleAdjusted() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(flipAdjustedFlag(action));
    }

    const data = lookUpShipById(shipId);
    if (!data) return null;
    let addOn = "";
    if (isShipData(data) && data.variants[0] !== "") addOn = ` - ${data.variants[variant]}`;
    const controlCell: JSX.Element = (
        <TableCell width={110}>
            <IconButton color="success" size="small" onClick={handleIncreaseCount} disabled={count >= data.limit}>
                <AddIcon />
            </IconButton>
            <IconButton color="error" size="small" onClick={handleDecreaseCount} disabled={count <= 0}>
                <RemoveIcon />
            </IconButton>
            <IconButton color="warning" size="small" onClick={handleRemoveShip}>
                <DeleteOutlineIcon />
            </IconButton>
        </TableCell>
    );

    const tagCell: JSX.Element = (
        <TableCell width={60}>
            <IconButton size="small" color={leveled ? "warning" : "default"} onClick={handleLeveled}>
                <MilitaryTechIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" color={adjusted ? "primary" : "default"} onClick={handleAdjusted}>
                <ScienceIcon fontSize="inherit" />
            </IconButton>
        </TableCell>
    );

    return (
        <TableRow>
            {showControl ? controlCell : tagCell}
            <TableCell>{`${data.name}${addOn}`}</TableCell>
            <TableCell align="center">{data.pop}</TableCell>
            <TableCell align="center">{count}</TableCell>
            <TableCell align="right">{data.pop * count}</TableCell>
        </TableRow>
    );
}

function AircraftTableRow(props: {
    aircraft: AircraftInFleet;
    fleetIndex: number;
    aircraftIndex: number;
}): JSX.Element | null {
    const accountId = useAppSelector(getSelectedAccountId);
    const showControl = useAppSelector(displayControl);
    const dispatch = useAppDispatch();

    const { aircraft, fleetIndex, aircraftIndex: shipIndex } = props;
    const { shipId, count, variant, leveled, adjusted } = aircraft;
    const type = FleetType.aircraft;

    function handleRemoveAircraft() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(removeShipOrAircraft(action));
    }

    function handleIncreaseCount() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(increaseShipCount(action));
    }

    function handleDecreaseCount() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(decreaseShipCount(action));
    }

    function handleLeveled() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(flipLeveledFlag(action));
    }

    function handleAdjusted() {
        const action: EditRemoveShipOrAircraft = { accountId, shipIndex, fleetIndex, type };
        dispatch(flipAdjustedFlag(action));
    }

    const data = lookUpShipById(shipId);
    if (!data) return null;
    const isCorvette = data.type === ShipTypes.corvette;
    let addOn = "";
    if (isShipData(data) && data.variants[0] !== "") addOn = ` - ${data.variants[variant]}`;

    const controlCell: JSX.Element = (
        <TableCell width={110}>
            <IconButton color="success" size="small" onClick={handleIncreaseCount} disabled={count >= data.limit}>
                <AddIcon />
            </IconButton>
            <IconButton color="error" size="small" onClick={handleDecreaseCount} disabled={count <= 0}>
                <RemoveIcon />
            </IconButton>
            <IconButton color="warning" size="small" onClick={handleRemoveAircraft}>
                <DeleteOutlineIcon />
            </IconButton>
        </TableCell>
    );

    const tagCell: JSX.Element = (
        <TableCell width={60}>
            <IconButton size="small" color={leveled ? "warning" : "default"} onClick={handleLeveled}>
                <MilitaryTechIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" color={adjusted ? "primary" : "default"} onClick={handleAdjusted}>
                <ScienceIcon fontSize="inherit" />
            </IconButton>
        </TableCell>
    );

    return (
        <TableRow>
            {showControl ? controlCell : tagCell}
            <TableCell colSpan={2}>{`${data.name}${addOn}`}</TableCell>
            <TableCell align="center">{isCorvette ? null : count}</TableCell>
            <TableCell align="center">{isCorvette ? count : null}</TableCell>
        </TableRow>
    );
}
