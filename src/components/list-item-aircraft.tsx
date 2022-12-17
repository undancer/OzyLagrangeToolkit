import { List, ListItem, ListItemText, Checkbox, TextField, InputAdornment } from "@mui/material";
import { AircraftData, ShipTypes } from "./data/ship-data-types";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-aircraft.css";
import { addAircraft, removeAircraft, updateTechPoint } from "../redux/acquired-blue-print";
import { stringToTech } from "../redux/utils/tech-cal";
import { UpdateTechPoint } from "../redux/types/acquired-blue-print.type";
import { getSelectedAccountId } from "../redux/selected-account";
import { hasAircraft, techPointsByShip } from "../redux/selector/acquired-blue-prints";

function AircraftCheckBox(props: { aircraftId: string }): JSX.Element {
    const { aircraftId } = props;
    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasAircraft(state, aircraftId));
    const accountId = useAppSelector(getSelectedAccountId);

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

function InputAircraftTechPoint(props: { aircraftId: string }): JSX.Element {
    const { aircraftId } = props;
    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasAircraft(state, aircraftId));
    const points = useAppSelector((state) => techPointsByShip(state, ShipTypes.aircraft, aircraftId));
    const accountId = useAppSelector(getSelectedAccountId);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!checked) return;
        const techPoint = stringToTech(event.target.value);
        const action: UpdateTechPoint = { accountId, shipId: aircraftId, shipType: ShipTypes.aircraft, techPoint };
        dispatch(updateTechPoint(action));
    }

    return (
        <TextField
            id="temp"
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

export function ListItemAircraft(props: { data: AircraftData }): JSX.Element {
    const { data } = props;
    const aircraftList: JSX.Element[] = [];
    aircraftList.push(<AircraftCheckBox aircraftId={data.id} key={data.id} />);
    const checked = useAppSelector((state) => hasAircraft(state, data.id));

    return (
        <ListItem className="list-item-aircraft-data">
            <ListItemText primary={data.name} />
            {checked ? <InputAircraftTechPoint aircraftId={data.id} /> : null}
            <List disablePadding>{aircraftList}</List>
        </ListItem>
    );
}
