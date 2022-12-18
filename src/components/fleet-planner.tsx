import { Container, Card, Typography, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import React from "react";
import { updateAvailableShipTypes } from "../redux/fleet-planner";
import { selectAllAccounts } from "../redux/game-account";
import { changeSelectedAccount, getSelectedAccountId } from "../redux/selected-account";
import { selectAvailableShipTypes } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-planner.css";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ShipTypes, UnitDataGroup } from "./data/ship-data-types";

function FleetPlaner(): JSX.Element {
    return (
        <Container maxWidth={false} className="container-main-fleet-planner">
            <div className="fleet-plan-content-container">
                <ControlBar />
                <MergedShipSelector />
            </div>
        </Container>
    );
}

function ControlBar(): JSX.Element {
    const selectedTypes = useAppSelector(selectAvailableShipTypes);
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();
    const gameAccounts = useAppSelector(selectAllAccounts);

    const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newSelectedTypes: string[]) => {
        const updateAction = { id: accountId, types: newSelectedTypes as unknown as ShipTypes[] };
        dispatch(updateAvailableShipTypes(updateAction));
    };

    const shipTypeToggleButtons: JSX.Element[] = [];

    Object.values(UNIT_DATA_BASE).forEach((value) => {
        shipTypeToggleButtons.push(
            <ToggleButton color="primary" value={value.type}>
                {value.label}
            </ToggleButton>,
        );
    });

    function handleAccountChange(event: React.MouseEvent<HTMLElement>, newId: string) {
        dispatch(changeSelectedAccount(newId));
    }

    const accountToggleButtons = gameAccounts.map((account) => {
        return (
            <ToggleButton value={account.id} className="account-toggle-button" size="small">
                {account.name}
            </ToggleButton>
        );
    });

    return (
        <div className="fleet-planner-control-bar">
            <ToggleButtonGroup color="success" onChange={handleTypeChange} value={selectedTypes} size="small">
                {shipTypeToggleButtons}
            </ToggleButtonGroup>

            <ToggleButtonGroup value={accountId} exclusive onChange={handleAccountChange} color="success">
                {accountToggleButtons}
            </ToggleButtonGroup>
        </div>
    );
}

function MergedShipSelector(): JSX.Element {
    const selectedTypes = useAppSelector(selectAvailableShipTypes);
    let resultCards: JSX.Element[] = [];
    selectedTypes.forEach((type) => {
        switch (type) {
            case ShipTypes.cruiser:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.cruisers }));
                break;
            case ShipTypes.destroyer:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.destroyers }));
                break;
            case ShipTypes.frigate:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.frigates }));
                break;
            case ShipTypes.corvette:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.corvettes }));
                break;
            case ShipTypes.aircraft:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.aircrafts }));
                break;
            case ShipTypes.battleCruiser:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.battleCruisers }));
                break;
            case ShipTypes.carrier:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.carriers }));
                break;
            default:
            // Do nothing
        }
    });
    return (
        <div className="fleet-planner-ship-type-container">
            <div className="fleet-planner-ship-type-selector">{resultCards}</div>
        </div>
    );
}

function shipCardsByType(props: { data: UnitDataGroup }): JSX.Element[] {
    const { data } = props;
    let shipCards: JSX.Element[] = [];
    switch (data.type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
            shipCards = data.list.map((shipData) => {
                const buttons: JSX.Element[] = shipData.variants.map((variant, index) => {
                    return (
                        <Button key={index} size="small" variant="text">
                            {variant !== "" ? variant : "基础型"}
                        </Button>
                    );
                });
                return (
                    <Card key={shipData.id} variant="outlined">
                        <Typography textAlign={"center"} className="typography-ship-name">
                            {shipData.name}
                        </Typography>
                        {buttons}
                    </Card>
                );
            });
            break;
        case ShipTypes.aircraft:
            shipCards = data.list.map((shipData) => {
                return (
                    <Card key={shipData.id} variant="outlined">
                        <Typography textAlign={"center"} className="typography-ship-name">
                            {shipData.name}
                        </Typography>
                        <Button size="small" variant="text">
                            {"基础型"}
                        </Button>
                    </Card>
                );
            });
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            shipCards = data.list.map((shipData) => {
                return (
                    <Card key={shipData.id} variant="outlined">
                        <Typography textAlign={"center"} className="typography-ship-name">
                            {shipData.name}
                        </Typography>
                        <Button size="small" variant="text">
                            {"基础型"}
                        </Button>
                    </Card>
                );
            });
            break;
        default:
        // Do nothing
    }

    return shipCards;
}

export default FleetPlaner;
