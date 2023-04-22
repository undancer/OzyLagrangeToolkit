import { Paper, TableContainer, Typography, IconButton, Input } from "@mui/material";
import { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import BrushIcon from "@mui/icons-material/Brush";
import { displayControl, getAllFleets } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-plan.css";
import { changeFleetName, Fleet, removeFleet } from "../redux/fleet-planner";
import { getSelectedAccountId } from "../redux/selected-account";
import { FleetPlanShipTable } from "./fleet-plan-ship-table";
import { FleetPlanAircraftTable } from "./fleet-plan-aircraft-table";

export function FleetPlan(): JSX.Element {
    const fleets = useAppSelector(getAllFleets);
    if (fleets.length < 0)
        return (
            <div className="fleet-manager-container">
                <Typography>没有舰队啊。</Typography>
            </div>
        );

    const fleetControls: JSX.Element[] = fleets.map((fleet, index) => {
        return <IndividualFleetPlanner fleet={fleet} fleetIndex={index} key={index} />;
    });

    return <div className="fleet-manager-container">{fleetControls}</div>;
}

function IndividualFleetPlanner(props: { fleet: Fleet; fleetIndex: number }): JSX.Element {
    const accountId = useAppSelector(getSelectedAccountId);
    const showControl = useAppSelector(displayControl);
    const dispatch = useAppDispatch();
    const [changingName, setChangingName] = useState(false);
    const [name, setName] = useState("");
    const { fleet, fleetIndex } = props;

    function handleRemoveFleet() {
        dispatch(removeFleet({ accountId, index: fleetIndex }));
    }

    function handleNameChange() {
        if (name !== "") dispatch(changeFleetName({ accountId, fleetIndex, name }));
        setName("");
        setChangingName(false);
    }

    function updateFleetName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    let fleetTitleBox: JSX.Element = (
        <div className="fleet-manager-table-title-box">
            <Typography variant="h5">{fleet.name}</Typography>
        </div>
    );

    if (showControl) {
        if (!changingName) {
            fleetTitleBox = (
                <div className="fleet-manager-table-title-box">
                    <Typography variant="h5">{fleet.name}</Typography>
                    <div className="fleet-manager-table-title-button-group">
                        <IconButton color="primary" size="small" onClick={() => setChangingName(true)}>
                            <BrushIcon />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={handleRemoveFleet}>
                            <HighlightOffIcon />
                        </IconButton>
                    </div>
                </div>
            );
        } else {
            fleetTitleBox = (
                <div className="fleet-manager-table-title-box">
                    <Input placeholder={fleet.name} value={name} onChange={updateFleetName} />
                    <IconButton color="success" size="small" onClick={handleNameChange}>
                        <DoneIcon />
                    </IconButton>
                </div>
            );
        }
    }

    return (
        <TableContainer component={Paper} sx={{ width: 510 }}>
            {fleetTitleBox}
            <FleetPlanShipTable fleet={fleet} fleetIndex={fleetIndex} type="main" />
            <div className="fleet-plan-table-divider"></div>
            <FleetPlanShipTable fleet={fleet} fleetIndex={fleetIndex} type="reinforce" />
            <div className="fleet-plan-table-divider"></div>
            <FleetPlanAircraftTable fleet={fleet} fleetIndex={fleetIndex} />
        </TableContainer>
    );
}
