import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { AircraftData, ShipData, ShipTypes } from "./data/ship-data-types";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-ship.css";
import { stringToTech } from "../context/utils/tech-utils";
import { useAcquiredBlueprint , useAppContext } from "../context";
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
  const checked = useMemo(() => hasShipVariant(shipId, variant), [hasShipVariant, shipId, variant, accountId]);
  const shipProgress = useMemo(() => getShipVariantProgress(shipId, variant), [getShipVariantProgress, shipId, variant, accountId]);
  const { showZeroPercent } = useMemo(() => getBlueprintSettingForSelectedAccount(), [getBlueprintSettingForSelectedAccount, accountId]);
  const hasBaseVariant = useMemo(() => hasShipVariant(shipId, 0), [hasShipVariant, shipId, accountId]);

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
    <div className="ship-checkbox">
      {showDisplay ? (
        <Button
          variant="text"
          color="secondary"
          size="small"
          className="completation-button"
          onClick={handleProgressChange}
        >
          {`${shipProgress}%`}
        </Button>
      ) : null}
      <FormControlLabel
        value="start"
        className="control-label-ship-variant"
        control={
          <Checkbox
            checked={checked}
            className="checkbox-ship-variant"
            color="success"
          />
        }
        label={label || ""}
        labelPlacement="start"
        onChange={handleChange}
      />
    </div>
  );
}

function InputShipTechPoint(props: { shipId: string }): React.JSX.Element {
  const { shipId } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccountId;
  const { techPointsByShip, addShipVariant } = useAcquiredBlueprint();
  
  // 使用useMemo缓存计算结果，添加accountId作为依赖项
  const points = useMemo(() => techPointsByShip(ShipTypes.destroyer, shipId), [techPointsByShip, shipId, accountId]);
  const checked = points >= 0;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!checked || !accountId) return;
    const techPoint = stringToTech(event.target.value);
    // 在Context系统中，我们通过addShipVariant来更新科技点
    addShipVariant(accountId, shipId, -1, techPoint); // 使用-1表示不是特定变体，只更新科技点
  }

  return (
    <TextField
      id={`ship-tech-point-${shipId}`}
      value={points <= 0 ? "" : points}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <TechIcon className="svg-fill-tech-icon" />
          </InputAdornment>
        ),
      }}
      className="input-box-tech-point"
      size="small"
      color="primary"
      variant="standard"
      onChange={handleInputChange}
    />
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
  const points = useMemo(() => techPointsByShip(ShipTypes.destroyer, data.id), [techPointsByShip, data.id, accountId]);
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
      <ListItem className="list-item-aircraft-data">
        <ListItemText primary={data.name} />
        {checked ? <InputShipTechPoint shipId={data.id} /> : null}
        <List disablePadding>{shipList}</List>
      </ListItem>
    );
  }

  return (
    <ListItem className="list-item-ship-data">
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemText primary={data.name} className="ship-name-text" />
        </ListItem>
        {checked ? (
          <ListItem disablePadding>
            <InputShipTechPoint shipId={data.id} />
          </ListItem>
        ) : null}
      </List>
      <div className="ship-checkbox-area">{shipList}</div>
    </ListItem>
  );
}
