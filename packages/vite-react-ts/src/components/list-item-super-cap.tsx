import React, { useMemo } from "react";
import { TechIcon } from "./svg/tech-icon";
import "./css/list-item-super-cap.css";
import {
  ShipTypes,
  SuperCapData,
  SuperCapModule,
} from "./data/ship-data-types";
import { stringToTech } from "../context/utils/tech-utils";
import { useAcquiredBlueprint, useAppContext } from "../context";

function ModuleChip(props: {
  superCapModule: SuperCapModule;
  superCapId: string;
}): React.JSX.Element {
  const { superCapModule, superCapId } = props;
  const moduleId = superCapModule.id;

  const { state } = useAppContext();
  const accountId = state.selectedAccountId;
  const { hasModule, addModule, removeModule } = useAcquiredBlueprint();

  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const checked = useMemo(
    () => hasModule(superCapId, superCapModule.id),
    [hasModule, superCapId, superCapModule.id, accountId],
  );

  function handleClick() {
    if (!accountId) return;
    if (checked) removeModule(accountId, superCapId, moduleId);
    else addModule(accountId, superCapId, moduleId);
  }

  // 使用useMemo缓存计算结果
  const chipColor = useMemo(() => {
    if (superCapModule.important && checked) return "primary";
    else if (checked) return "secondary";
    return "default";
  }, [superCapModule.important, checked]) as
    | "default"
    | "primary"
    | "secondary";

  const label = moduleId.toUpperCase();
  return (
    <div
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs mr-1 mb-1 cursor-pointer ${superCapModule.isBase ? "opacity-50 cursor-not-allowed" : ""} ${checked ? "bg-" + (chipColor === "primary" ? "blue" : chipColor === "secondary" ? "purple" : "gray") + "-100 text-" + (chipColor === "primary" ? "blue" : chipColor === "secondary" ? "purple" : "gray") + "-800 border-" + (chipColor === "primary" ? "blue" : chipColor === "secondary" ? "purple" : "gray") + "-300" : "bg-white border-gray-300 text-gray-700"} border`}
      onClick={superCapModule.isBase ? undefined : handleClick}
    >
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full mr-1 text-xs font-bold ${checked ? "bg-" + (chipColor === "primary" ? "blue" : chipColor === "secondary" ? "purple" : "gray") + "-500 text-white" : "bg-gray-200 text-gray-700"}`}
      >
        {label}
      </span>
      <span>{superCapModule.shortName}</span>
    </div>
  );
}

function ModuleListItems(props: {
  superCapModules: { [key: string]: SuperCapModule };
  superCapId: string;
}): React.JSX.Element {
  const { superCapModules, superCapId } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;

  // 使用useMemo缓存模块组列表，添加accountId作为依赖项
  const moduleGroup = useMemo(() => {
    const moduleTypes = ["m", "a", "b", "c", "d", "e", "f"];
    return moduleTypes.map((type) => {
      const moduleList: React.JSX.Element[] = [];
      Object.keys(superCapModules).forEach((key) => {
        const superCapModule = superCapModules[key];
        if (key.startsWith(type))
          moduleList.push(
            <ModuleChip
              superCapModule={superCapModule}
              key={key}
              superCapId={superCapId}
            />,
          );
      });
      if (moduleList.length <= 0) return null;
      return (
        <div className="list-item-module-holder flex flex-wrap p-1" key={type}>
          {moduleList}
        </div>
      );
    });
  }, [superCapModules, superCapId, accountId]);

  return <React.Fragment>{moduleGroup}</React.Fragment>;
}

function SuperCapCheckBox(props: { superCapId: string }): React.JSX.Element {
  const { superCapId } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;

  const { hasSuperCap, addSuperCap, removeSuperCap } = useAcquiredBlueprint();

  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const checked = useMemo(
    () => hasSuperCap(superCapId),
    [hasSuperCap, superCapId, accountId],
  );

  function handleChange() {
    if (!accountId) return;
    if (checked) {
      removeSuperCap(accountId, superCapId);
    } else {
      addSuperCap(accountId, superCapId);
    }
  }

  return (
    <div className="py-1">
      <input
        type="checkbox"
        checked={checked}
        className="checkbox-aircraft-variant w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
        onChange={handleChange}
      />
    </div>
  );
}

function InputSuperCapTechPoint(props: {
  superCapId: string;
}): React.JSX.Element {
  const { superCapId } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;
  const { hasSuperCap, techPointsByShip, addSuperCap } = useAcquiredBlueprint();

  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const checked = useMemo(
    () => hasSuperCap(superCapId),
    [hasSuperCap, superCapId, accountId],
  );
  const points = useMemo(
    () => techPointsByShip(ShipTypes.carrier, superCapId),
    [techPointsByShip, superCapId, accountId],
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!checked || !accountId) return;
    const techPoint = stringToTech(event.target.value);
    // 在Context系统中，我们通过addSuperCap来更新科技点
    addSuperCap(accountId, superCapId, techPoint);
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
        id={`super-cap-tech-point-${superCapId}`}
        value={points <= 0 ? "" : points}
        className="pl-8 py-1 text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
        onChange={handleInputChange}
      />
    </div>
  );
}

export function ListItemSuperCap(props: {
  data: SuperCapData;
}): React.JSX.Element {
  const { data } = props;
  const { hasSuperCap } = useAcquiredBlueprint();
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;

  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const checked = useMemo(
    () => hasSuperCap(data.id),
    [hasSuperCap, data.id, accountId],
  );

  return (
    <React.Fragment>
      <div className="list-item-aircraft-data flex items-center p-2">
        <div className="flex-grow">{data.name}</div>
        {checked ? <InputSuperCapTechPoint superCapId={data.id} /> : null}
        <div className="flex">
          <SuperCapCheckBox superCapId={data.id} key={data.id} />
        </div>
      </div>
      {checked ? (
        <ModuleListItems superCapModules={data.modules} superCapId={data.id} />
      ) : null}
    </React.Fragment>
  );
}
