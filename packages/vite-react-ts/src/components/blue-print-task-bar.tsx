import {
  BPDisplayMode,
  useAcquiredBlueprint,
  useAppContext,
  useGameAccount,
} from "../context";
import { LockOpenIcon } from "./svg/lock-open-icon";
import { LockIcon } from "./svg/lock-icon";
import { NumbersIcon } from "./svg/numbers-icon";
import { PercentIcon } from "./svg/percent-icon";
import { StarHalfIcon } from "./svg/star-half-icon";
import { StarIcon } from "./svg/star-icon";
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
      <button
        value={account.id}
        className={`account-toggle-button px-2 py-1 text-sm rounded border ${accountId === account.id ? "bg-blue-600 text-white border-blue-700" : "bg-transparent text-blue-600 border-blue-500 hover:bg-blue-50"}`}
        key={index}
        onClick={(e) => handleAccountChange(e, account.id)}
      >
        {account.name}
      </button>
    );
  });

  return (
    <div className="blue-print-task-bar bg-blue-900 shadow-sm rounded p-3">
      <div className="blue-print-control-bar">
        <div className="flex space-x-1 toggle-button-background">
          <button
            className={`p-2 rounded border ${setting.includes("locked") ? "bg-blue-600 text-white border-blue-700" : "bg-transparent text-blue-600 border-blue-500 hover:bg-blue-50"}`}
            onClick={(e) =>
              handleFormat(
                e,
                setting.includes("locked")
                  ? setting.filter((s) => s !== "locked")
                  : [...setting, "locked"],
              )
            }
          >
            {editLock ? (
              <LockIcon width={20} height={20} />
            ) : (
              <LockOpenIcon width={20} height={20} />
            )}
          </button>
          <button
            className={`p-2 rounded border ${setting.includes("number") ? "bg-blue-600 text-white border-blue-700" : "bg-transparent text-blue-600 border-blue-500 hover:bg-blue-50"}`}
            onClick={(e) =>
              handleFormat(
                e,
                setting.includes("number")
                  ? setting.filter((s) => s !== "number")
                  : [...setting, "number"],
              )
            }
          >
            {displayMode === BPDisplayMode.percent ? (
              <PercentIcon width={20} height={20} />
            ) : (
              <NumbersIcon width={20} height={20} />
            )}
          </button>
          <button
            className={`p-2 rounded border ${setting.includes("zero") ? "bg-blue-600 text-white border-blue-700" : "bg-transparent text-blue-600 border-blue-500 hover:bg-blue-50"}`}
            onClick={(e) =>
              handleFormat(
                e,
                setting.includes("zero")
                  ? setting.filter((s) => s !== "zero")
                  : [...setting, "zero"],
              )
            }
          >
            {showZeroPercent ? (
              <StarIcon width={20} height={20} />
            ) : (
              <StarHalfIcon width={20} height={20} />
            )}
          </button>
        </div>
      </div>
      <div className="blue-print-account-selection">
        <span className="text-white">账户选择：</span>
        <div className="flex space-x-2">{toggleButtonGroups}</div>
      </div>
    </div>
  );
}
