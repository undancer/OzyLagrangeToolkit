import "./css/blue-print.css";
import { Container, Card, List, ListSubheader, Divider } from "@mui/material";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ListItemShip } from "./list-item-ship";
import { ListItemAircraft } from "./list-item-aircraft";
import { ListItemSuperCap } from "./list-item-super-cap";
import { ShipTypes, UnitDataGroup } from "./data/ship-data-types";

function cardListDataGroup(data: UnitDataGroup): JSX.Element {
    const ships: JSX.Element[] = [];
    switch (data.type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider />);
                ships.push(<ListItemShip data={ship} />);
            });
            break;
        case ShipTypes.aircraft:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider />);
                ships.push(<ListItemAircraft data={ship} />);
            });
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider />);
                ships.push(<ListItemSuperCap data={ship} />);
            });
            break;
        default:
        // Do nothing
    }
    let cardListClass = "card-ship-list";
    if (data.type === ShipTypes.battleCruiser || data.type === ShipTypes.carrier) cardListClass = "card-super-cap-list";
    return (
        <Card elevation={2} className={cardListClass}>
            <List
                aria-aria-labelledby="nested-list-subheader"
                component="nav"
                subheader={<ListSubheader component="div">{data.label}</ListSubheader>}
            >
                {ships}
            </List>
        </Card>
    );
}

function BluePrint() {
    return (
        <Container maxWidth={false} className={"container-main-blue-print"}>
            <div className="account-content-container">
                {cardListDataGroup(UNIT_DATA_BASE.carriers)}
                {cardListDataGroup(UNIT_DATA_BASE.battleCruisers)}
                {cardListDataGroup(UNIT_DATA_BASE.cruisers)}
                {cardListDataGroup(UNIT_DATA_BASE.destroyers)}
                {cardListDataGroup(UNIT_DATA_BASE.frigates)}
                {cardListDataGroup(UNIT_DATA_BASE.corvettes)}
                {cardListDataGroup(UNIT_DATA_BASE.aircrafts)}
            </div>
        </Container>
    );
}

export default BluePrint;
