import { List, ListItem, ListItemText, Checkbox, TextField, InputAdornment } from "@mui/material";
import { AircraftData } from "./data/ship-data-types";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-aircraft.css";

export function ListItemAircraft(props: { data: AircraftData }): JSX.Element {
    const { data } = props;
    const aircraftList: JSX.Element[] = [];
    const checkBox = <Checkbox className="checkbox-aircraft-variant" color="success" />;
    aircraftList.push(<ListItem disablePadding>{checkBox}</ListItem>);

    return (
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
    );
}
