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
import "./css/fleet-plan.css";
import { lookUpShipById } from "./data/ship-data";
import { isShipData, ShipTypes } from "./data/ship-data-types";
import { useAppContext, AircraftInFleet, Fleet, FleetType } from "../context";
import { AirCapacity } from "./data/air-capacity";
import React from "react";

export function FleetPlanAircraftTable(props: {
  fleet: Fleet;
  fleetIndex: number;
}): React.JSX.Element | null {
  const { fleet, fleetIndex } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccount.id;

  // 计算舰队的空军容量
  const fleetCapacities: AirCapacity[] = [];
  state.fleetPlanner[accountId].fleets.forEach((fleet) => {
    const capacity: AirCapacity = {
      midAir: 0,
      heavyAir: 0,
      corvette: 0,
    };

    // 计算舰队中所有舰船提供的空军容量
    fleet.ships.forEach((ship) => {
      const shipData = lookUpShipById(ship.shipId);
      if (shipData && isShipData(shipData)) {
        capacity.midAir += shipData.midAir * ship.count;
        capacity.heavyAir += shipData.heavyAir * ship.count;
        capacity.corvette += shipData.corvette * ship.count;
      }
    });

    fleetCapacities.push(capacity);
  });

  // 计算舰队的空军总数
  const totalAircraft = {
    midAir: 0,
    heavyAir: 0,
    corvette: 0,
  };

  fleet.aircraft.forEach((aircraft) => {
    const shipData = lookUpShipById(aircraft.shipId);
    if (shipData) {
      if (shipData.type === ShipTypes.corvette) {
        totalAircraft.corvette += aircraft.count;
      } else if (shipData.type === ShipTypes.midAir) {
        totalAircraft.midAir += aircraft.count;
      } else if (shipData.type === ShipTypes.heavyAir) {
        totalAircraft.heavyAir += aircraft.count;
      }
    }
  });

  const editMode = state.displayControl;
  const capacity: AirCapacity = fleetCapacities[fleetIndex];

  const hideAircraftTable: boolean =
    fleet.aircraft.length < 1 &&
    capacity.corvette === 0 &&
    capacity.heavyAir === 0 &&
    capacity.midAir === 0;
  if (hideAircraftTable) return null;

  const aircraftRow = fleet.aircraft.map((aircraft, index) => {
    if (editMode) {
      return (
        <AircraftTableRow
          aircraft={aircraft}
          fleetIndex={fleetIndex}
          aircraftIndex={index}
          key={index}
        />
      );
    }
    return (
      <DisplayAircraftRow
        aircraft={aircraft}
        fleetIndex={fleetIndex}
        aircraftIndex={index}
        key={index}
      />
    );
  });

  const totalAir = totalAircraft.midAir + totalAircraft.heavyAir;
  const maxAir = capacity.midAir + capacity.heavyAir;

  return (
    <Table sx={{ width: 560 }} size="small">
      <TableHead>
        <TableCell colSpan={2} align="center">
          空军
        </TableCell>
        <TableCell width={64}></TableCell>
        <TableCell align="center" width={64}>
          飞机
        </TableCell>
        <TableCell align="center" width={75}>
          炮艇
        </TableCell>
      </TableHead>
      <TableBody>
        {aircraftRow}
        <TableRow>
          <TableCell colSpan={2} className="no-border"></TableCell>
          <TableCell>合计</TableCell>
          <TableCell align="center">
            {totalAir}/{maxAir}
          </TableCell>
          <TableCell align="center">
            {totalAircraft.corvette}/{capacity.corvette}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

// A function that returns a single row in the table for a single aircraft, used for display purposes.
function DisplayAircraftRow(props: {
  aircraft: AircraftInFleet;
  fleetIndex: number;
  aircraftIndex: number;
}) {
  const { aircraft, fleetIndex, aircraftIndex: shipIndex } = props;
  const { shipId, count, variant, leveled, adjusted } = aircraft;
  const type = FleetType.aircraft;

  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccount.id;

  // TODO: 实现从Context中获取技术点查找表
  const techPointLookupTable = {};

  function handleLeveled() {
    const action = { accountId, shipIndex, fleetIndex, type };
    dispatch({
      type: "FLEET_PLANNER_FLIP_LEVELED_FLAG",
      payload: action,
    });
  }

  function handleAdjusted() {
    const action = { accountId, shipIndex, fleetIndex, type };
    dispatch({
      type: "FLEET_PLANNER_FLIP_ADJUSTED_FLAG",
      payload: action,
    });
  }

  const data = lookUpShipById(shipId);
  if (!data) return null;
  const isCorvette = data.type === ShipTypes.corvette;
  let addOn = "";
  if (isShipData(data) && data.variants[0] !== "")
    addOn = ` - ${data.variants[variant]}`;
  const techDisplayData = techPointLookupTable[shipId] || {
    text: "V1.00",
    type: "tech-normal",
  };

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

  return (
    <TableRow>
      {tagCell}
      <TableCell>{`${data.name}${addOn}`}</TableCell>
      <TableCell>
        <div className={techDisplayData.type}>{techDisplayData.text}</div>
      </TableCell>
      <TableCell align="center">{isCorvette ? null : count}</TableCell>
      <TableCell align="center">{isCorvette ? count : null}</TableCell>
    </TableRow>
  );
}

function AircraftTableRow(props: {
  aircraft: AircraftInFleet;
  fleetIndex: number;
  aircraftIndex: number;
}): React.JSX.Element | null {
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccount.id;

  const { aircraft, fleetIndex, aircraftIndex: shipIndex } = props;
  const { shipId, count, variant } = aircraft;
  const type = FleetType.aircraft;

  function handleRemoveAircraft() {
    const action = { accountId, shipIndex, fleetIndex, type };
    dispatch({
      type: "FLEET_PLANNER_REMOVE_SHIP_OR_AIRCRAFT",
      payload: action,
    });
  }

  function handleIncreaseCount() {
    const action = { accountId, shipIndex, fleetIndex, type };
    dispatch({
      type: "FLEET_PLANNER_INCREASE_SHIP_COUNT",
      payload: action,
    });
  }

  function handleDecreaseCount() {
    const action = { accountId, shipIndex, fleetIndex, type };
    dispatch({
      type: "FLEET_PLANNER_DECREASE_SHIP_COUNT",
      payload: action,
    });
  }

  const data = lookUpShipById(shipId);
  if (!data) return null;
  const isCorvette = data.type === ShipTypes.corvette;
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
      <IconButton color="warning" size="small" onClick={handleRemoveAircraft}>
        <DeleteOutlineIcon />
      </IconButton>
    </TableCell>
  );

  return (
    <TableRow>
      {controlCell}
      <TableCell colSpan={2}>{`${data.name}${addOn}`}</TableCell>
      <TableCell align="center">{isCorvette ? null : count}</TableCell>
      <TableCell align="center">{isCorvette ? count : null}</TableCell>
    </TableRow>
  );
}
