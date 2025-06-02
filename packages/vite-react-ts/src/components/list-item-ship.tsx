import { AircraftData, ShipData, ShipTypes } from "./data/ship-data-types";
import { TechIcon } from "./svg/tech-icon";
import "./css/list-item-ship.css";
import { stringToTech } from "../context/utils/tech-utils";
import { useAcquiredBlueprint, useAppContext } from "../context";
import React, { useMemo } from "react";

function ShipVariantCheckBox(props: {
  shipId: string;
  variant: number;
  label: string;
}): React.JSX.Element {
  const { shipId, variant, label } = props;

  const { state } = useAppContext();
  const accountId = state.selectedAccountId;

  const {
    hasShipVariant,
    getShipVariantProgress,
    getBlueprintSettingForSelectedAccount,
    addShipVariant,
    removeShipVariant,
    updateShipVariantProgress,
  } = useAcquiredBlueprint();

  // 使用useMemo缓存计算结果，避免重复调用，添加accountId作为依赖项
  const checked = useMemo(
    () => hasShipVariant(shipId, variant),
    [hasShipVariant, shipId, variant, accountId],
  );
  const shipProgress = useMemo(
    () => getShipVariantProgress(shipId, variant),
    [getShipVariantProgress, shipId, variant, accountId],
  );
  const { showZeroPercent } = useMemo(
    () => getBlueprintSettingForSelectedAccount(),
    [getBlueprintSettingForSelectedAccount, accountId],
  );
  const hasBaseVariant = useMemo(
    () => hasShipVariant(shipId, 0),
    [hasShipVariant, shipId, accountId],
  );

  // 计算是否显示进度按钮
  const showDisplay = useMemo(() => {
    const hideOnZeroPercent = shipProgress === 0 && !showZeroPercent;
    const noBaseBariant = !hasBaseVariant;
    const isBaseVariant = variant === 0;
    return !(hideOnZeroPercent || noBaseBariant || isBaseVariant || checked);
  }, [shipProgress, showZeroPercent, hasBaseVariant, variant, checked]);

  function handleChange() {
    if (!accountId) return;
    if (checked) {
      removeShipVariant(accountId, shipId, variant);
    } else {
      addShipVariant(accountId, shipId, variant);
    }
  }

  function handleProgressChange() {
    if (!accountId) return;
    updateShipVariantProgress(accountId, shipId, variant, 100); // 假设进度为100%
  }

  return (
    <div className="ship-checkbox flex items-center">
      {showDisplay ? (
        <button
          className="completation-button text-purple-600 text-sm px-2 py-1 rounded hover:bg-purple-50"
          onClick={handleProgressChange}
        >
          {`${shipProgress}%`}
        </button>
      ) : null}
      <label className="control-label-ship-variant flex items-center cursor-pointer">
        <span className="mr-2">{label || ""}</span>
        <input
          type="checkbox"
          checked={checked}
          className="checkbox-ship-variant w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}

function InputShipTechPoint(props: { shipId: string }): React.JSX.Element {
  const { shipId } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;
  const { techPointsByShip, addShipVariant } = useAcquiredBlueprint();

  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const points = useMemo(
    () => techPointsByShip(ShipTypes.destroyer, shipId),
    [techPointsByShip, shipId, accountId],
  );
  const checked = points >= 0;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!checked || !accountId) return;
    const techPoint = stringToTech(event.target.value);
    // 在Context系统中，我们通过addShipVariant来更新科技点
    addShipVariant(accountId, shipId, -1, techPoint); // 使用-1表示不是特定变体，只更新科技点
  }

  return (
    <div className="input-box-tech-point relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <TechIcon
          className="svg-fill-tech-icon text-blue-600"
          width={18}
          height={18}
        />
      </div>
      <input
        id={`ship-tech-point-${shipId}`}
        value={points <= 0 ? "" : points}
        className="pl-8 py-1 text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
        onChange={handleInputChange}
      />
    </div>
  );
}

export function ListItemShip(props: {
  data: ShipData | AircraftData;
}): React.JSX.Element {
  const { data } = props;
  const { techPointsByShip } = useAcquiredBlueprint();
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;

  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const points = useMemo(
    () => techPointsByShip(ShipTypes.destroyer, data.id),
    [techPointsByShip, data.id, accountId],
  );
  const checked = points >= 0;

  // 使用useMemo缓存子组件列表，避免不必要的重新渲染
  const shipList = useMemo(() => {
    const list: React.JSX.Element[] = [];
    data.variants.forEach((label, index) => {
      const key = `${data.id}-${index}`;
      list.push(
        <ShipVariantCheckBox
          shipId={data.id}
          variant={index}
          key={key}
          label={label}
        />,
      );
    });
    return list;
  }, [data]);

  if (data.variants.length === 1) {
    return (
      <div className="list-item-aircraft-data flex items-center p-2">
        <div className="flex-grow">{data.name}</div>
        {checked ? <InputShipTechPoint shipId={data.id} /> : null}
        <div className="flex flex-col">{shipList}</div>
      </div>
    );
  }

  return (
    <div className="list-item-ship-data flex p-2">
      <div className="flex flex-col">
        <div className="ship-name-text">{data.name}</div>
        {checked ? (
          <div className="mt-1">
            <InputShipTechPoint shipId={data.id} />
          </div>
        ) : null}
      </div>
      <div className="ship-checkbox-area ml-auto">{shipList}</div>
    </div>
  );
}
