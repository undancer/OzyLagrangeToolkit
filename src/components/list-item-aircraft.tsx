import { List, ListItem, ListItemText, Checkbox, TextField, InputAdornment } from "@mui/material";
import { AircraftData } from "./data/ship-data-types";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-aircraft.css";
import { addAircraft, hasAircraft, removeAircraft } from "../redux/acquired-blue-print";

function AircraftCheckBox(props: { accountId: string; aircraftId: string }): JSX.Element {
    const { accountId, aircraftId } = props;
    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasAircraft(state, accountId, aircraftId));

    function handleChange() {
        if (checked) dispatch(removeAircraft({ accountId, aircraftId }));
        else dispatch(addAircraft({ accountId, aircraftId }));
    }

    return (
        <ListItem disablePadding>
            <Checkbox checked={checked} className="checkbox-aircraft-variant" color="success" onChange={handleChange} />
        </ListItem>
    );
}

export function ListItemAircraft(props: { data: AircraftData; accountId: string }): JSX.Element {
    const { data, accountId } = props;
    const aircraftList: JSX.Element[] = [];
    aircraftList.push(<AircraftCheckBox accountId={accountId} aircraftId={data.id} key={data.id} />);

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
