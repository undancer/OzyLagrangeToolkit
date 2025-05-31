import { Card, ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import NumbersIcon from "@mui/icons-material/Numbers";
import PercentIcon from "@mui/icons-material/Percent";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import { getSelectedAccountId, changeSelectedAccount } from "../redux/selected-account";
import { useAppSelector, useAppDispatch } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/game-account";
import "./css/blue-print-task-bar.css";
import { changeSetting } from "../redux/acquired-blue-print";
import { BPDisplayMode } from "../redux/types/acquired-blue-print.type";
import { bluePrintSettingForSelectedAccount } from "../redux/selector/acquired-blue-prints";

export function BluePrintTaskBar(): JSX.Element | null {
    const gameAccounts = useAppSelector(selectAllAccounts);
    const accountId = useAppSelector(getSelectedAccountId);
    const { displayMode, editLock, showZeroPercent } = useAppSelector(bluePrintSettingForSelectedAccount);
    const dispatch = useAppDispatch();
    const setting: string[] = [];
    if (displayMode === BPDisplayMode.count) setting.push("number");
    if (editLock) setting.push("locked");
    if (showZeroPercent) setting.push("zero");

    function handleAccountChange(event: React.MouseEvent<HTMLElement>, newId: string) {
        dispatch(changeSelectedAccount(newId));
    }

    function handleFormat(event: React.MouseEvent<HTMLElement>, result: string[]) {
        const updatedSetting = { accountId, editLock: true, displayMode: BPDisplayMode.count, showZeroPercent: true };
        if (result.findIndex((item) => item === "number") === -1) updatedSetting.displayMode = BPDisplayMode.percent;
        if (result.findIndex((item) => item === "locked") === -1) updatedSetting.editLock = false;
        if (result.findIndex((item) => item === "zero") === -1) updatedSetting.showZeroPercent = false;
        dispatch(changeSetting(updatedSetting));
    }

    const toggleButtonGroups = gameAccounts.map((account, index) => {
        return (
            <ToggleButton value={account.id} className="account-toggle-button" size="small" color="primary" key={index}>
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
                    <ToggleButton value="locked">{editLock ? <LockIcon /> : <LockOpenIcon />}</ToggleButton>
                    <ToggleButton value="number">
                        {displayMode === BPDisplayMode.percent ? <PercentIcon /> : <NumbersIcon />}
                    </ToggleButton>
                    <ToggleButton value="zero">{showZeroPercent ? <StarIcon /> : <StarHalfIcon />}</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="blue-print-account-selection">
                <Typography>账户选择：</Typography>
                <ToggleButtonGroup value={accountId} exclusive onChange={handleAccountChange} color="success">
                    {toggleButtonGroups}
                </ToggleButtonGroup>
            </div>
        </Card>
    );
}
