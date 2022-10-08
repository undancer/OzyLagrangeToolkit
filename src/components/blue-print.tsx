import "./css/blue-print.css";
import {
    Container,
    Card,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    FormControlLabel,
    Checkbox,
    TextField,
    InputAdornment,
} from "@mui/material";
import { ShipData, CRUISER_DATA, DESTROYER_DATA, FRIGATE_DATA, AIRCRAFT_DATA, CORVETTE_DATA } from "./data/ship-data";
import { TechIcon } from "./Icons/tech";

function renderShipData(data: ShipData) {
    return (
        <ListItem sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {/* <ListItemIcon>{Icon}</ListItemIcon> */}
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
                sx={{
                    width: "65px",
                    marginLeft: "15px",
                    // backgroundColor: "#B8E1FF",
                    marginBottom: "7px",
                    marginTop: "7px",
                }}
                size="small"
                color="primary"
                variant="standard"
                focused
            />
            <List>
                {data.variants.map((variant) => {
                    return (
                        <ListItem disablePadding>
                            <FormControlLabel
                                value="start"
                                control={<Checkbox sx={{ padding: 0.2 }} color="success" />}
                                label={variant}
                                labelPlacement="start"
                                sx={{ color: variant === "看不到" ? "white" : "black" }}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </ListItem>
    );
}

function shipTypeCard(data: ShipData[]) {
    return (
        <Card elevation={2}>
            <List
                aria-aria-labelledby="nested-list-subheader"
                component="nav"
                subheader={<ListSubheader component="div">{data[0].type}</ListSubheader>}
            >
                {data.map((ship) => {
                    return renderShipData(ship);
                })}
            </List>
        </Card>
    );
}

function BluePrint() {
    return (
        <Container maxWidth="xl">
            <div className="account-content-container">
                {shipTypeCard(CRUISER_DATA)}
                {shipTypeCard(DESTROYER_DATA)}
                {shipTypeCard(FRIGATE_DATA)}
                {shipTypeCard(AIRCRAFT_DATA)}
                {shipTypeCard(CORVETTE_DATA)}
            </div>
        </Container>
    );
}

export default BluePrint;
