import { List, ListItem, ListItemText, FormControlLabel, Checkbox, TextField, InputAdornment } from "@mui/material";
import { ShipData } from "./data/ship-data-types";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { addShip, hasShipVariant, removeShip } from "../redux/acquired-blue-print";
import { TechIcon } from "./Icons/tech";
import "./css/list-item-ship.css";

function ShipVariantCheckBox(props: {
    accountId: string;
    shipId: string;
    variant: number;
    label: string;
}): JSX.Element {
    const { accountId, shipId, variant, label } = props;

    const dispatch = useAppDispatch();
    const checked = useAppSelector((state) => hasShipVariant(state, accountId, shipId, variant));

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

export function ListItemShip(props: { data: ShipData; accountId: string }): JSX.Element {
    const { data, accountId } = props;

    const shipList: JSX.Element[] = [];
    data.variants.forEach((label, index) => {
        const key = `${data.id}-${index}`;
        shipList.push(
            <ShipVariantCheckBox accountId={accountId} shipId={data.id} variant={index} key={key} label={label} />,
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
