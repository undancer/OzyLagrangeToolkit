import { List, ListItem, ListItemText, FormControlLabel, Checkbox, TextField, InputAdornment } from "@mui/material";
import { ShipData } from "./data/ship-data";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-aircraft.css";

export function ListItemAircraft(props: { data: ShipData }): JSX.Element {
    const { data } = props;
    const aircraftList: JSX.Element[] = [];
    data.variants.forEach((variant) => {
        let checkBox = <Checkbox className="checkbox-aircraft-variant" color="success" />;
        if (variant.length > 0) {
            checkBox = (
                <FormControlLabel
                    value="start"
                    className="control-label-aircraft-variant"
                    control={<Checkbox className="checkbox-ship-variant" color="success" />}
                    label={variant}
                    labelPlacement="start"
                    sx={{ color: variant === "看不到" ? "white" : "black" }}
                />
            );
        }
        aircraftList.push(<ListItem disablePadding>{checkBox}</ListItem>);
    });

    return (
        <ListItem className="list-item-aircraft-data">
            <ListItem disablePadding>
                <ListItemText primary={data.name} className="ship-name-text" />
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
                    focused
                />
            </ListItem>
            <List disablePadding>{aircraftList}</List>
        </ListItem>
    );
}
