import { Card, Typography, Button } from "@mui/material";
import {
    displayControl,
    displayOnlyOwnedShip,
    selectAvailableShipTypes,
} from "../redux/selector/fleet-planner.selector";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { lookUpShipById, UNIT_DATA_BASE } from "./data/ship-data";
import { AircraftData, ShipData, ShipTypes, SuperCapData, UnitDataGroup } from "./data/ship-data-types";
import "./css/fleet-ship-picker.css";
import { addAircraft, addShip } from "../redux/fleet-planner";
import { getSelectedAccountId } from "../redux/selected-account";
import { getOwnedShipLookUpTable, getOwnedSuperCapLookUpTable } from "../redux/selector/acquired-blue-prints";
import { TechIcon } from "./Icons/tech";

export function FleetShipPicker(): JSX.Element {
    const selectedTypes = useAppSelector(selectAvailableShipTypes);
    const showControl = useAppSelector(displayControl);
    if (!showControl) return <div className="fleet-planner-ship-type-container"></div>;
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
            case ShipTypes.bomber:
                resultCards = resultCards.concat(shipCardsByType({ data: UNIT_DATA_BASE.bombers }));
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
        case ShipTypes.corvette:
        case ShipTypes.aircraft:
        case ShipTypes.bomber:
            shipCards = list.map((data) => <ShipCard shipData={data} key={data.id} />);
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

function SuperCapCard(props: { superCapData: SuperCapData; disabled?: boolean }): JSX.Element | null {
    const { superCapData, disabled } = props;
    const shipId = superCapData.id;
    const dispatch = useAppDispatch();
    const accountId = useAppSelector(getSelectedAccountId);
    const onlyDisplayOnwed = useAppSelector(displayOnlyOwnedShip);
    const ownedLookupTable = useAppSelector(getOwnedSuperCapLookUpTable);
    const ownedSuperCap = ownedLookupTable[shipId];
    const hasSuperCap = ownedSuperCap !== null && ownedSuperCap !== undefined;
    if (!hasSuperCap && onlyDisplayOnwed) return null;

    function handleAddShip() {
        dispatch(addShip({ accountId, shipId, variant: -1 }));
    }

    return (
        <Card key={superCapData.id} variant="outlined">
            <Typography textAlign={"center"} className="typography-ship-name">
                {superCapData.name} <TechIcon className="ship-picker-icon svg-fill-tech-icon" />{" "}
                {ownedSuperCap?.techPoint || 0}
            </Typography>
            <div className="ship-picker-button-container">
                <Button size="small" variant="text" disabled={disabled || !hasSuperCap} onClick={handleAddShip}>
                    {"基础型"}
                </Button>
            </div>
        </Card>
    );
}

function ShipCard(props: { shipData: ShipData | AircraftData; disabled?: boolean }): JSX.Element | null {
    const { shipData, disabled } = props;
    const shipId = shipData.id;
    const dispatch = useAppDispatch();
    const accountId = useAppSelector(getSelectedAccountId);
    const ship = lookUpShipById(shipId);
    const ownedLookupTable = useAppSelector(getOwnedShipLookUpTable);
    const ownedShip = ownedLookupTable[shipId];
    const onlyDisplayOnwed = useAppSelector(displayOnlyOwnedShip);

    const hasShip = ownedShip !== null && ownedShip !== undefined;
    if (!hasShip && onlyDisplayOnwed) return null;

    function handleAddShip(variant: number) {
        const type = ship?.type;
        if (type === ShipTypes.corvette || type === ShipTypes.aircraft || type === ShipTypes.bomber) {
            dispatch(addAircraft({ accountId, shipId, variant }));
            return;
        }
        dispatch(addShip({ accountId, shipId, variant }));
    }

    const buttons: JSX.Element[] = [];
    shipData.variants.forEach((variant, index) => {
        const hasVariant = hasShip && ownedShip.variants.findIndex((item) => item === index) !== -1;
        const hasProgress = hasShip && ownedShip.partialComplete && (ownedShip.partialComplete[index] || 0) > 0;
        const onlyHasProgress = hasProgress && !hasVariant;
        // Skip the variant if it doesn't exist
        if (onlyDisplayOnwed && !hasVariant && !hasProgress) return;
        const buttonItem = (
            <Button
                key={index}
                size="small"
                variant="text"
                color={onlyHasProgress ? "success" : "primary"}
                onClick={() => handleAddShip(index)}
                disabled={disabled || (!hasVariant && !hasProgress)}
            >
                {variant !== "" ? variant : "基础型"}
            </Button>
        );
        buttons.push(buttonItem);
    });
    return (
        <Card key={shipData.id} variant="outlined">
            <Typography textAlign={"center"} className="ship-picker-ship-name">
                {shipData.name} <TechIcon className="ship-picker-icon svg-fill-tech-icon" /> {ownedShip?.techPoint || 0}
            </Typography>
            <div className="ship-picker-button-container">{buttons}</div>
        </Card>
    );
}
