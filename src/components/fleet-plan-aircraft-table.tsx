import { Table, TableHead, TableRow, TableBody, TableCell, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ScienceIcon from "@mui/icons-material/Science";
import {
    displayControl,
    getFleetAirTotal,
    getFleetShipTechPointLookupTable,
    getFleetsAirCapacity,
} from "../redux/selector/fleet-planner.selector";
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
    removeShipOrAircraft,
} from "../redux/fleet-planner";
import { getSelectedAccountId } from "../redux/selected-account";
import { lookUpShipById } from "./data/ship-data";
import { isShipData, ShipTypes } from "./data/ship-data-types";
import { EditRemoveShipOrAircraft } from "../redux/types/fleet-planner.type";
import { AirCapacity } from "./data/air-capacity";

export function FleetPlanAircraftTable(props: { fleet: Fleet; fleetIndex: number }): JSX.Element | null {
    const { fleet, fleetIndex } = props;
    const fleetCapacities = useAppSelector(getFleetsAirCapacity);
    const totalAircraft = useAppSelector(getFleetAirTotal)[fleetIndex];
    const editMode = useAppSelector(displayControl);
    const capacity: AirCapacity = fleetCapacities[fleetIndex];

    const hideAircraftTable: boolean =
        fleet.aircraft.length < 1 && capacity.corvette === 0 && capacity.heavyAir === 0 && capacity.midAir === 0;
    if (hideAircraftTable) return null;

    const aircraftRow = fleet.aircraft.map((aircraft, index) => {
        if (editMode) {
            return <AircraftTableRow aircraft={aircraft} fleetIndex={fleetIndex} aircraftIndex={index} key={index} />;
        }
        return <DisplayAircraftRow aircraft={aircraft} fleetIndex={fleetIndex} aircraftIndex={index} key={index} />;
    });

    const totalAir = totalAircraft.midAir + totalAircraft.heavyAir;
    const maxAir = capacity.midAir + capacity.heavyAir;

    return (
        <Table sx={{ width: 560 }} size="small">
            <TableHead>
                <TableCell colSpan={2} align="center">
                    空军
                </TableCell>
                <TableCell width={64}></TableCell>
                <TableCell align="center" width={64}>
                    飞机
                </TableCell>
                <TableCell align="center" width={75}>
                    炮艇
                </TableCell>
            </TableHead>
            <TableBody>
                {aircraftRow}
                <TableRow>
                    <TableCell colSpan={2} className="no-border"></TableCell>
                    <TableCell>合计</TableCell>
                    <TableCell align="center">
                        {totalAir}/{maxAir}
                    </TableCell>
                    <TableCell align="center">
                        {totalAircraft.corvette}/{capacity.corvette}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

// A function that returns a single row in the table for a single aircraft, used for display purposes.
function DisplayAircraftRow(props: { aircraft: AircraftInFleet; fleetIndex: number; aircraftIndex: number }) {
    const { aircraft, fleetIndex, aircraftIndex: shipIndex } = props;
    const { shipId, count, variant, leveled, adjusted } = aircraft;
    const type = FleetType.aircraft;

    const dispatch = useAppDispatch();
    const accountId = useAppSelector(getSelectedAccountId);
    const techPointLookupTable = useAppSelector(getFleetShipTechPointLookupTable);

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
    const techDisplayData = techPointLookupTable[shipId];

    const tagCell: JSX.Element = (
        <TableCell width={80}>
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
            {tagCell}
            <TableCell>{`${data.name}${addOn}`}</TableCell>
            <TableCell>
                <div className={techDisplayData.type}>{techDisplayData.text}</div>
            </TableCell>
            <TableCell align="center">{isCorvette ? null : count}</TableCell>
            <TableCell align="center">{isCorvette ? count : null}</TableCell>
        </TableRow>
    );
}

function AircraftTableRow(props: {
    aircraft: AircraftInFleet;
    fleetIndex: number;
    aircraftIndex: number;
}): JSX.Element | null {
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();

    const { aircraft, fleetIndex, aircraftIndex: shipIndex } = props;
    const { shipId, count, variant } = aircraft;
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

    return (
        <TableRow>
            {controlCell}
            <TableCell colSpan={2}>{`${data.name}${addOn}`}</TableCell>
            <TableCell align="center">{isCorvette ? null : count}</TableCell>
            <TableCell align="center">{isCorvette ? count : null}</TableCell>
        </TableRow>
    );
}
