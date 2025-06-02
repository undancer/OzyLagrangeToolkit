import React from "react";
import { AddIcon } from "./svg/add-icon";
import { RemoveIcon } from "./svg/remove-icon";
import { DeleteOutlineIcon } from "./svg/delete-outline-icon";
import { MilitaryTechIcon } from "./svg/military-tech-icon";
import { ScienceIcon } from "./svg/science-icon";
import "./css/fleet-plan.css";
import { lookUpShipById } from "./data/ship-data";
import { isShipData, ShipTypes } from "./data/ship-data-types";
import { AircraftInFleet, Fleet, FleetType, useAppContext } from "../context";
import { AirCapacity } from "./data/air-capacity";

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
    <table className="w-[560px] text-sm">
      <thead>
        <tr>
          <th colSpan={2} className="text-center">
            空军
          </th>
          <th className="w-16"></th>
          <th className="text-center w-16">飞机</th>
          <th className="text-center w-[75px]">炮艇</th>
        </tr>
      </thead>
      <tbody>
        {aircraftRow}
        <tr>
          <td colSpan={2} className="no-border"></td>
          <td>合计</td>
          <td className="text-center">
            {totalAir}/{maxAir}
          </td>
          <td className="text-center">
            {totalAircraft.corvette}/{capacity.corvette}
          </td>
        </tr>
      </tbody>
    </table>
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
    <td className="w-[88px]">
      <button
        className={`p-1 rounded-full ${leveled ? "text-amber-500" : "text-gray-500"}`}
        onClick={handleLeveled}
      >
        <MilitaryTechIcon className="text-sm" />
      </button>
      <button
        className={`p-1 rounded-full ${adjusted ? "text-blue-500" : "text-gray-500"}`}
        onClick={handleAdjusted}
      >
        <ScienceIcon className="text-sm" />
      </button>
    </td>
  );

  return (
    <tr>
      {tagCell}
      <td>{`${data.name}${addOn}`}</td>
      <td>
        <div className={techDisplayData.type}>{techDisplayData.text}</div>
      </td>
      <td className="text-center">{isCorvette ? null : count}</td>
      <td className="text-center">{isCorvette ? count : null}</td>
    </tr>
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
    <td className="w-[150px]">
      <button
        className={`p-1 rounded-full text-green-600 ${count >= data.limit ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"}`}
        onClick={handleIncreaseCount}
        disabled={count >= data.limit}
      >
        <AddIcon />
      </button>
      <button
        className={`p-1 rounded-full text-red-600 ${count <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100"}`}
        onClick={handleDecreaseCount}
        disabled={count <= 0}
      >
        <RemoveIcon />
      </button>
      <button
        className="p-1 rounded-full text-amber-600 hover:bg-amber-100"
        onClick={handleRemoveAircraft}
      >
        <DeleteOutlineIcon />
      </button>
    </td>
  );

  return (
    <tr>
      {controlCell}
      <td colSpan={2}>{`${data.name}${addOn}`}</td>
      <td className="text-center">{isCorvette ? null : count}</td>
      <td className="text-center">{isCorvette ? count : null}</td>
    </tr>
  );
}
