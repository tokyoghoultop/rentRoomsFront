import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BarChartIcon from "@mui/icons-material/BarChart";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.clearToken);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const decoded = token ? jwtDecode(token) : null;
  const isAdmin = token ? 'admin' : '';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: open ? 240 : 72,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 72,
            transition: "width 0.3s",
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            padding: "16px",
          }}
        >
          <IconButton onClick={toggleSidebar}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon sx={{ margin: 1 }}>
              <HomeIcon />
            </ListItemIcon>
            {open && <ListItemText primary="หน้าแรก" />}
          </ListItem>

          <ListItem button component={Link} to="/mybookings">
                <ListItemIcon sx={{ margin: 1 }}>
                  <BookmarksIcon />
                </ListItemIcon>
                {open && <ListItemText primary="การจองของฉัน" />}
            </ListItem>

          {/* แสดงเมนูอื่นเฉพาะเมื่อมี token */}
          {token && (
            <>
              {isAdmin && (
                <>
                  <ListItem button component={Link} to="/bookings">
                    <ListItemIcon sx={{ margin: 1 }}>
                      <ListAltIcon />
                    </ListItemIcon>
                    {open && <ListItemText primary="รายการจองทั้งหมด" />}
                  </ListItem>

                  <ListItem button component={Link} to="/customroom">
                    <ListItemIcon sx={{ margin: 1 }}>
                      <MeetingRoomIcon />
                    </ListItemIcon>
                    {open && <ListItemText primary="จัดการห้อง" />}
                  </ListItem>

                  <ListItem button component={Link} to="/equipment">
                    <ListItemIcon sx={{ margin: 1 }}>
                      <InventoryIcon />
                    </ListItemIcon>
                    {open && <ListItemText primary="จัดการอุปกรณ์" />}
                  </ListItem>

                  <ListItem button component={Link} to="/equipmentstats">
                    <ListItemIcon sx={{ margin: 1 }}>
                      <BarChartIcon />
                    </ListItemIcon>
                    {open && <ListItemText primary="สถิติการใช้อุปกรณ์" />}
                  </ListItem>
                </>
              )}
            </>
          )}
        </List>
      </Drawer>

      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? 240 : 72}px)`,
          marginLeft: open ? 240 : 72,
          transition: "width 0.3s, margin-left 0.3s",
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            ระบบจองห้องประชุม
          </Typography>
          {token && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar alt={decoded?.fullName} src="https://via.placeholder.com/150" />
              <Typography
                variant="body1"
                noWrap
                sx={{
                  color: "white",
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
                id="basic-button"
                aria-controls={openMenu ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                onClick={handleClick}
              >
                {decoded?.fullName}
              </Typography>

              <div>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleClose}>โปรไฟล์</MenuItem>
                  <MenuItem onClick={handleClose}>บัญชีของฉัน</MenuItem>
                  <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
                </Menu>
              </div>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
