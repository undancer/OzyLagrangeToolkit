import { List, ListItem, ListItemText, Checkbox, TextField, InputAdornment, Chip, Avatar } from "@mui/material";
import React from "react";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-super-cap.css";
import { SuperCapData, SuperCapModule } from "./data/ship-data-types";

export function ModuleChip(props: { superCapModule: SuperCapModule }): JSX.Element {
    const { superCapModule } = props;
    const [selected, setSelected] = React.useState(false);

    function handleClick() {
        setSelected(!selected);
    }

    const label = superCapModule.id.toUpperCase();
    return (
        <Chip
            variant={selected ? "filled" : "outlined"}
            avatar={<Avatar>{label}</Avatar>}
            label={superCapModule.shortName}
            size={"small"}
            onClick={handleClick}
            color={selected ? "primary" : "default"}
        />
    );
}

export function ListItemSuperCap(props: { data: SuperCapData }): JSX.Element {
    const { data } = props;
    const aircraftList: JSX.Element[] = [];
    const checkBox = <Checkbox className="checkbox-aircraft-variant" color="success" />;
    aircraftList.push(<ListItem disablePadding>{checkBox}</ListItem>);

    const mainModules: JSX.Element[] = [];
    const typeAModules: JSX.Element[] = [];
    const typeBModules: JSX.Element[] = [];
    const typeCModules: JSX.Element[] = [];
    const typeDModules: JSX.Element[] = [];
    Object.keys(data.modules).forEach((key) => {
        const superCapModule = data.modules[key];
        if (key.startsWith("m")) mainModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("a")) typeAModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("b")) typeBModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("c")) typeCModules.push(<ModuleChip superCapModule={superCapModule} />);
        if (key.startsWith("d")) typeDModules.push(<ModuleChip superCapModule={superCapModule} />);
    });

    return (
        <React.Fragment>
            <ListItem className="list-item-aircraft-data">
                <ListItem disablePadding>
                    <ListItemText primary={data.name} />
                </ListItem>
                <ListItem disablePadding>
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
                </ListItem>
                <List disablePadding>{aircraftList}</List>
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder">
                {mainModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder">
                {typeAModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder">
                {typeBModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder">
                {typeCModules}
            </ListItem>
            <ListItem disablePadding className="list-item-module-holder">
                {typeDModules}
            </ListItem>
        </React.Fragment>
    );
}
