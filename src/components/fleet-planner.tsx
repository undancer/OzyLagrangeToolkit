import { Container, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { addFleet, changeSelectedFleet, FleetType, updateAvailableShipTypes } from "../redux/fleet-planner";
import { selectAllAccounts } from "../redux/game-account";
import { changeSelectedAccount, getSelectedAccountId } from "../redux/selected-account";
import { getAllFleets, getSelectedFleet, selectAvailableShipTypes } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-planner.css";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ShipTypes } from "./data/ship-data-types";
import { FleetShipPicker } from "./fleet-ship-picker";
import { FleetManager } from "./fleet-manager";
import { randomFleetName } from "./utils/randomName";

function FleetPlaner(): JSX.Element {
    return (
        <Container maxWidth={false} className="container-main-fleet-planner">
            <div className="fleet-plan-content-container">
                <ControlBar />
                <FleetShipPicker />
                <FleetManager />
            </div>
        </Container>
    );
}

function ControlBar(): JSX.Element {
    const selectedTypes = useAppSelector(selectAvailableShipTypes);
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();
    const gameAccounts = useAppSelector(selectAllAccounts);
    const fleets = useAppSelector(getAllFleets);
    const selectedFleet = useAppSelector(getSelectedFleet);

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

    function handleNewFleet() {
        dispatch(addFleet({ accountId, name: randomFleetName() }));
    }

    function handleSelectedFleetChange(event: React.MouseEvent<HTMLElement>, newIndex: string) {
        const index = Number(newIndex);
        dispatch(changeSelectedFleet({ accountId, index, type: selectedFleet.type }));
    }

    function handleFleetTypeChange(event: React.MouseEvent<HTMLElement>, type: FleetType) {
        dispatch(changeSelectedFleet({ accountId, index: selectedFleet.index, type }));
    }

    const fleetToggleButtons = fleets.map((fleet, index) => {
        return (
            <ToggleButton value={index} key={index}>
                {fleet.name}
            </ToggleButton>
        );
    });

    const fleetTypeToggleButtons: JSX.Element = (
        <ToggleButtonGroup exclusive value={selectedFleet.type} size="small" onChange={handleFleetTypeChange}>
            <ToggleButton value={FleetType.main}>主队</ToggleButton>
            <ToggleButton value={FleetType.reinforcement}>增援</ToggleButton>
        </ToggleButtonGroup>
    );

    return (
        <div className="fleet-planner-control-bar">
            <div className="fleet-planner-fleet-control">
                <ToggleButtonGroup
                    onChange={handleSelectedFleetChange}
                    exclusive
                    value={selectedFleet.index}
                    size="small"
                >
                    {fleetToggleButtons}
                </ToggleButtonGroup>
                {fleets.length > 0 ? fleetTypeToggleButtons : null}
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={handleNewFleet}
                    disabled={fleets.length >= 3}
                >
                    新舰队
                </Button>
            </div>
            <ToggleButtonGroup color="success" onChange={handleTypeChange} value={selectedTypes} size="small">
                {shipTypeToggleButtons}
            </ToggleButtonGroup>
            <ToggleButtonGroup value={accountId} exclusive onChange={handleAccountChange} color="success">
                {accountToggleButtons}
            </ToggleButtonGroup>
        </div>
    );
}

export default FleetPlaner;
