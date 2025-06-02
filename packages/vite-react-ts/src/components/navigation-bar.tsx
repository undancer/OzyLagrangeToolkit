import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink } from "react-router-dom";
import { ClosedPackageIcon } from "./Icons/closedpackage";
import "./css/navigation-bar.css";

const pages = [
  "蓝图档案",
  /* "蓝图报表", */ "计时器",
  "舰队计划",
  "探险地图" /* , "保底研发" */,
];
const path: { [index: string]: string } = {
  计时器: "", // 修改为空字符串，对应根路径 /
  蓝图档案: "blueprint",
  蓝图报表: "blueprint-report", // 修改为与路由定义一致
  舰队计划: "fleet-builder", // 修改为与路由定义一致
  保底研发: "research",
  探险地图: "angulum-map", // 修改为与路由定义一致
};

export function NavigationBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  function openNavMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElNav(event.currentTarget);
  }

  function closeNavMenu() {
    setAnchorElNav(null);
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
                color="inherit"
                sx={{ my: 2, display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Button component={RouterLink} to={"/setting"} color="inherit">
            设置
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
