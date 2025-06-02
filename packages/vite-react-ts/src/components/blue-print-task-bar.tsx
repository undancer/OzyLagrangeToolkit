import {
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import NumbersIcon from "@mui/icons-material/Numbers";
import PercentIcon from "@mui/icons-material/Percent";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import {
  useGameAccount,
  useAcquiredBlueprint,
  useAppContext,
  BPDisplayMode,
} from "../context";
import "./css/blue-print-task-bar.css";
import React from "react";

export function BluePrintTaskBar(): React.JSX.Element | null {
  const { getAllAccounts } = useGameAccount();
  const gameAccounts = getAllAccounts();
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccountId;
  const { getBlueprintSettingForSelectedAccount, updateBlueprintSetting } =
    useAcquiredBlueprint();
  const { displayMode, editLock, showZeroPercent } =
    getBlueprintSettingForSelectedAccount();
  const setting: string[] = [];
  if (displayMode === "count") setting.push("number");
  if (editLock) setting.push("locked");
  if (showZeroPercent) setting.push("zero");

  function handleAccountChange(
    _event: React.MouseEvent<HTMLElement>,
    newId: string,
  ) {
    dispatch({
      type: "UPDATE_SELECTED_ACCOUNT_ID",
      payload: newId,
    });
  }

  function handleFormat(
    _event: React.MouseEvent<HTMLElement>,
    result: string[],
  ) {
    if (!accountId) return;

    const updatedSetting = {
      displayMode: "count",
      editLock: true,
      showZeroPercent: true,
    };

    if (result.findIndex((item) => item === "number") === -1)
      updatedSetting.displayMode = "percent";
    if (result.findIndex((item) => item === "locked") === -1)
      updatedSetting.editLock = false;
    if (result.findIndex((item) => item === "zero") === -1)
      updatedSetting.showZeroPercent = false;

    updateBlueprintSetting(accountId, updatedSetting);
  }

  const toggleButtonGroups = gameAccounts.map((account, index) => {
    return (
      <ToggleButton
        value={account.id}
        className="account-toggle-button"
        size="small"
        color="primary"
        key={index}
      >
        {account.name}
      </ToggleButton>
    );
  });

  return (
    <Card elevation={0} className="blue-print-task-bar">
      <div className="blue-print-control-bar">
        <ToggleButtonGroup
          value={setting}
          onChange={handleFormat}
          size="small"
          className="toggle-button-background"
        >
          <ToggleButton value="locked">
            {editLock ? <LockIcon /> : <LockOpenIcon />}
          </ToggleButton>
          <ToggleButton value="number">
            {displayMode === BPDisplayMode.percent ? (
              <PercentIcon />
            ) : (
              <NumbersIcon />
            )}
          </ToggleButton>
          <ToggleButton value="zero">
            {showZeroPercent ? <StarIcon /> : <StarHalfIcon />}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="blue-print-account-selection">
        <Typography>账户选择：</Typography>
        <ToggleButtonGroup
          value={accountId}
          exclusive
          onChange={handleAccountChange}
          color="success"
        >
          {toggleButtonGroups}
        </ToggleButtonGroup>
      </div>
    </Card>
  );
}
