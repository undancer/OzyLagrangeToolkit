import "./css/blue-print.css";
import { Container, Card, List, ListSubheader, Divider } from "@mui/material";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ListItemShip } from "./list-item-ship";
import { ListItemAircraft } from "./list-item-aircraft";
import { ListItemSuperCap } from "./list-item-super-cap";
import { ShipTypes, UnitDataGroup } from "./data/ship-data-types";
import { useAppSelector } from "../redux/utils/hooks";
import { selectAccount, selectAllAccounts } from "../redux/game-account";

function CardListDataGroup(props: { data: UnitDataGroup; accountId: string }): JSX.Element {
    const { data, accountId } = props;
    const ships: JSX.Element[] = [];
    switch (data.type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider key={`${ship.id}-div`} />);
                ships.push(<ListItemShip data={ship} key={ship.id} accountId={accountId} />);
            });
            break;
        case ShipTypes.aircraft:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider key={`${ship.id}-div`} />);
                ships.push(<ListItemAircraft data={ship} key={ship.id} accountId={accountId} />);
            });
            break;
        case ShipTypes.battleCruiser:
        case ShipTypes.carrier:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider key={`${ship.id}-div`} />);
                ships.push(<ListItemSuperCap data={ship} key={ship.id} />);
            });
            break;
        default:
        // Do nothing
    }
    let cardListClass = "card-ship-list";
    if (data.type === ShipTypes.battleCruiser || data.type === ShipTypes.carrier) cardListClass = "card-super-cap-list";
    return (
        <Card elevation={2} className={cardListClass}>
            <List component="nav" subheader={<ListSubheader component="div">{data.label}</ListSubheader>}>
                {ships}
            </List>
        </Card>
    );
}

function BluePrint() {
    const gameAccounts = useAppSelector((state) => selectAllAccounts(state));
    const firstAccount = useAppSelector((state) => selectAccount(state, gameAccounts[0].id));
    const { id } = firstAccount;
    return (
        <Container maxWidth={false} className={"container-main-blue-print"}>
            <div className="account-content-container">
                <CardListDataGroup data={UNIT_DATA_BASE.carriers} accountId={id} />
                <CardListDataGroup data={UNIT_DATA_BASE.battleCruisers} accountId={id} />
                <CardListDataGroup data={UNIT_DATA_BASE.cruisers} accountId={id} />
                <CardListDataGroup data={UNIT_DATA_BASE.destroyers} accountId={id} />
                <CardListDataGroup data={UNIT_DATA_BASE.frigates} accountId={id} />
                <CardListDataGroup data={UNIT_DATA_BASE.corvettes} accountId={id} />
                <CardListDataGroup data={UNIT_DATA_BASE.aircrafts} accountId={id} />
            </div>
        </Container>
    );
}

export default BluePrint;
