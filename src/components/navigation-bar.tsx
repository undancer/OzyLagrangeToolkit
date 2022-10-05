import { AppBar, Box, Button, Dialog, DialogActions, DialogTitle, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { add } from "../redux/gameAccount";
import { useAppDispatch } from "../redux/utils/hooks";
import { ClosedPackageIcon } from "./Icons/closedpackage";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";

const pages = ["tracker", "blueprint", "builder"];

export function NavigationBar() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

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
                    <ClosedPackageIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Ozy's Lagrange Toolkit
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem href={"/"+page} key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page}
                            href={"/"+page} 
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            {page}
                        </Button>
                        ))}
                    </Box>
                    <Button color="inherit" onClick={openDialog}>
                        Add Account
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add Account</DialogTitle>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Section Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        ></TextField>
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
