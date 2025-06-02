import { TimerType } from "../context";
import { ShipIcon } from "./svg/ship";
import { BattleShipIcon } from "./svg/battleship";
import { CargoShipIcon } from "./svg/cargoship";
import { AgreementIcon } from "./svg/agreement";
import { TechIcon } from "./svg/tech";
import { HammerIcon } from "./svg/hammer";
import { FlaskIcon } from "./svg/flask";
import React from "react";

interface TimerIconProps {
  type: TimerType;
}

export function TimerIcon(props: TimerIconProps): React.JSX.Element {
  switch (props.type) {
    case TimerType.construction:
      return <HammerIcon className="w-6 h-6" />;
    case TimerType.baseUpgrade:
      return <TechIcon className="w-6 h-6" />;
    case TimerType.ship:
      return <ShipIcon className="w-6 h-6" />;
    case TimerType.miner:
      return <CargoShipIcon className="w-6 h-6" />;
    case TimerType.capitalship:
      return <BattleShipIcon className="w-6 h-6" />;
    case TimerType.research:
      return <FlaskIcon className="w-6 h-6" />;
    case TimerType.agreement:
      return <AgreementIcon className="w-6 h-6" />;
    default:
      break;
  }
  return <TechIcon className="w-6 h-6" />;
}
