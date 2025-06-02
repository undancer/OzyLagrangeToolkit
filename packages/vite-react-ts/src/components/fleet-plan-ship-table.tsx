import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ScienceIcon from "@mui/icons-material/Science";
import { lookUpShipById } from "./data/ship-data";
import { isShipData, isSuperCap } from "./data/ship-data-types";
import { useAppContext, Fleet, FleetType, ShipInFleet } from "../context";
import React from "react";

export interface techPointDisplayData {
  text: string;
  type: "tech-normal" | "tech-gold" | "tech-max";
}

export function FleetPlanShipTable(props: {
  fleet: Fleet;
  fleetIndex: number;
  type: "main" | "reinforce";
}): React.JSX.Element {
  const { fleet, fleetIndex, type } = props;
  const { state } = useAppContext();
  const { selectedAccountId } = state;
  const showControl = state.fleetPlanner[selectedAccountId ? selectedAccountId : ''].displayControl;

  const selectedFleet = type === "main" ? fleet.mainFleet : fleet.reinforcement;
  const fleetType = type === "main" ? FleetType.main : FleetType.reinforcement;

  const rows = selectedFleet.map((ship, index) => {
    if (showControl) {
      return (
        <EditShipRow
          ship={ship}
          fleetIndex={fleetIndex}
          shipIndex={index}
          type={fleetType}
          key={index}
        />
      );
    }
    return (
      <DisplayShipRow
        ship={ship}
        fleetIndex={fleetIndex}
        shipIndex={index}
        type={fleetType}
        key={index}
      />
    );
  });

  const title = type === "main" ? "主力部队" : "增援部队";

  return (
    <Table sx={{ width: 545 }} size="small">
      <ShipTableHeader
        titles={[title, showControl ? "人口" : "", "数量", "总人口"]}
      />
      <TableBody>
        {rows}
        <ShipTableFooter fleetIndex={fleetIndex} type={type} />
      </TableBody>
    </Table>
  );
}

function DisplayShipRow(props: {
  ship: ShipInFleet;
  fleetIndex: number;
  shipIndex: number;
  type: FleetType;
}): React.JSX.Element {
  const { ship, fleetIndex, shipIndex, type } = props;
  const { shipId, count, variant, leveled, adjusted } = ship;
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccount.id;
  const fleetPlannerState = state.fleetPlanner[accountId];
  const techPointLookupTable = {}; // TODO: Implement tech point lookup from context

  const shipData = lookUpShipById(shipId);

  if (!shipData) return <></>;

  const { name } = shipData;
  let totalPopulation = 0;
  if (isShipData(shipData)) {
    totalPopulation = shipData.pop[variant] * count;
  } else if (isSuperCap(shipData)) {
    totalPopulation = shipData.pop * count;
  }

  function handleLeveled() {
    dispatch({
      type: "FLEET_PLANNER_FLIP_LEVELED_FLAG",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  function handleAdjusted() {
    dispatch({
      type: "FLEET_PLANNER_FLIP_ADJUSTED_FLAG",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  const tagCell: React.JSX.Element = (
    <TableCell width={88}>
      <IconButton
        size="small"
        color={leveled ? "warning" : "default"}
        onClick={handleLeveled}
      >
        <MilitaryTechIcon fontSize="inherit" />
      </IconButton>
      <IconButton
        size="small"
        color={adjusted ? "primary" : "default"}
        onClick={handleAdjusted}
      >
        <ScienceIcon fontSize="inherit" />
      </IconButton>
    </TableCell>
  );

  let addOn = "";
  if (isShipData(shipData) && shipData.variants[0] !== "")
    addOn = ` - ${shipData.variants[variant]}`;

  const techDisplayData = techPointLookupTable[shipId] || {
    text: "V1.00",
    type: "tech-normal",
  };

  return (
    <TableRow>
      {tagCell}
      <TableCell>{`${name}${addOn}`}</TableCell>
      <TableCell>
        <div className={techDisplayData.type}>{techDisplayData.text}</div>
      </TableCell>
      <TableCell align="center">{count}</TableCell>
      <TableCell align="right">{totalPopulation}</TableCell>
    </TableRow>
  );
}

function EditShipRow(props: {
  ship: ShipInFleet;
  fleetIndex: number;
  shipIndex: number;
  type: FleetType;
}): React.JSX.Element | null {
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccount.id;

  const { ship, fleetIndex, shipIndex, type } = props;
  const { shipId, count, variant } = ship;

  function handleRemoveShip() {
    dispatch({
      type: "FLEET_PLANNER_REMOVE_SHIP_OR_AIRCRAFT",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  function handleIncreaseCount() {
    dispatch({
      type: "FLEET_PLANNER_INCREASE_SHIP_COUNT",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  function handleDecreaseCount() {
    dispatch({
      type: "FLEET_PLANNER_DECREASE_SHIP_COUNT",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  const data = lookUpShipById(shipId);
  let population = 0;
  if (data === undefined) {
    // do nothing
  } else if (isShipData(data)) {
    population = data.pop[variant];
  } else if (isSuperCap(data)) {
    population = data.pop;
  }

  if (!data) return null;
  let addOn = "";
  if (isShipData(data) && data.variants[0] !== "")
    addOn = ` - ${data.variants[variant]}`;
  const controlCell: React.JSX.Element = (
    <TableCell width={150}>
      <IconButton
        color="success"
        size="small"
        onClick={handleIncreaseCount}
        disabled={count >= data.limit}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        color="error"
        size="small"
        onClick={handleDecreaseCount}
        disabled={count <= 0}
      >
        <RemoveIcon />
      </IconButton>
      <IconButton color="warning" size="small" onClick={handleRemoveShip}>
        <DeleteOutlineIcon />
      </IconButton>
    </TableCell>
  );

  return (
    <TableRow>
      {controlCell}
      <TableCell>{`${data.name}${addOn}`}</TableCell>
      <TableCell align="center">{population}</TableCell>
      <TableCell align="center">{count}</TableCell>
      <TableCell align="right">{population * count}</TableCell>
    </TableRow>
  );
}

function ShipTableHeader(props: { titles: string[] }) {
  const { titles } = props;
  return (
    <TableHead>
      <TableCell colSpan={2} align="center">
        {titles[0]}
      </TableCell>
      <TableCell width={64} align="center">
        {titles[1]}
      </TableCell>
      <TableCell width={64} align="center">
        {titles[2]}
      </TableCell>
      <TableCell width={75} align="center">
        {titles[3]}
      </TableCell>
    </TableHead>
  );
}

function ShipTableFooter(props: {
  fleetIndex: number;
  type: "main" | "reinforce";
}) {
  const { fleetIndex, type } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccount.id;
  const fleetPlannerState = state.fleetPlanner[accountId];

  // 计算舰队总数据
  const fleet = fleetPlannerState.fleets[fleetIndex];
  const ships = type === "main" ? fleet.mainFleet : fleet.reinforcement;

  let totalCount = 0;
  let totalPopulation = 0;

  ships.forEach((ship) => {
    totalCount += ship.count;
    const shipData = lookUpShipById(ship.shipId);
    if (shipData) {
      if (isShipData(shipData)) {
        totalPopulation += shipData.pop[ship.variant] * ship.count;
      } else if (isSuperCap(shipData)) {
        totalPopulation += shipData.pop * ship.count;
      }
    }
  });

  return (
    <TableRow>
      <TableCell colSpan={2} className="no-border"></TableCell>
      <TableCell>合计</TableCell>
      <TableCell align="center">{totalCount}</TableCell>
      <TableCell align="right">{totalPopulation}</TableCell>
    </TableRow>
  );
}
