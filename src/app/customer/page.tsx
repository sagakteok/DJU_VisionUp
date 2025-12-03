"use client";

import React, { useState } from "react";
import Icon from "@mdi/react";
import Image from "next/image";
import Link from "next/link";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import styles from "./MainHome.module.scss";

import palisade from "./assets/hyundai/SUV/palisade.png";
import nexo from "./assets/hyundai/EV/nexo.png";
import ioniq9 from "./assets/hyundai/EV/ioniq9.png";
import grandeur from "./assets/hyundai/sedan/grandeur.png";
import kona from "./assets/hyundai/SUV/kona.png";

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
    name: "NEXO",
    company: "Hyundai Motors",
    price: "7,644 만원 부터",
    image: nexo,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-nexo/intro",
    alt: "넥쏘",
  },
  {
    name: "IONIQ 9",
    company: "Hyundai Motors",
    price: "6,715 만원 부터",
    image: ioniq9,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/ioniq9/intro",
    alt: "아이오닉 9",
  },
  {
    name: "GRANDEUR",
    company: "Hyundai Motors",
    price: "3,798 만원 부터",
    image: grandeur,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/grandeur/intro",
    alt: "그랜저",
  },
  {
    name: "KONA",
    company: "Hyundai Motors",
    price: "2,446 만원 부터",
    image: kona,
    link: "https://www.hyundai.com/kr/ko/e/vehicles/kona/intro",
    alt: "코나",
  },
];

export default function MainHomeDesktop() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? cars.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
  };

  const car = cars[current];

  return (
      <div className={styles.MainHomeStyle}>
        <div className={styles.MainHomeContainer}>
          <div className={styles.MainHomeTopContent}>
            <div className={styles.MainHomeFirstTitle}>
              <span>최근 나온 신차</span>
            </div>
            <div className={styles.MainHomeSecondTitle}>
              <span>{car.name}</span>
            </div>
            <div className={styles.MainHomeThirdTitle}>
              <span>{car.company}</span>
            </div>
            <div className={styles.MainHomeForthTitle}>
              <span>{car.price}</span>
            </div>
          </div>

          <div className={styles.MainHomeBottomContent}>
            <Link
                href={car.link}
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
            >
              <div className={styles.MainHomeCarHrefContainer}>
                <span className={styles.MainHomeCarHrefText}>차량 상세 보기</span>
                <Icon className={styles.MainHomeCarHrefIcon} path={mdiChevronRight} size={1} />
              </div>
            </Link>

            <Image
                className={styles.MainHomeCarImage}
                src={car.image}
                alt={car.alt}
                width={1380}
                priority={true}
            />

            <div className={styles.MainHomePaginationContainer}>
              <div
                  className={styles.MainHomePaginationLeftIcon}
                  onClick={handlePrev}
                  style={{ display: "inline-flex", cursor: "pointer" }}
              >
                <Icon path={mdiChevronLeft} size={1.5} />
              </div>

              <span className={styles.MainHomePaginationText}>
              {current + 1} / {cars.length}
            </span>

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