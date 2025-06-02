import {
  Button,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TuneIcon from "@mui/icons-material/Tune";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
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
    <Container maxWidth={false} className="container-main-fleet-planner">
      <div className="fleet-plan-content-container">
        <ControlBar />
        <FleetShipPicker />
        <FleetPlan />
      </div>
    </Container>
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
    event: React.MouseEvent<HTMLElement>,
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
      <ToggleButton value={index} key={index}>
        {fleet.name}
      </ToggleButton>
    );
  });

  function handleFleetTypeChange(
    event: React.MouseEvent<HTMLElement>,
    type: FleetType,
  ) {
    dispatch({
      type: "FLEET_PLANNER_CHANGE_SELECTED_FLEET",
      payload: { accountId, index: selectedFleet.index, type },
    });
  }

  const fleetTypeToggleButtons: React.JSX.Element = (
    <ToggleButtonGroup
      exclusive
      value={showControl ? selectedFleet.type : null}
      size="small"
      onChange={handleFleetTypeChange}
      disabled={!showControl}
    >
      <ToggleButton value={FleetType.main}>主队</ToggleButton>
      <ToggleButton value={FleetType.reinforcement}>增援</ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <div className="fleet-planner-fleet-control">
      <ToggleButtonGroup
        onChange={handleSelectedFleetChange}
        exclusive
        value={showControl ? selectedFleet.index : null}
        size="small"
        disabled={!showControl}
      >
        {fleetToggleButtons}
      </ToggleButtonGroup>
      {fleets.length > 0 ? fleetTypeToggleButtons : null}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        size="small"
        onClick={handleNewFleet}
        disabled={fleets.length >= 3 || !showControl}
      >
        新舰队
      </Button>
    </div>
  );
}

function GeneralControl(): React.JSX.Element {
  // 使用Context替代Redux
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccountId;
  const selectedTypes = state.fleetPlanner[accountId]?.availableShipTypes || [];
  const onlyDisplayOwned = state.fleetPlanner[accountId]?.onlyDisplayOwned || false;
  const displayControl = state.fleetPlanner[accountId]?.displayControl || false;
  const mainModuleFirst = state.fleetPlanner[accountId]?.mainModuleFirst || false;
  const showControl = displayControl;

  const handleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
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
      <ToggleButton color="primary" value={value.type} key={value.type}>
        {value.label}
      </ToggleButton>,
    );
  });

  function handleUpdateSetting(
    event: React.MouseEvent<HTMLElement>,
    outputs: string[],
  ) {
    const settings = outputs.map((output) => Number(output));
    const newOnlyDisplayOwned = settings.includes(FleetPlannerSetting.DisplayOwned);
    const newDisplayControl = settings.includes(FleetPlannerSetting.DisplayControl);
    const newMainModuleFirst = settings.includes(FleetPlannerSetting.MainModuleFirst);
    
    dispatch({
      type: "FLEET_PLANNER_UPDATE_SETTINGS",
      payload: { 
        accountId, 
        onlyDisplayOwned: newOnlyDisplayOwned,
        displayControl: newDisplayControl,
        mainModuleFirst: newMainModuleFirst 
      },
    });
  }

  return (
    <div className="fleet-planer-general-control">
      <ToggleButtonGroup
        color="success"
        onChange={handleTypeChange}
        value={showControl ? selectedTypes : null}
        size="small"
        disabled={!showControl}
      >
        {shipTypeToggleButtons}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={[
          ...(onlyDisplayOwned ? [FleetPlannerSetting.DisplayOwned.toString()] : []),
          ...(displayControl ? [FleetPlannerSetting.DisplayControl.toString()] : []),
          ...(mainModuleFirst ? [FleetPlannerSetting.MainModuleFirst.toString()] : [])
        ]}
        onChange={handleUpdateSetting}
        size="small"
      >
        <ToggleButton value={FleetPlannerSetting.DisplayOwned}>
          <VisibilityIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value={FleetPlannerSetting.DisplayControl}>
          <TuneIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value={FleetPlannerSetting.MainModuleFirst}>
          <DeveloperBoardIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

function AccountControl(): React.JSX.Element {
  // 使用Context替代Redux
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccountId;
  const gameAccounts = Object.values(state.gameAccounts || {});

  function handleAccountChange(
    event: React.MouseEvent<HTMLElement>,
    newId: string,
  ) {
    dispatch({
      type: "SELECTED_ACCOUNT/SET",
      payload: { accountId: newId },
    });
  }

  const accountToggleButtons = gameAccounts.map((account) => {
    return (
      <ToggleButton
        value={account.id}
        className="account-toggle-button"
        size="small"
        key={account.id}
      >
        {account.name}
      </ToggleButton>
    );
  });
  return (
    <ToggleButtonGroup
      value={accountId}
      exclusive
      onChange={handleAccountChange}
      color="success"
      size="small"
    >
      {accountToggleButtons}
    </ToggleButtonGroup>
  );
}

export default FleetPlaner;
