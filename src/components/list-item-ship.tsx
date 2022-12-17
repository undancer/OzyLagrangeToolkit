import { List, ListItem, ListItemText, FormControlLabel, Checkbox, TextField, InputAdornment } from "@mui/material";
import { ShipData, ShipTypes } from "./data/ship-data-types";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { addShip, removeShip, updateTechPoint } from "../redux/acquired-blue-print";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-ship.css";
import { stringToTech } from "../redux/utils/tech-cal";
import { UpdateTechPoint } from "../redux/types/acquired-blue-print.type";
import { getSelectedAccountId } from "../redux/selected-account";
import { hasShipVariant, techPointsByShip } from "../redux/selector/acquired-blue-prints";

function ShipVariantCheckBox(props: { shipId: string; variant: number; label: string }): JSX.Element {
    const { shipId, variant, label } = props;

    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasShipVariant(state, shipId, variant));
    const accountId = useAppSelector(getSelectedAccountId);

    function handleChange() {
        if (checked) dispatch(removeShip({ accountId, shipId, variant }));
        else dispatch(addShip({ accountId, shipId, variant }));
    }

    return (
        <ListItem disablePadding>
            <FormControlLabel
                value="start"
                className="control-label-ship-variant"
                control={<Checkbox checked={checked} className="checkbox-ship-variant" color="success" />}
                label={label || ""}
                labelPlacement="start"
                onChange={handleChange}
            />
        </ListItem>
    );
}

function InputShipTechPoint(props: { shipId: string }): JSX.Element {
    const { shipId } = props;
    const dispatch = useAppDispatch();
    const points = useAppSelector((state) => techPointsByShip(state, ShipTypes.destroyer, shipId));
    const accountId = useAppSelector(getSelectedAccountId);
    const checked = points >= 0;

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!checked) return;
        const techPoint = stringToTech(event.target.value);
        const action: UpdateTechPoint = { accountId, shipId, shipType: ShipTypes.destroyer, techPoint };
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

export function ListItemShip(props: { data: ShipData }): JSX.Element {
    const { data } = props;
    const points = useAppSelector((state) => techPointsByShip(state, ShipTypes.destroyer, data.id));
    const checked = points >= 0;

    const shipList: JSX.Element[] = [];
    data.variants.forEach((label, index) => {
        const key = `${data.id}-${index}`;
        shipList.push(<ShipVariantCheckBox shipId={data.id} variant={index} key={key} label={label} />);
    });

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
            <List disablePadding>{shipList}</List>
        </ListItem>
    );
}
