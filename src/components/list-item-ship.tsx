import { List, ListItem, ListItemText, FormControlLabel, Checkbox, TextField, InputAdornment } from "@mui/material";
import { ShipData } from "./data/ship-data-types";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-ship.css";

export function ListItemShip(props: { data: ShipData }): JSX.Element {
    const { data } = props;
    const shipList: JSX.Element[] = [];
    data.variants.forEach((variant) => {
        shipList.push(
            <ListItem disablePadding>
                <FormControlLabel
                    value="start"
                    className="control-label-ship-variant"
                    control={<Checkbox className="checkbox-ship-variant" color="success" />}
                    label={variant}
                    labelPlacement="start"
                    sx={{ color: variant === "看不到" ? "white" : "black" }}
                />
            </ListItem>,
        );
    });

    return (
        <ListItem className="list-item-ship-data">
            <List disablePadding>
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
                    />
                </ListItem>
            </List>
            <List disablePadding>{shipList}</List>
        </ListItem>
    );
}
