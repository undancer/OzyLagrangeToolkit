import { List, ListItem, ListItemText, Checkbox, TextField, InputAdornment, Chip, Avatar } from "@mui/material";
import React from "react";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-super-cap.css";
import { SuperCapData, SuperCapModule } from "./data/ship-data-types";

function ModuleChip(props: { superCapModule: SuperCapModule }): JSX.Element {
    const { superCapModule } = props;
    const [selected, setSelected] = React.useState(false);

    function handleClick() {
        setSelected(!selected);
    }

    let chipColor: "default" | "primary" | "secondary" = "default";
    if (superCapModule.important && selected) chipColor = "primary";
    else if (selected) chipColor = "secondary";

    const label = superCapModule.id.toUpperCase();
    return (
        <Chip
            variant={selected ? "filled" : "outlined"}
            avatar={<Avatar>{label}</Avatar>}
            label={superCapModule.shortName}
            size={"small"}
            onClick={handleClick}
            color={chipColor}
            disabled={superCapModule.isBase}
        />
    );
}

function ModuleListItems(props: { superCapModules: { [key: string]: SuperCapModule } }): JSX.Element {
    const { superCapModules } = props;
    const mainModules: JSX.Element[] = [];
    const typeAModules: JSX.Element[] = [];
    const typeBModules: JSX.Element[] = [];
    const typeCModules: JSX.Element[] = [];
    const typeDModules: JSX.Element[] = [];
    Object.keys(superCapModules).forEach((key) => {
        const superCapModule = superCapModules[key];
        if (key.startsWith("m")) mainModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("a")) typeAModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("b")) typeBModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("c")) typeCModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("d")) typeDModules.push(<ModuleChip superCapModule={superCapModule} />);
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

export function ListItemSuperCap(props: { data: SuperCapData }): JSX.Element {
    const { data } = props;
    const [checked, setChecked] = React.useState(false);
    const aircraftList: JSX.Element[] = [];
    const checkBox = (
        <Checkbox checked={checked} className="checkbox-aircraft-variant" color="success" onClick={handleClick} />
    );
    aircraftList.push(<ListItem disablePadding>{checkBox}</ListItem>);

    function handleClick() {
        setChecked(!checked);
    }

    return (
        <React.Fragment>
            <ListItem className="list-item-aircraft-data">
                <ListItemText primary={data.name} />
                <TextField
                    id="temp"
                    InputLabelProps={{ shrink: true }}
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
                />
                <List disablePadding>{aircraftList}</List>
            </ListItem>
            {checked ? <ModuleListItems superCapModules={data.modules} /> : null}
        </React.Fragment>
    );
}
