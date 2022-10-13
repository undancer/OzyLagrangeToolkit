import { List, ListItem, ListItemText, Checkbox, TextField, InputAdornment, Chip, Avatar } from "@mui/material";
import React from "react";
import { TechIcon } from "./Icons/tech";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import "./css/list-item-super-cap.css";
import { ShipTypes, SuperCapData, SuperCapModule } from "./data/ship-data-types";
import {
    addModel,
    addSuperCap,
    hasModule,
    hasSuperCap,
    removeModel,
    removeSuperCap,
    techpointByAccount,
    updateTechPoint,
} from "../redux/acquired-blue-print";
import { UpdateTechPoint } from "../redux/types/acquired-blue-print.type";
import { stringToTech } from "../redux/utils/tech-cal";

function ModuleChip(props: { superCapModule: SuperCapModule; accountId: string; superCapId: string }): JSX.Element {
    const { superCapModule, accountId, superCapId } = props;
    const moduleId = superCapModule.id;

    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasModule(state, accountId, superCapId, superCapModule.id));

    function handleClick() {
        if (checked) dispatch(removeModel({ accountId, superCapId, moduleId }));
        else dispatch(addModel({ accountId, superCapId, moduleId }));
    }

    let chipColor: "default" | "primary" | "secondary" = "default";
    if (superCapModule.important && checked) chipColor = "primary";
    else if (checked) chipColor = "secondary";

    const label = moduleId.toUpperCase();
    return (
        <Chip
            variant={checked ? "filled" : "outlined"}
            avatar={<Avatar>{label}</Avatar>}
            label={superCapModule.shortName}
            size={"small"}
            onClick={handleClick}
            color={chipColor}
            disabled={superCapModule.isBase}
        />
    );
}

function ModuleListItems(props: {
    superCapModules: { [key: string]: SuperCapModule };
    accountId: string;
    superCapId: string;
}): JSX.Element {
    const { superCapModules, accountId, superCapId } = props;
    const mainModules: JSX.Element[] = [];
    const typeAModules: JSX.Element[] = [];
    const typeBModules: JSX.Element[] = [];
    const typeCModules: JSX.Element[] = [];
    const typeDModules: JSX.Element[] = [];
    Object.keys(superCapModules).forEach((key) => {
        const superCapModule = superCapModules[key];
        const moduleChip = (
            <ModuleChip superCapModule={superCapModule} key={key} accountId={accountId} superCapId={superCapId} />
        );
        if (key.startsWith("m")) mainModules.push(moduleChip);
        if (key.startsWith("a")) typeAModules.push(moduleChip);
        if (key.startsWith("b")) typeBModules.push(moduleChip);
        if (key.startsWith("c")) typeCModules.push(moduleChip);
        if (key.startsWith("d")) typeDModules.push(moduleChip);
    });

    return (
        <React.Fragment>
            <ListItem disablePadding className="list-item-module-holder" key="m">
                {mainModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder" key="a">
                {typeAModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder" key="b">
                {typeBModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder" key="c">
                {typeCModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder" key="d">
                {typeDModules}
            </ListItem>
        </React.Fragment>
    );
}

function SuperCapCheckBox(props: { accountId: string; superCapId: string }): JSX.Element {
    const { accountId, superCapId } = props;
    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasSuperCap(state, accountId, superCapId));

    function handleChange() {
        if (checked) dispatch(removeSuperCap({ accountId, superCapId }));
        else dispatch(addSuperCap({ accountId, superCapId }));
    }

    return (
        <ListItem disablePadding>
            <Checkbox checked={checked} className="checkbox-aircraft-variant" color="success" onChange={handleChange} />
        </ListItem>
    );
}

function InputSuperCapTechPoint(props: { accountId: string; superCapId: string }): JSX.Element {
    const { accountId, superCapId } = props;
    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasSuperCap(state, accountId, superCapId));
    const points = useAppSelector((state) => techpointByAccount(state, accountId, ShipTypes.carrier, superCapId));

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!checked) return;
        const techPoint = stringToTech(event.target.value);
        const action: UpdateTechPoint = { accountId, shipId: superCapId, shipType: ShipTypes.carrier, techPoint };
        dispatch(updateTechPoint(action));
    }

    return (
        <TextField
            id="temp"
            value={points <= 0 ? "" : points}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <TechIcon />
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

export function ListItemSuperCap(props: { data: SuperCapData; accountId: string }): JSX.Element {
    const { data, accountId } = props;
    const checked = useAppSelector((state) => hasSuperCap(state, accountId, data.id));

    return (
        <React.Fragment>
            <ListItem className="list-item-aircraft-data">
                <ListItemText primary={data.name} />
                {checked ? <InputSuperCapTechPoint accountId={accountId} superCapId={data.id} /> : null}
                <List disablePadding>
                    <SuperCapCheckBox accountId={accountId} superCapId={data.id} key={data.id} />
                </List>
            </ListItem>
            {checked ? (
                <ModuleListItems superCapModules={data.modules} accountId={accountId} superCapId={data.id} />
            ) : null}
        </React.Fragment>
    );
}
