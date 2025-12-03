"use client";

import React, { useState } from "react";
import Icon from "@mdi/react";
import Image from "next/image";
import Link from "next/link";
import palisade from "./assets/palisade.png";
import avante from "./assets/avante.png";
import grandeul from "./assets/grandeul.png";
import ioniq5 from "./assets/ioniq5.png";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import styles from "./MainHome.module.scss";

const cars = [
  {
    name: "PALISADE",
    company: "Hyundai Motors",
    price: "4,383 만원 부터",
    image: palisade,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-palisade/intro",
    alt: "팰리세이드",
  },
  {
    name: "AVANTE",
    company: "Hyundai Motors",
    price: "1,575 만원 부터",
    image: avante,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/avante/intro",
    alt: "아반떼",
  },
  {
    name: "GRANDEUR",
    company: "Hyundai Motors",
    price: "3,716 만원 부터",
    image: grandeul,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-grandeur/intro",
    alt: "그랜저",
  },
  {
    name: "IONIQ 5",
    company: "Hyundai Motors",
    price: "5,230 만원 부터",
    image: ioniq5,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/ioniq5/intro",
    alt: "아이오닉5",
  },
];

export default function MainHomeDesktop() {
  const [current, setCurrent] = useState(0);

  // 왼쪽(이전) 페이지
  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? cars.length - 1 : prev - 1));
  };

  // 오른쪽(다음) 페이지
  const handleNext = () => {
    setCurrent((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
  };

  const car = cars[current];

  return (
      <div className={styles.MainHomeStyle}>
        <div className={styles.MainHomeContainer}>
          <div className={styles.MainHomeTopContent}>
            <div className={styles.MainHomeFirstTitle}><span>최근 나온 신차</span></div>
            <div className={styles.MainHomeSecondTitle}><span>{car.name}</span></div>
            <div className={styles.MainHomeThirdTitle}><span>{car.company}</span></div>
            <div className={styles.MainHomeForthTitle}><span>{car.price}</span></div>
          </div>
          <div className={styles.MainHomeBottomContent}>
            <Link href={car.link} style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
              <div className={styles.MainHomeCarHrefContainer}>
                <span className={styles.MainHomeCarHrefText}>차량 상세 보기</span>
                <Icon className={styles.MainHomeCarHrefIcon} path={mdiChevronRight} size={1} />
              </div>
            </Link>
            <Image className={styles.MainHomeCarImage} src={car.image} alt={car.alt} width={1380} />
            <div className={styles.MainHomePaginationContainer}>
              <div
                  className={styles.MainHomePaginationLeftIcon}
                  onClick={handlePrev}
                  style={{ display: "inline-flex", cursor: "pointer" }}
              >
                <Icon path={mdiChevronLeft} size={1.5} />
              </div>
              <span className={styles.MainHomePaginationText}>{current + 1} / {cars.length}</span>
              <div
                  className={styles.MainHomePaginationRightIcon}
                  onClick={handleNext}
                  style={{ display: "inline-flex", cursor: "pointer" }}
              >
                <Icon path={mdiChevronRight} size={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
