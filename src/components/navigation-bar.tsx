import { AppBar, Box, Button, Dialog, DialogActions, DialogTitle, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink } from "react-router-dom";
import { ClosedPackageIcon } from "./Icons/closedpackage";
import { useAppDispatch } from "../redux/utils/hooks";
import { addAccount as add, removeAccount as remove } from "../redux/actions/game-account";

const pages = ["计时器", "蓝图档案", "舰队计划", "保底研发"];
const path: { [index: string]: string } = {
    计时器: "tracker",
    蓝图档案: "blueprint",
    舰队计划: "fleetbuilder",
    保底研发: "research",
};
enum DialogType {
    Add = "add",
    Remove = "remove",
}

export function NavigationBar() {
    const [addDialopOpen, setAddDialopOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    function openNavMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorElNav(event.currentTarget);
    }

    function closeNavMenu() {
        setAnchorElNav(null);
    }

    function openDialog(type: DialogType) {
        switch (type) {
            case DialogType.Add:
                setAddDialopOpen(true);
                break;
            case DialogType.Remove:
                setRemoveDialogOpen(true);
                break;
            default:
                // Do nothing;
                break;
        }
    }

    function closeDialog(type: DialogType) {
        switch (type) {
            case DialogType.Add:
                setAddDialopOpen(false);
                break;
            case DialogType.Remove:
                setRemoveDialogOpen(false);
                break;
            default:
                // Do nothing;
                break;
        }
        setName("");
    }

    function addAccount() {
        dispatch(add(name));
        closeDialog(DialogType.Add);
    }

    function removeAccount() {
        dispatch(remove(name));
        closeDialog(DialogType.Remove);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <ClosedPackageIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Ozy的拉格朗日工具组
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={openNavMenu}
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
                            onClose={closeNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    component={RouterLink}
                                    to={`/${path[page]}`}
                                    key={page}
                                    onClick={closeNavMenu}
                                >
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                component={RouterLink}
                                to={`/${path[page]}`}
                                onClick={closeNavMenu}
                                sx={{ my: 2, color: "black", display: "block" }}
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
                    <Dialog open={addDialopOpen} onClose={() => closeDialog(DialogType.Add)}>
                        <DialogTitle>添加账号</DialogTitle>
                        <TextField
                            autoFocus
                            fullWidth
                            label="账号名"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        ></TextField>
                        <DialogActions>
                            <Button onClick={() => closeDialog(DialogType.Add)}>取消</Button>
                            <Button onClick={addAccount}>加入</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={removeDialogOpen} onClose={() => closeDialog(DialogType.Remove)}>
                        <DialogTitle>删除账号</DialogTitle>
                        <TextField
                            autoFocus
                            fullWidth
                            label="请输入要删除的账号名"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        ></TextField>
                        <DialogActions>
                            <Button onClick={() => closeDialog(DialogType.Remove)}>取消</Button>
                            <Button onClick={removeAccount}>删除</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
