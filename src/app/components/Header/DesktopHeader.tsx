'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiMagnify, mdiAccountCircle } from "@mdi/js";
import headerlogo from "../../assets/headerlogo.png";
import "./Header.scss";

export default function DesktopHeader() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "fixed",
        zIndex: 4,
        backgroundColor: "#1B1C1E",
        width: "100vw",
        height: "60px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "1100px",
          margin: "auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <Image
            src={headerlogo}
            alt="Logo"
            style={{ width: "90px", marginLeft: "30px" }}
          />
        </Link>
        <Link
          href="/AllDocuments"
          className={`desktop-header_text ${pathname === "/AllDocuments" ? "active" : ""}`}
        >
          서류 모아보기
        </Link>
        <Link
          href="/Businesses"
          className={`desktop-header_text ${pathname === "/Businesses" ? "active" : ""}`}
        >
          업무 처리
        </Link>
        <Link
          href="/TownCommunity"
          className={`desktop-header_text ${pathname === "/TownCommunity" ? "active" : ""}`}
        >
          동네 소식
        </Link>
        <Link
          href="/MyDocuments"
          className={`desktop-header_text ${pathname === "/MyDocuments" ? "active" : ""}`}
        >
          나의 서류
        </Link>
        <div style={{ marginLeft: "auto" }}>
          <Link href="/">
            <Icon
              path={mdiMagnify}
              size={1}
              className={`desktop-header_icon ${pathname === "/" ? "active" : ""}`}
            />
          </Link>
          <Link href="/">
            <Icon
              path={mdiAccountCircle}
              size={1}
              className={`desktop-header_icon ${pathname === "/" ? "active" : ""}`}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
