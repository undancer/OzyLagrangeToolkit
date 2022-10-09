import "./css/blue-print.css";
import { Container, Card, List, ListItem, ListSubheader, Divider } from "@mui/material";
import * as ConsData from "./data/ship-data";
import { ShipData, SuperCapData } from "./data/ship-data";
import { ListItemShip } from "./list-item-ship";
import { ListItemAircraft } from "./list-item-aircraft";

function shipTypeCard(data: ShipData[]): JSX.Element {
    const ships: JSX.Element[] = [];
    data.forEach((ship, index) => {
        if (index > 0) ships.push(<Divider />);
        ships.push(<ListItemShip data={ship} />);
    });
    return (
        <Card elevation={2} className="card-ship-list">
            <List
                aria-aria-labelledby="nested-list-subheader"
                component="nav"
                subheader={<ListSubheader component="div">{data[0].type}</ListSubheader>}
            >
                {ships}
            </List>
        </Card>
    );
}

function aircraftTypeCard(data: ShipData[]): JSX.Element {
    const ships: JSX.Element[] = [];
    data.forEach((ship, index) => {
        if (index > 0) ships.push(<Divider />);
        ships.push(<ListItemAircraft data={ship} />);
    });
    return (
        <Card elevation={2} className="card-ship-list">
            <List
                aria-aria-labelledby="nested-list-subheader"
                component="nav"
                subheader={<ListSubheader component="div">{data[0].type}</ListSubheader>}
            >
                {ships}
            </List>
        </Card>
    );
}

function superCapCard(data: SuperCapData[]) {
    return (
        <Card elevation={2}>
            <List
                aria-aria-labelledby="nested-list-subheader"
                component="nav"
                subheader={<ListSubheader component="div">{data[0].type}</ListSubheader>}
            >
                <ListItem>Place Holder</ListItem>
            </List>
        </Card>
    );
}

function BluePrint() {
    return (
        <Container maxWidth="xl">
            <div className="account-content-container">
                {superCapCard(ConsData.BATTLE_CRUISER_DATA)}
                {shipTypeCard(ConsData.CRUISER_DATA)}
                {shipTypeCard(ConsData.DESTROYER_DATA)}
                {shipTypeCard(ConsData.FRIGATE_DATA)}
                {aircraftTypeCard(ConsData.AIRCRAFT_DATA)}
                {shipTypeCard(ConsData.CORVETTE_DATA)}
            </div>
        </Container>
    );
}

export default BluePrint;
