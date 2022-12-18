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
import { getAllFleets } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-manager.css";
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

export function FleetManager(): JSX.Element {
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
    const dispatch = useAppDispatch();
    const { fleet, fleetIndex } = props;

    function handleRemoveFleet() {
        dispatch(removeFleet({ accountId, name: fleet.name }));
    }

    let mainTotal = 0;

    const mainRows = fleet.mainFleet.map((ship, index) => {
        const data = lookUpShipById(ship.shipId);
        if (!data) return null;
        mainTotal += data.pop * ship.count;
        return <ShipTableRow ship={ship} fleetIndex={fleetIndex} shipIndex={index} type={FleetType.main} key={index} />;
    });

    let reinforcementTotal = 0;

    const reinforcementRow = fleet.reinforcement.map((ship, index) => {
        const data = lookUpShipById(ship.shipId);
        if (!data) return null;
        reinforcementTotal += data.pop * ship.count;
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

    return (
        <TableContainer component={Paper} sx={{ width: 510 }}>
            <div className="fleet-manager-table-title-box">
                <Typography variant="h5">{fleet.name}</Typography>{" "}
                <IconButton color="error" size="small" onClick={handleRemoveFleet}>
                    <DeleteOutlineIcon />
                </IconButton>
            </div>
            <Table sx={{ width: 510 }} size="small">
                <TableHead>
                    <TableCell colSpan={2} align="center">
                        主队
                    </TableCell>
                    <TableCell>人口</TableCell>
                    <TableCell>数量</TableCell>
                    <TableCell>合计</TableCell>
                </TableHead>
                <TableBody>{mainRows}</TableBody>
            </Table>
            <div className="fleet-manager-table-footer">
                <Typography className="fleet-table-total">人口总计: {mainTotal}</Typography>
            </div>
            <Table sx={{ width: 510 }} size="small">
                <TableHead>
                    <TableCell colSpan={2} align="center">
                        增援
                    </TableCell>
                    <TableCell>人口</TableCell>
                    <TableCell>数量</TableCell>
                    <TableCell>合计</TableCell>
                </TableHead>
                <TableBody>{reinforcementRow}</TableBody>
            </Table>
            <div className="fleet-manager-table-footer">
                <Typography className="fleet-table-total">人口总计: {reinforcementTotal}</Typography>
            </div>
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
    return (
        <TableRow>
            <TableCell>
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
            <TableCell>{`${data.name}${addOn}`}</TableCell>
            <TableCell>{data.pop}</TableCell>
            <TableCell>{count}</TableCell>
            <TableCell>{data.pop * count}</TableCell>
        </TableRow>
    );
}
