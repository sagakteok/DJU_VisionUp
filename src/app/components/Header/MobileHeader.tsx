'use client';

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiMagnify, mdiAccountCircle, mdiMenu } from "@mdi/js";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
} from "@mui/material";
import headerlogo from "../../assets/headerlogo.png";
import "./Header.scss";

export default function MobileHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#1B1C1E",
          boxShadow: "none",
          height: "60px",
          zIndex: 4,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "60px",
          }}
        >
          <Link href="/">
            <Image src={headerlogo} alt="Logo" style={{ width: "90px" }} />
          </Link>
          <div>
            <IconButton
              disableTouchRipple
              component={Link}
              href="/"
              className={`mobile-header_icon ${pathname === "/" ? "active" : ""}`}
            >
              <Icon path={mdiAccountCircle} size={1} />
            </IconButton>
            <IconButton
              onClick={() => toggleDrawer(!isDrawerOpen)}
              className={`mobile-header_icon ${isDrawerOpen ? "active" : ""}`}
            >
              <Icon path={mdiMenu} size={1} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="top"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{ style: { boxShadow: "none", top: "60px" } }}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            style: { backgroundColor: "transparent" },
          },
        }}
        sx={{ position: "relative", zIndex: "3" }}
      >
        <List
          sx={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #F8F8F8",
          }}
        >
          <ListItemButton
            disableTouchRipple
            component={Link}
            href="/AllDocuments"
            onClick={() => toggleDrawer(false)}
            selected={pathname === "/AllDocuments"}
            sx={{ height: "55px" }}
          >
            <p className={`mobile-header_text ${pathname === "/AllDocuments" ? "active" : ""}`}>서류 모아보기</p>
          </ListItemButton>
          <ListItemButton
            disableTouchRipple
            component={Link}
            href="/Businesses"
            onClick={() => toggleDrawer(false)}
            selected={pathname === "/Businesses"}
            sx={{ height: "55px" }}
          >
            <p className={`mobile-header_text ${pathname === "/Businesses" ? "active" : ""}`}>업무 처리</p>
          </ListItemButton>
          <ListItemButton
            disableTouchRipple
            component={Link}
            href="/TownCommunity"
            onClick={() => toggleDrawer(false)}
            selected={pathname === "/TownCommunity"}
            sx={{ height: "55px" }}
          >
            <p className={`mobile-header_text ${pathname === "/TownCommunity" ? "active" : ""}`}>동네 소식</p>
          </ListItemButton>
          <ListItemButton
            disableTouchRipple
            component={Link}
            href="/MyDocuments"
            onClick={() => toggleDrawer(false)}
            selected={pathname === "/MyDocuments"}
            sx={{ height: "55px" }}
          >
            <p className={`mobile-header_text ${pathname === "/MyDocuments" ? "active" : ""}`}>나의 서류</p>
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}