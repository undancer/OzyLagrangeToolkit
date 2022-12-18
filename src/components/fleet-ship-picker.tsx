import { Card, Typography, Button } from "@mui/material";
import { selectAvailableShipTypes } from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { AircraftData, ShipData, ShipTypes, SuperCapData, UnitDataGroup } from "./data/ship-data-types";
import "./css/fleet-ship-picker.css";
import { addShip } from "../redux/fleet-planner";
import { getSelectedAccountId } from "../redux/selected-account";

export function FleetShipPicker(): JSX.Element {
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
    const { type, list } = props.data;
    let shipCards: JSX.Element[] = [];
    switch (type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
            shipCards = list.map((data) => <ShipCard shipData={data} key={data.id} />);
            break;
        case ShipTypes.corvette:
            shipCards = list.map((data) => <ShipCard shipData={data} key={data.id} disabled={true} />);
            break;
        case ShipTypes.aircraft:
            shipCards = list.map((data) => <AircraftCard airData={data} key={data.id} disabled={true} />);
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            shipCards = list.map((data) => <SuperCapCard superCapData={data} key={data.id} />);
            break;
        default:
        // Do nothing
    }

    return shipCards;
}

function SuperCapCard(props: { superCapData: SuperCapData; disabled?: boolean }): JSX.Element {
    const { superCapData, disabled } = props;
    const shipId = superCapData.id;
    const dispatch = useAppDispatch();
    const accountId = useAppSelector(getSelectedAccountId);

    function handleAddShip() {
        dispatch(addShip({ accountId, shipId, variant: -1 }));
    }

    return (
        <Card key={superCapData.id} variant="outlined">
            <Typography textAlign={"center"} className="typography-ship-name">
                {superCapData.name}
            </Typography>
            <Button size="small" variant="text" disabled={disabled} onClick={handleAddShip}>
                {"基础型"}
            </Button>
        </Card>
    );
}

function AircraftCard(props: { airData: AircraftData; disabled?: boolean }): JSX.Element {
    const { airData, disabled } = props;
    const shipId = airData.id;
    const dispatch = useAppDispatch();
    const accountId = useAppSelector(getSelectedAccountId);

    function handleAddShip() {
        dispatch(addShip({ accountId, shipId, variant: -1 }));
    }

    return (
        <Card key={airData.id} variant="outlined">
            <Typography textAlign={"center"} className="typography-ship-name">
                {airData.name}
            </Typography>
            <Button size="small" variant="text" disabled={disabled} onClick={handleAddShip}>
                {"基础型"}
            </Button>
        </Card>
    );
}

function ShipCard(props: { shipData: ShipData; disabled?: boolean }): JSX.Element {
    const { shipData, disabled } = props;
    const shipId = shipData.id;
    const dispatch = useAppDispatch();
    const accountId = useAppSelector(getSelectedAccountId);

    function handleAddShip(variant: number) {
        dispatch(addShip({ accountId, shipId, variant }));
    }

    const buttons: JSX.Element[] = shipData.variants.map((variant, index) => {
        return (
            <Button key={index} size="small" variant="text" onClick={() => handleAddShip(index)} disabled={disabled}>
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
}
