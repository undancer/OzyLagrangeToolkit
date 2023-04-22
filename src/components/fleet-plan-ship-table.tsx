import { Table, TableRow, TableBody, TableCell, IconButton, TableHead } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ScienceIcon from "@mui/icons-material/Science";
import {
    decreaseShipCount,
    Fleet,
    FleetType,
    flipAdjustedFlag,
    flipLeveledFlag,
    increaseShipCount,
    removeShipOrAircraft,
    ShipInFleet,
} from "../redux/fleet-planner";
import { lookUpShipById } from "./data/ship-data";
import { isShipData } from "./data/ship-data-types";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { displayControl, getFleetDataTotal } from "../redux/selector/fleet-planner.selector";
import { EditRemoveShipOrAircraft } from "../redux/types/fleet-planner.type";
import { getSelectedAccountId } from "../redux/selected-account";

export function FleetPlanShipTable(props: {
    fleet: Fleet;
    fleetIndex: number;
    type: "main" | "reinforce";
}): JSX.Element {
    const { fleet, fleetIndex, type } = props;

    const selectedFleet = type === "main" ? fleet.mainFleet : fleet.reinforcement;
    const fleetType = type === "main" ? FleetType.main : FleetType.reinforcement;

    const rows = selectedFleet.map((ship, index) => {
        return <ShipTableRow ship={ship} fleetIndex={fleetIndex} shipIndex={index} type={fleetType} key={index} />;
    });

    const title = type === "main" ? "主力部队" : "增援部队";

    return (
        <Table sx={{ width: 510 }} size="small">
            <ShipTableHeader titles={[title, "人口", "数量", "总人口"]} />
            <TableBody>
                {rows}
                <ShipTableFooter fleetIndex={fleetIndex} type={type} />
            </TableBody>
        </Table>
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
    // const ownedLookupTable = useAppSelector(getOwnedShipLookUpTable);
    const dispatch = useAppDispatch();

    const { ship, fleetIndex, shipIndex, type } = props;
    const { shipId, count, variant, leveled, adjusted } = ship;

    // const ownedShip = ownedLookupTable[shipId];

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

function ShipTableFooter(props: { fleetIndex: number; type: "main" | "reinforce" }) {
    const { fleetIndex, type } = props;
    const fleetTotal = useAppSelector(getFleetDataTotal);
    const total = fleetTotal[fleetIndex][type];
    return (
        <TableRow>
            <TableCell colSpan={2} className="no-border"></TableCell>
            <TableCell>合计</TableCell>
            <TableCell align="center">{total.count}</TableCell>
            <TableCell align="right">{total.population}</TableCell>
        </TableRow>
    );
}
