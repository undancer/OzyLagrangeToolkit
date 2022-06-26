import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import { TimerType } from "../redux/actions/gameTimer";
import { ShipIcon } from "./Icons/ship";
import { BattleShipIcon } from "./Icons/battleship";
import { CargoShipIcon } from "./Icons/cargoship";
import ScienceIcon from '@mui/icons-material/Science';
import { AgreementIcon } from "./Icons/agreement";

interface TimerIconProps {
    type: TimerType
}

export function TimerIcon(props: TimerIconProps): JSX.Element {
    switch (props.type) {
        case TimerType.construction:
            return <SettingsSuggestIcon />
        case TimerType.baseUpgrade:
            return <FileUploadIcon />
        case TimerType.ship:
            return <ShipIcon />
        case TimerType.miner:
            return <CargoShipIcon />
        case TimerType.capitalship:
            return <BattleShipIcon />
        case TimerType.research:
            return <ScienceIcon />
        case TimerType.agreement:
            return <AgreementIcon />
        default:
            break;
    }
    return <LogoDevIcon />
}