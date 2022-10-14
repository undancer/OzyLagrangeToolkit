import "./css/blue-print.css";
import { Container, Card, List, ListSubheader, Divider, Typography, Button } from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ListItemShip } from "./list-item-ship";
import { ListItemAircraft } from "./list-item-aircraft";
import { ListItemSuperCap } from "./list-item-super-cap";
import { ShipTypes, UnitDataGroup } from "./data/ship-data-types";
import { useAppSelector, useAppDispatch } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/game-account";
import { addAccount } from "../redux/actions/game-account";
import { getSelectedAccountId } from "../redux/selected-account";
import { randomName } from "./utils/randomName";
import { TechIcon } from "./Icons/tech";
import {
    bluePrintSettingForSelectedAccount,
    reportForSelectedAccount,
    techPointByShipType,
} from "../redux/acquired-blue-print";
import { BluePrintTaskBar } from "./blue-print-task-bar";
import { BPDisplayMode } from "../redux/types/acquired-blue-print.type";

function CardListDataGroup(props: { data: UnitDataGroup; accountId: string }): JSX.Element {
    const { data, accountId } = props;
    const ships: JSX.Element[] = [];
    const { totalTechPoint, totalBluePrint, acquiredBluePrint } = useAppSelector((state) =>
        techPointByShipType(state, data.type),
    );
    const { displayMode } = useAppSelector(bluePrintSettingForSelectedAccount);

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
                ships.push(<ListItemSuperCap data={ship} key={ship.id} accountId={accountId} />);
            });
            break;
        default:
        // Do nothing
    }
    let cardListClass = "card-ship-list";
    if (data.type === ShipTypes.battleCruiser || data.type === ShipTypes.carrier) cardListClass = "card-super-cap-list";

    const percent = Math.floor((acquiredBluePrint / totalBluePrint) * 100);

    const displayText =
        displayMode === BPDisplayMode.percent ? `${percent}%` : `${acquiredBluePrint}/${totalBluePrint}`;
    // const percent = Math.floor((acquiredBluePrint / totalBluePrint) * 100);
    const percentReport =
        acquiredBluePrint > 0 ? (
            <div>
                <TaskIcon className="subheader-blueprint-icon svg-fill-tech-icon" /> {displayText}
            </div>
        ) : null;

    const techReport =
        totalTechPoint > 0 ? (
            <div>
                <TechIcon className="subheader-icon  svg-fill-tech-icon" /> {totalTechPoint}
            </div>
        ) : null;

    const subHeader: JSX.Element = (
        <ListSubheader component="div" className="subheader-card">
            <div>{data.label}</div>
            <div className="subheader-right-div">
                {percentReport} {techReport}
            </div>
        </ListSubheader>
    );
    return (
        <Card elevation={2} className={cardListClass}>
            <List component="nav" subheader={subHeader}>
                {ships}
            </List>
        </Card>
    );
}

function BluePrint(): JSX.Element {
    const gameAccounts = useAppSelector(selectAllAccounts);
    const accountId = useAppSelector(getSelectedAccountId);
    const dispatch = useAppDispatch();
    const { totalBluePrint, totalTechPoint, acquiredBluePrint } = useAppSelector(reportForSelectedAccount);
    const { displayMode } = useAppSelector(bluePrintSettingForSelectedAccount);
    const percent = Math.floor((acquiredBluePrint / totalBluePrint) * 100);

    const displayText =
        displayMode === BPDisplayMode.percent ? `${percent}%` : `${acquiredBluePrint}/${totalBluePrint}`;

    const noAccount = gameAccounts.length === 0;

    if (noAccount) {
        return (
            <Container maxWidth={false} className={"container-main-blue-print"}>
                <div className="account-content-container">
                    <Card elevation={0} className="account-title-card">
                        还没有账号啊，点击右上的 “账户管理” 填加一个吧。
                    </Card>
                    <Card elevation={0} className="account-title-card">
                        或点击这里创建一个
                        <Button variant="outlined" size="small" onClick={() => dispatch(addAccount(randomName()))}>
                            随机账号
                        </Button>
                    </Card>
                </div>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} className={"container-main-blue-print"}>
            <div className="account-content-container">
                <BluePrintTaskBar />
                <Card className="account-title-card">
                    <Typography variant="h4" gutterBottom>
                        全蓝图收集: <TaskIcon fontSize="large" className="svg-fill-tech-icon header-icon" />
                        {displayText} &nbsp;&nbsp;总科技点:&nbsp;
                        <TechIcon fontSize="large" className="svg-fill-tech-icon header-icon" />
                        {totalTechPoint}
                    </Typography>
                </Card>
                <CardListDataGroup data={UNIT_DATA_BASE.carriers} accountId={accountId} />
                <CardListDataGroup data={UNIT_DATA_BASE.battleCruisers} accountId={accountId} />
                <CardListDataGroup data={UNIT_DATA_BASE.cruisers} accountId={accountId} />
                <CardListDataGroup data={UNIT_DATA_BASE.destroyers} accountId={accountId} />
                <CardListDataGroup data={UNIT_DATA_BASE.frigates} accountId={accountId} />
                <CardListDataGroup data={UNIT_DATA_BASE.corvettes} accountId={accountId} />
                <CardListDataGroup data={UNIT_DATA_BASE.aircrafts} accountId={accountId} />
            </div>
        </Container>
    );
}

export default BluePrint;
