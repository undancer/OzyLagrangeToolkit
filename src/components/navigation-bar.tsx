import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    TextField,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListSubheader,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CasinoIcon from "@mui/icons-material/Casino";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link as RouterLink } from "react-router-dom";
import { ClosedPackageIcon } from "./Icons/closedpackage";
import { useAppSelector, useAppDispatch } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/game-account";
import { addAccount as add, removeAccount as remove } from "../redux/actions/game-account";
import "./css/navigation-bar.css";
import { randomName } from "./utils/randomName";

const pages = ["蓝图档案", /* "蓝图报表", */ "计时器", "舰队计划" /* , "保底研发" */];
const path: { [index: string]: string } = {
    计时器: "tracker",
    蓝图档案: "blueprint",
    蓝图报表: "blueprintreport",
    舰队计划: "fleetbuilder",
    保底研发: "research",
};

function AccountDialog(props: { open: boolean; onClose: () => void }): JSX.Element {
    const { open, onClose } = props;
    const [name, setName] = useState("");
    const gameAccounts = useAppSelector((state) => selectAllAccounts(state));
    const dispatch = useAppDispatch();

    function addAccount() {
        dispatch(add(name));
        setName("");
    }

    function addRandomAccount() {
        dispatch(add(randomName()));
        setName("");
    }

    function removeAccount(id: string) {
        let subId = "";
        if (gameAccounts.length > 1) {
            const otherAccount = gameAccounts.find((account) => account.id !== id);
            if (otherAccount) subId = otherAccount.id;
        }
        dispatch(remove(id, subId));
    }

    const accountListItems = gameAccounts.map((account) => {
        return (
            <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeAccount(account.id)}>
                        <DeleteIcon />
                    </IconButton>
                }
                key={account.id}
            >
                {account.name}
            </ListItem>
        );
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <List subheader={<ListSubheader id="account-list-subheader">现有账号</ListSubheader>}>
                {accountListItems}
            </List>
            <div className="container-add-account">
                <TextField
                    label="添加账号"
                    variant="standard"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                ></TextField>
                <IconButton className="button-add-account" onClick={addAccount}>
                    <PersonAddIcon />
                </IconButton>
                <IconButton className="button-add-account" onClick={addRandomAccount}>
                    <CasinoIcon />
                </IconButton>
            </div>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}

export function NavigationBar() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    function openNavMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorElNav(event.currentTarget);
    }

    function closeNavMenu() {
        setAnchorElNav(null);
    }

    function openDialog() {
        setDialogOpen(true);
    }

    function closeDialog() {
        setDialogOpen(false);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <ClosedPackageIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Ozy的拉格朗日工具组
                    </Typography>

                    {/* mobile menu */}
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

                    {/* desktop menu */}
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
                    <Button color="inherit" onClick={openDialog}>
                        账号管理
                    </Button>
                    <AccountDialog open={dialogOpen} onClose={closeDialog} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
