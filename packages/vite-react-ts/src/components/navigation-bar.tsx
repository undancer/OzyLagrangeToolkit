import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MenuIcon } from "./svg/menu-icon";
import { ClosedPackageIcon } from "./svg/closedpackage";
import { ThemeToggle } from "./ui/theme-provider";

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

export function NavigationBar(): React.JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="w-full">
      <nav className="navbar">
        <div className="container mx-auto">
          <div className="flex-between w-full">
            {/* Logo and Title */}
            <div className="flex-center">
              <div className="text-[var(--text-primary)]">
                <ClosedPackageIcon />
              </div>
              <h1 className="navbar-brand ml-2">Ozy的拉格朗日工具组</h1>
            </div>

            {/* Mobile menu button and theme toggle */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <ThemeToggle className="text-[var(--text-primary)] hover:bg-[var(--table-row-hover)]" />
              
              {/* Mobile menu button */}
              <div className="block md:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <MenuIcon />
                </button>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-2">
              {pages.map((page) => (
                <RouterLink
                  key={page}
                  to={`/${path[page]}`}
                  className="navbar-item"
                  onClick={closeMenu}
                >
                  {page}
                </RouterLink>
              ))}
              <RouterLink to="/setting" className="navbar-item">
                设置
              </RouterLink>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${isMenuOpen ? "block" : "hidden"} md:hidden w-full mt-4`}
          >
            <div className="space-y-1">
              {pages.map((page) => (
                <RouterLink
                  key={page}
                  to={`/${path[page]}`}
                  className="navbar-item block w-full"
                  onClick={closeMenu}
                >
                  {page}
                </RouterLink>
              ))}
              <RouterLink
                to="/setting"
                className="navbar-item block w-full"
                onClick={closeMenu}
              >
                设置
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
