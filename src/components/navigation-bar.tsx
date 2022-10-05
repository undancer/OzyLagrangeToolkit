import { AppBar, Box, Button, Dialog, DialogActions, DialogTitle, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { add, remove } from "../redux/gameAccount";
import { useAppDispatch } from "../redux/utils/hooks";
import { ClosedPackageIcon } from "./Icons/closedpackage";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink } from "react-router-dom";

const pages = ["计时器", "蓝图目录", "舰队预览"];
const path: { [index: string]: string } = {"计时器":"tracker", "蓝图目录":"blueprint", "舰队预览":"fleetbuilder" };
enum DialogType{
    Add = "add",
    Remove = "remove"
}

export function NavigationBar() {
    const [addDialopOpen, setAddDialopOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    function openDialog(type: DialogType) {
        switch(type){
            case DialogType.Add:
                setAddDialopOpen(true);
                break;
            case DialogType.Remove:
                setRemoveDialogOpen(true);
                break;
        }
    }

    function handleClose(type: DialogType) {
        switch(type){
            case DialogType.Add:
                setAddDialopOpen(false);
                break;
            case DialogType.Remove:
                setRemoveDialogOpen(false);
                break;
        }
        setName("");
    }

    function addAccount() {
        dispatch(add(name));
        handleClose(DialogType.Add);
    }

    function removeAccount() {
        dispatch(remove(name));
        handleClose(DialogType.Remove);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <ClosedPackageIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Ozy的拉格朗日工具箱
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
                                <MenuItem component={RouterLink} to={"/"+path[page]} key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page}
                            component={RouterLink}
                            to={"/"+path[page]} 
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            {page}
                        </Button>
                        ))}
                    </Box>
                    <Button color="inherit" onClick={() => openDialog(DialogType.Add)}>
                        添加账号
                    </Button>
                    <Button color="inherit" onClick={() => openDialog(DialogType.Remove)}>
                        删除账号
                    </Button>
                    <Dialog open={addDialopOpen} onClose={() => handleClose(DialogType.Add)}>
                        <DialogTitle>添加账号</DialogTitle>
                        <TextField
                            autoFocus
                            fullWidth
                            label="账号名"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        ></TextField>
                        <DialogActions>
                            <Button onClick={() => handleClose(DialogType.Add)}>取消</Button>
                            <Button onClick={addAccount}>加入</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={removeDialogOpen} onClose={() => handleClose(DialogType.Remove)}>
                        <DialogTitle>删除账号</DialogTitle>
                        <TextField
                            autoFocus
                            fullWidth
                            label="请输入要删除的账号名"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        ></TextField>
                        <DialogActions>
                            <Button onClick={() => handleClose(DialogType.Remove)}>取消</Button>
                            <Button onClick={removeAccount}>删除</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
