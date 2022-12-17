import { Card, List, ListSubheader, Divider, Typography } from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import { BluePrintTaskBar } from "./blue-print-task-bar";
import { TechIcon } from "./Icons/tech";
import { ListItemShip } from "./list-item-ship";
import { ListItemAircraft } from "./list-item-aircraft";
import { ListItemSuperCap } from "./list-item-super-cap";
import { useAppSelector } from "../redux/utils/hooks";
import { ShipTypes, UnitDataGroup } from "./data/ship-data-types";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { BPDisplayMode } from "../redux/types/acquired-blue-print.type";
import "./css/individual-blue-print.css";
import {
    bluePrintSettingForSelectedAccount,
    reportForSelectedAccount,
    techPointByShipType,
} from "../redux/selector/acquired-blue-prints";

function CardSubHeader(props: { data: UnitDataGroup }): JSX.Element {
    const { data } = props;
    const { displayMode } = useAppSelector(bluePrintSettingForSelectedAccount);
    const { totalTechPoint, totalBluePrint, acquiredBluePrint } = useAppSelector((state) =>
        techPointByShipType(state, data.type),
    );

    const percent = Math.floor((acquiredBluePrint / totalBluePrint) * 100);

    const displayText =
        displayMode === BPDisplayMode.percent ? `${percent}%` : `${acquiredBluePrint}/${totalBluePrint}`;

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

    return (
        <ListSubheader component="div" className="subheader-card">
            <div>{data.label}</div>
            <div className="subheader-right-div">
                {percentReport} {techReport}
            </div>
        </ListSubheader>
    );
}

function ListByShipType(props: { data: UnitDataGroup }): JSX.Element {
    const { data } = props;
    const ships: JSX.Element[] = [];

    switch (data.type) {
        case ShipTypes.cruiser:
        case ShipTypes.destroyer:
        case ShipTypes.frigate:
        case ShipTypes.corvette:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider key={`${ship.id}-div`} />);
                ships.push(<ListItemShip data={ship} key={ship.id} />);
            });
            break;
        case ShipTypes.aircraft:
            data.list.forEach((ship, index) => {
                if (index > 0) ships.push(<Divider key={`${ship.id}-div`} />);
                ships.push(<ListItemAircraft data={ship} key={ship.id} />);
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
            <List component="nav" subheader={<CardSubHeader data={data} />}>
                {ships}
            </List>
        </Card>
    );
}

function IndividualBluePrint(): JSX.Element {
    const { totalBluePrint, totalTechPoint, acquiredBluePrint } = useAppSelector(reportForSelectedAccount);
    const { displayMode } = useAppSelector(bluePrintSettingForSelectedAccount);
    const percent = Math.floor((acquiredBluePrint / totalBluePrint) * 100);

    const displayText =
        displayMode === BPDisplayMode.percent ? `${percent}%` : `${acquiredBluePrint}/${totalBluePrint}`;

    return (
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
            <ListByShipType data={UNIT_DATA_BASE.carriers} />
            <ListByShipType data={UNIT_DATA_BASE.battleCruisers} />
            <ListByShipType data={UNIT_DATA_BASE.cruisers} />
            <ListByShipType data={UNIT_DATA_BASE.destroyers} />
            <ListByShipType data={UNIT_DATA_BASE.frigates} />
            <ListByShipType data={UNIT_DATA_BASE.corvettes} />
            <ListByShipType data={UNIT_DATA_BASE.aircrafts} />
        </div>
    );
}

export default IndividualBluePrint;
