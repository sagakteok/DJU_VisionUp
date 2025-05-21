import Icon from "@mdi/react";
import Image from "next/image";
import Link from "next/link";
import palisade from "./assets/palisade.png";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import styles from "./MainHome.module.scss"; // SCSS 모듈로 변경

export default function MainHomeDesktop() {
  return (
    <div className={styles.MainHomeStyle}>
      <div className={styles.MainHomeContainer}>
        <div className={styles.MainHomeTopContent}>
          <div className={styles.MainHomeFirstTitle}><span>최근 나온 신차</span></div>
          <div className={styles.MainHomeSecondTitle}><span>PALISADE</span></div>
          <div className={styles.MainHomeThirdTitle}><span>Hyundai Motors</span></div>
          <div className={styles.MainHomeForthTitle}><span>4,383 만원 부터</span></div>
        </div>
        <div className={styles.MainHomeBottomContent}>
          <Link href="https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-palisade/intro" style={{ textDecoration: "none" }}>
            <div className={styles.MainHomeCarHrefContainer}>
              <span className={styles.MainHomeCarHrefText}>차량 상세 보기</span>
              <Icon className={styles.MainHomeCarHrefIcon} path={mdiChevronRight} size={1} />
            </div>
          </Link>
          <Image className={styles.MainHomeCarImage} src={palisade} alt="팰리세이드" width={1380}/>
          <div className={styles.MainHomePaginationContainer}>
            <Icon className={styles.MainHomePaginationLeftIcon} path={mdiChevronLeft} size={1.5} />
            <span className={styles.MainHomePaginationText}>1 / 5</span>
            <Icon className={styles.MainHomePaginationRightIcon} path={mdiChevronRight} size={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}