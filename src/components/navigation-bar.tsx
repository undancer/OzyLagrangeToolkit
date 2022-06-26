import { AppBar, Box, Button, Dialog, DialogActions, DialogTitle, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { add } from "../redux/gameAccount";
import { useAppDispatch } from "../redux/utils/hooks";


export function NavigationBar() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();

    function openDialog() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setName("");
    }

    function addAccount() {
        dispatch(add(name));
        handleClose();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                        Infinite Lagrange Tracker
                    </Typography>
                    <Button color="inherit" onClick={openDialog}>Add</Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add Section</DialogTitle>
                        <TextField autoFocus fullWidth label="Section Name" value={name} onChange={event => setName(event.target.value)}></TextField>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={addAccount}>Add</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
