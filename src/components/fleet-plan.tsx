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
    removeShip,
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
                <TableHead>
                    <TableCell colSpan={2} align="center">
                        主力部队
                    </TableCell>
                    <TableCell width={30} align="center">
                        人口
                    </TableCell>
                    <TableCell width={30} align="center">
                        数量
                    </TableCell>
                    <TableCell width={45} align="center">
                        总人口
                    </TableCell>
                </TableHead>
                <TableBody>
                    {mainRows}
                    <TableRow>
                        <TableCell colSpan={2} className="no-border"></TableCell>
                        <TableCell>合计</TableCell>
                        <TableCell align="center">{mainCount}</TableCell>
                        <TableCell align="right">{mainTotal}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="fleet-plan-table-divider"></div>
            <Table sx={{ width: 510 }} size="small">
                <TableHead>
                    <TableCell colSpan={2} align="center">
                        增援部队
                    </TableCell>
                    <TableCell width={30} align="center">
                        人口
                    </TableCell>
                    <TableCell width={30} align="center">
                        数量
                    </TableCell>
                    <TableCell width={45} align="center">
                        总人口
                    </TableCell>
                </TableHead>
                <TableBody>
                    {reinforcementRow}
                    <TableRow>
                        <TableCell colSpan={2} className="no-border"></TableCell>
                        <TableCell>合计</TableCell>
                        <TableCell align="center">{reinforcementCount}</TableCell>
                        <TableCell align="right">{reinforcementTotal}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
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
        dispatch(removeShip(action));
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
