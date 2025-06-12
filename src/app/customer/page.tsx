'use client';

import React, { useEffect, useRef, useState } from "react";
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

const carData = [
  { name: "PALISADE", brand: "Hyundai Motors", price: 4383, link: "https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-palisade/intro", image: palisade },
  { name: "NEXO", brand: "Hyundai Motors", price: 7644, link: "https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-nexo/intro", image: nexo },
  { name: "IONIQ 9", brand: "Hyundai Motors", price: 6715, link: "https://www.hyundai.com/kr/ko/e/vehicles/ioniq9/intro", image: ioniq9 },
  { name: "GRANDEUR", brand: "Hyundai Motors", price: 3798, link: "https://www.hyundai.com/kr/ko/e/vehicles/grandeur/intro", image: grandeur },
  { name: "KONA", brand: "Hyundai Motors", price: 2446, link: "https://www.hyundai.com/kr/ko/e/vehicles/kona/intro", image: kona },
];

export default function MainHomeDesktop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = carData.length - 1;
  const [animationDirection, setAnimationDirection] = useState<"right" | "left">("right");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setAnimationDirection("right");
      setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }, 10000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  const handlePrev = () => {
    setAnimationDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    resetAutoSlide();
  };

  const handleNext = () => {
    setAnimationDirection("right");
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    resetAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const currentCar = carData[currentIndex];
  const keyForImage = `${currentIndex}-${animationDirection}`;

  return (
    <div className={styles.MainHomeStyle}>
      <div className={styles.MainHomeContainer}>
        <div className={styles.MainHomeTopContent}>
          <div className={styles.MainHomeFirstTitle}>
            <span>최근 나온 신차</span>
          </div>
          <div className={styles.MainHomeSecondTitle}>
            <span>{currentCar.name}</span>
          </div>
          <div className={styles.MainHomeThirdTitle}>
            <span>{currentCar.brand}</span>
          </div>
          <div className={styles.MainHomeForthTitle}>
            <span>{currentCar.price.toLocaleString()} 만원 부터</span>
          </div>
        </div>

        <div className={styles.MainHomeBottomContent}>
          <Link href={currentCar.link} style={{ textDecoration: "none" }}>
            <div className={styles.MainHomeCarHrefContainer}>
              <span className={styles.MainHomeCarHrefText}>차량 상세 보기</span>
              <Icon className={styles.MainHomeCarHrefIcon} path={mdiChevronRight} size={1}/>
            </div>
          </Link>
          <Image key={keyForImage} className={animationDirection === "right"? styles.MainHomeCarImageAnimateFromRight : styles.MainHomeCarImageAnimateFromLeft} src={currentCar.image} alt={currentCar.name} width={1380}/>
          <div className={styles.MainHomePaginationContainer}>
            <div onClick={handlePrev} style={{ cursor: "pointer" }}>
              <Icon className={styles.MainHomePaginationLeftIcon} path={mdiChevronLeft} size={1.5}/>
            </div>
            <span className={styles.MainHomePaginationText}>
              {currentIndex + 1} / {carData.length}
            </span>
            <div onClick={handleNext} style={{ cursor: "pointer" }}>
              <Icon className={styles.MainHomePaginationRightIcon} path={mdiChevronRight} size={1.5}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}