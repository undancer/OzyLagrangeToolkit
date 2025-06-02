import React from "react";
import { AddIcon } from "./svg/add-icon";
import { VisibilityIcon } from "./svg/visibility-icon";
import { TuneIcon } from "./svg/tune-icon";
import { DeveloperBoardIcon } from "./svg/developer-board-icon";
// import DeveloperBoardOffIcon from "@mui/icons-material/DeveloperBoardOff";
// 移除Redux导入
// import { addFleet, changeSelectedFleet, updateAvailableShipTypes, updateSettings } from "../redux/fleet-planner";
// import { selectAllAccounts } from "../redux/game-account";
// import { changeSelectedAccount, getSelectedAccountId } from "../redux/selected-account";
// import {
//     displayControl,
//     fleetPlannerControlSetting,
//     getAllFleets,
//     getSelectedFleet,
//     selectAvailableShipTypes,
// } from "../redux/selector/fleet-planner.selector";
// import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/fleet-planner.css";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { ShipTypes } from "./data/ship-data-types";
import { FleetShipPicker } from "./fleet-ship-picker";
import { FleetPlan } from "./fleet-plan";
import { randomFleetName } from "./utils/randomName";
// 从Context导入
import { FleetPlannerSetting, FleetType, useAppContext } from "../context";

function FleetPlaner(): React.JSX.Element {
  return (
    <div className="container-main-fleet-planner w-full max-w-none px-4 py-6">
      <div className="fleet-plan-content-container">
        <ControlBar />
        <FleetShipPicker />
        <FleetPlan />
      </div>
    </div>
  );
}

function ControlBar(): React.JSX.Element {
  return (
    <div className="fleet-planner-control-bar">
      <FleetControl />
      <GeneralControl />
      <AccountControl />
    </div>
  );
}

function FleetControl(): React.JSX.Element {
  // 使用Context替代Redux
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccountId;
  const fleets = state.fleetPlanner[accountId]?.fleets || [];
  const selectedFleet = state.fleetPlanner[accountId]?.selectedFleet || {
    index: -1,
    type: FleetType.main,
  };
  const showControl = state.fleetPlanner[accountId]?.displayControl || false;

  function handleNewFleet() {
    dispatch({
      type: "FLEET_PLANNER_ADD_FLEET",
      payload: { accountId, name: randomFleetName() },
    });
  }

  function handleSelectedFleetChange(
    _event: React.MouseEvent<HTMLElement>,
    newIndex: string,
  ) {
    const index = Number(newIndex);
    dispatch({
      type: "FLEET_PLANNER_CHANGE_SELECTED_FLEET",
      payload: { accountId, index, type: selectedFleet.type },
    });
  }

  const fleetToggleButtons = fleets.map((fleet, index) => {
    return (
      <button
        key={index}
        className={`px-3 py-1 text-sm border ${selectedFleet.index === index ? "bg-blue-600 text-white border-blue-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} rounded transition-colors`}
        onClick={(e) => handleSelectedFleetChange(e, index.toString())}
        disabled={!showControl}
      >
        {fleet.name}
      </button>
    );
  });

  function handleFleetTypeChange(
    _event: React.MouseEvent<HTMLElement>,
    type: FleetType,
  ) {
    dispatch({
      type: "FLEET_PLANNER_CHANGE_SELECTED_FLEET",
      payload: { accountId, index: selectedFleet.index, type },
    });
  }

  const fleetTypeToggleButtons: React.JSX.Element = (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        className={`px-3 py-1 text-sm border border-r-0 rounded-l ${selectedFleet.type === FleetType.main ? "bg-blue-600 text-white border-blue-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} transition-colors`}
        onClick={(e) => handleFleetTypeChange(e, FleetType.main)}
        disabled={!showControl}
      >
        主队
      </button>
      <button
        className={`px-3 py-1 text-sm border rounded-r ${selectedFleet.type === FleetType.reinforcement ? "bg-blue-600 text-white border-blue-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} transition-colors`}
        onClick={(e) => handleFleetTypeChange(e, FleetType.reinforcement)}
        disabled={!showControl}
      >
        增援
      </button>
    </div>
  );

  return (
    <div className="fleet-planner-fleet-control flex items-center space-x-3">
      <div className="inline-flex space-x-1" role="group">
        {fleetToggleButtons}
      </div>
      {fleets.length > 0 ? fleetTypeToggleButtons : null}
      <button
        className="px-3 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleNewFleet}
        disabled={fleets.length >= 3 || !showControl}
      >
        <AddIcon className="w-4 h-4" />
        <span>新舰队</span>
      </button>
    </div>
  );
}

function GeneralControl(): React.JSX.Element {
  // 使用Context替代Redux
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccountId;
  const selectedTypes = state.fleetPlanner[accountId]?.availableShipTypes || [];
  const onlyDisplayOwned =
    state.fleetPlanner[accountId]?.onlyDisplayOwned || false;
  const displayControl = state.fleetPlanner[accountId]?.displayControl || false;
  const mainModuleFirst =
    state.fleetPlanner[accountId]?.mainModuleFirst || false;
  const showControl = displayControl;

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSelectedTypes: string[],
  ) => {
    dispatch({
      type: "FLEET_PLANNER_UPDATE_AVAILABLE_SHIP_TYPES",
      payload: { accountId, types: newSelectedTypes as unknown as ShipTypes[] },
    });
  };

  const shipTypeToggleButtons: React.JSX.Element[] = [];

  Object.values(UNIT_DATA_BASE).forEach((value) => {
    shipTypeToggleButtons.push(
      <button
        key={value.type}
        className={`px-3 py-1 text-sm border ${selectedTypes.includes(value.type) ? "bg-green-600 text-white border-green-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} rounded transition-colors mx-0.5`}
        onClick={(e) => {
          const newTypes = selectedTypes.includes(value.type)
            ? selectedTypes.filter((t) => t !== value.type)
            : [...selectedTypes, value.type];
          handleTypeChange(e, newTypes);
        }}
        disabled={!showControl}
      >
        {value.label}
      </button>,
    );
  });

  function handleUpdateSetting(
    _event: React.MouseEvent<HTMLElement>,
    outputs: string[],
  ) {
    const settings = outputs.map((output) => Number(output));
    const newOnlyDisplayOwned = settings.includes(
      FleetPlannerSetting.DisplayOwned,
    );
    const newDisplayControl = settings.includes(
      FleetPlannerSetting.DisplayControl,
    );
    const newMainModuleFirst = settings.includes(
      FleetPlannerSetting.MainModuleFirst,
    );

    dispatch({
      type: "FLEET_PLANNER_UPDATE_SETTINGS",
      payload: {
        accountId,
        onlyDisplayOwned: newOnlyDisplayOwned,
        displayControl: newDisplayControl,
        mainModuleFirst: newMainModuleFirst,
      },
    });
  }

  return (
    <div className="fleet-planer-general-control flex flex-wrap items-center space-x-2">
      <div className="flex flex-wrap">{shipTypeToggleButtons}</div>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          className={`p-2 border border-r-0 rounded-l ${onlyDisplayOwned ? "bg-green-600 text-white border-green-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} transition-colors`}
          onClick={(e) => {
            const settings = [
              ...(displayControl
                ? [FleetPlannerSetting.DisplayControl.toString()]
                : []),
              ...(mainModuleFirst
                ? [FleetPlannerSetting.MainModuleFirst.toString()]
                : []),
            ];
            if (!onlyDisplayOwned)
              settings.push(FleetPlannerSetting.DisplayOwned.toString());
            handleUpdateSetting(e, settings);
          }}
        >
          <VisibilityIcon className="w-5 h-5" />
        </button>
        <button
          className={`p-2 border border-r-0 ${displayControl ? "bg-green-600 text-white border-green-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} transition-colors`}
          onClick={(e) => {
            const settings = [
              ...(onlyDisplayOwned
                ? [FleetPlannerSetting.DisplayOwned.toString()]
                : []),
              ...(mainModuleFirst
                ? [FleetPlannerSetting.MainModuleFirst.toString()]
                : []),
            ];
            if (!displayControl)
              settings.push(FleetPlannerSetting.DisplayControl.toString());
            handleUpdateSetting(e, settings);
          }}
        >
          <TuneIcon className="w-5 h-5" />
        </button>
        <button
          className={`p-2 border rounded-r ${mainModuleFirst ? "bg-green-600 text-white border-green-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} transition-colors`}
          onClick={(e) => {
            const settings = [
              ...(onlyDisplayOwned
                ? [FleetPlannerSetting.DisplayOwned.toString()]
                : []),
              ...(displayControl
                ? [FleetPlannerSetting.DisplayControl.toString()]
                : []),
            ];
            if (!mainModuleFirst)
              settings.push(FleetPlannerSetting.MainModuleFirst.toString());
            handleUpdateSetting(e, settings);
          }}
        >
          <DeveloperBoardIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function AccountControl(): React.JSX.Element {
  // 使用Context替代Redux
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccountId;
  const gameAccounts = Object.values(state.gameAccounts || {});

  function handleAccountChange(
    _event: React.MouseEvent<HTMLElement>,
    newId: string,
  ) {
    dispatch({
      type: "SELECTED_ACCOUNT/SET",
      payload: { accountId: newId },
    });
  }

  const accountToggleButtons = gameAccounts.map((account) => {
    return (
      <button
        key={account.id}
        className={`px-3 py-1 text-sm border ${accountId === account.id ? "bg-green-600 text-white border-green-700" : "bg-gray-700 border-gray-600 hover:bg-gray-600"} rounded-md mx-0.5 transition-colors account-toggle-button`}
        onClick={(e) => handleAccountChange(e, account.id)}
      >
        {account.name}
      </button>
    );
  });
  return <div className="flex flex-wrap">{accountToggleButtons}</div>;
}

export default FleetPlaner;
