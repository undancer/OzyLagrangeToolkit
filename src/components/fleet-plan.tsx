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
import { displayControl, getAllFleets } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-plan.css";
import {
    decreaseShipCount,
    Fleet,
    FleetType,
    increaseShipCount,
    removeFleet,
    removeShipOrAircraft,
    ShipInFleet,
} from "../redux/fleet-planner";
import { getSelectedAccountId } from "../redux/selected-account";
import { lookUpShipById } from "./data/ship-data";
import { isShipData } from "./data/ship-data-types";
import { EditRemoveShip } from "../redux/types/fleet-planner.type";

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
    const { fleet, fleetIndex } = props;

    function handleRemoveFleet() {
        dispatch(removeFleet({ accountId, name: fleet.name }));
    }

    let mainTotal = 0;
    let mainCount = 0;

    const mainRows = fleet.mainFleet.map((ship, index) => {
        const data = lookUpShipById(ship.shipId);
        if (!data) return null;
        mainTotal += data.pop * ship.count;
        mainCount += ship.count;
        return <ShipTableRow ship={ship} fleetIndex={fleetIndex} shipIndex={index} type={FleetType.main} key={index} />;
    });

    let reinforcementTotal = 0;
    let reinforcementCount = 0;

    const reinforcementRow = fleet.reinforcement.map((ship, index) => {
        const data = lookUpShipById(ship.shipId);
        if (!data) return null;
        reinforcementTotal += data.pop * ship.count;
        reinforcementCount += ship.count;
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

    const removeFleetButton: JSX.Element = (
        <IconButton color="error" size="small" onClick={handleRemoveFleet}>
            <DeleteOutlineIcon />
        </IconButton>
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
            <Table sx={{ width: 510 }} size="small">
                <TableHead>
                    <TableCell></TableCell>
                    <TableCell align="center">飞机/炮艇</TableCell>
                    <TableCell align="center">载机舰</TableCell>
                    <TableCell align="right" width={40}>
                        🚁 50
                    </TableCell>
                    <TableCell align="right" width={40}>
                        🚤 30
                    </TableCell>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">新大地B192</TableCell>
                        <TableCell>n/a</TableCell>
                        <TableCell align="center">10</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <ShipTableFooter values={[0, 0]} />
                </TableBody>
            </Table>
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

function ShipTableFooter(props: { values: number[] }) {
    const { values } = props;
    return (
        <TableRow>
            <TableCell colSpan={2} className="no-border"></TableCell>
            <TableCell>合计</TableCell>
            <TableCell align="center">{values[0]}</TableCell>
            <TableCell align="right">{values[1]}</TableCell>
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
    const { shipId, count, variant } = ship;

    function handleRemoveShip() {
        const action: EditRemoveShip = { accountId, shipIndex, fleetIndex, type };
        dispatch(removeShipOrAircraft(action));
    }

    function handleIncreaseCount() {
        const action: EditRemoveShip = { accountId, shipIndex, fleetIndex, type };
        dispatch(increaseShipCount(action));
    }

    function handleDecreaseShipCount() {
        const action: EditRemoveShip = { accountId, shipIndex, fleetIndex, type };
        dispatch(decreaseShipCount(action));
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
            <IconButton color="error" size="small" onClick={handleDecreaseShipCount} disabled={count <= 0}>
                <RemoveIcon />
            </IconButton>
            <IconButton color="warning" size="small" onClick={handleRemoveShip}>
                <DeleteOutlineIcon />
            </IconButton>
        </TableCell>
    );

    return (
        <TableRow>
            {showControl ? controlCell : <TableCell width={1}></TableCell>}
            <TableCell>{`${data.name}${addOn}`}</TableCell>
            <TableCell align="center">{data.pop}</TableCell>
            <TableCell align="center">{count}</TableCell>
            <TableCell align="right">{data.pop * count}</TableCell>
        </TableRow>
    );
}
