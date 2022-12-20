import { Container, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TuneIcon from "@mui/icons-material/Tune";
import {
    addFleet,
    changeSelectedFleet,
    FleetPlannerSetting,
    FleetType,
    updateAvailableShipTypes,
    updateSettings,
} from "../redux/fleet-planner";
import { selectAllAccounts } from "../redux/game-account";
import { changeSelectedAccount, getSelectedAccountId } from "../redux/selected-account";
import {
    displayControl,
    fleetPlannerControlSetting,
    getAllFleets,
    getSelectedFleet,
    selectAvailableShipTypes,
} from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-planner.css";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ShipTypes } from "./data/ship-data-types";
import { FleetShipPicker } from "./fleet-ship-picker";
import { FleetPlan } from "./fleet-plan";
import { randomFleetName } from "./utils/randomName";
import { FleetPlannerSettings } from "../redux/types/fleet-planner.type";

function FleetPlaner(): JSX.Element {
    return (
        <Container maxWidth={false} className="container-main-fleet-planner">
            <div className="fleet-plan-content-container">
                <ControlBar />
                <FleetShipPicker />
                <FleetPlan />
            </div>
        </Container>
    );
}

function ControlBar(): JSX.Element {
    return (
        <div className="fleet-planner-control-bar">
            <FleetControl />
            <GeneralControl />
            <AccountControl />
        </div>
    );
}

function FleetControl(): JSX.Element {
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();
    const fleets = useAppSelector(getAllFleets);
    const selectedFleet = useAppSelector(getSelectedFleet);
    const showControl = useAppSelector(displayControl);

    function handleNewFleet() {
        dispatch(addFleet({ accountId, name: randomFleetName() }));
    }

    function handleSelectedFleetChange(event: React.MouseEvent<HTMLElement>, newIndex: string) {
        const index = Number(newIndex);
        dispatch(changeSelectedFleet({ accountId, index, type: selectedFleet.type }));
    }

    const fleetToggleButtons = fleets.map((fleet, index) => {
        return (
            <ToggleButton value={index} key={index}>
                {fleet.name}
            </ToggleButton>
        );
    });

    function handleFleetTypeChange(event: React.MouseEvent<HTMLElement>, type: FleetType) {
        dispatch(changeSelectedFleet({ accountId, index: selectedFleet.index, type }));
    }

    const fleetTypeToggleButtons: JSX.Element = (
        <ToggleButtonGroup
            exclusive
            value={showControl ? selectedFleet.type : null}
            size="small"
            onChange={handleFleetTypeChange}
            disabled={!showControl}
        >
            <ToggleButton value={FleetType.main}>主队</ToggleButton>
            <ToggleButton value={FleetType.reinforcement}>增援</ToggleButton>
        </ToggleButtonGroup>
    );

    return (
        <div className="fleet-planner-fleet-control">
            <ToggleButtonGroup
                onChange={handleSelectedFleetChange}
                exclusive
                value={showControl ? selectedFleet.index : null}
                size="small"
                disabled={!showControl}
            >
                {fleetToggleButtons}
            </ToggleButtonGroup>
            {fleets.length > 0 ? fleetTypeToggleButtons : null}
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                size="small"
                onClick={handleNewFleet}
                disabled={fleets.length >= 3 || !showControl}
            >
                新舰队
            </Button>
        </div>
    );
}

function GeneralControl(): JSX.Element {
    const selectedTypes = useAppSelector(selectAvailableShipTypes);
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();
    const fleetSettings = useAppSelector(fleetPlannerControlSetting);
    const showControl = useAppSelector(displayControl);

    const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newSelectedTypes: string[]) => {
        const updateAction = { accountId, types: newSelectedTypes as unknown as ShipTypes[] };
        dispatch(updateAvailableShipTypes(updateAction));
    };

    const shipTypeToggleButtons: JSX.Element[] = [];

    Object.values(UNIT_DATA_BASE).forEach((value) => {
        shipTypeToggleButtons.push(
            <ToggleButton color="primary" value={value.type} key={value.type}>
                {value.label}
            </ToggleButton>,
        );
    });

    function handleUpdateSetting(event: React.MouseEvent<HTMLElement>, outputs: string[]) {
        const settings = outputs.map((output) => Number(output));
        const updateAction: FleetPlannerSettings = { accountId, settings };
        dispatch(updateSettings(updateAction));
    }
    return (
        <div className="fleet-planer-general-control">
            <ToggleButtonGroup
                color="success"
                onChange={handleTypeChange}
                value={showControl ? selectedTypes : null}
                size="small"
                disabled={!showControl}
            >
                {shipTypeToggleButtons}
            </ToggleButtonGroup>
            <ToggleButtonGroup value={fleetSettings} onChange={handleUpdateSetting} size="small">
                <ToggleButton value={FleetPlannerSetting.DisplayOwned}>
                    <VisibilityIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value={FleetPlannerSetting.DisplayControl}>
                    <TuneIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

function AccountControl(): JSX.Element {
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();
    const gameAccounts = useAppSelector(selectAllAccounts);

    function handleAccountChange(event: React.MouseEvent<HTMLElement>, newId: string) {
        dispatch(changeSelectedAccount(newId));
    }

    const accountToggleButtons = gameAccounts.map((account) => {
        return (
            <ToggleButton value={account.id} className="account-toggle-button" size="small" key={account.id}>
                {account.name}
            </ToggleButton>
        );
    });
    return (
        <ToggleButtonGroup value={accountId} exclusive onChange={handleAccountChange} color="success" size="small">
            {accountToggleButtons}
        </ToggleButtonGroup>
    );
}

export default FleetPlaner;
