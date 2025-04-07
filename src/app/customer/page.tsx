import Icon from "@mdi/react";
import Image from "next/image"
import Link from "next/link";
import palisade from "./assets/palisade.png"
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import '../customer/MainHome.scss';

export default function MainHomeDesktop() {
  return (
      <div className="MainHomeStyle">
        <div className="MainHomeContainer">
          <div className="MainHomeTopContent">
            <div className="MainHomeFirstTitle"><span>최근 나온 신차</span></div>
            <div className="MainHomeSecondTitle"><span>PALISADE</span></div>
            <div className="MainHomeThirdTitle"><span>Hyundai Motors</span></div>
            <div className="MainHomeForthTitle"><span>4,383 만원 부터</span></div>
          </div>
          <div className="MainHomeBottomContent">
            <Link href="https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-palisade/intro" style={{textDecoration: "none"}}>
              <div className="MainHomeCarHrefContainer">
                <span className="MainHomeCarHrefText">차량 상세 보기</span>
                <Icon className="MainHomeCarHrefIcon" path={mdiChevronRight} size={1}/>
              </div>
            </Link>
            <Image className="MainHomeCarImage" src={palisade} alt="팰리세이드" width={1380}/>
            <div className="MainHomePaginationContainer">
              <Icon className="MainHomePaginationLeftIcon" path={mdiChevronLeft} size={1.5}/>
              <span className="MainHomePaginationText">1 / 5</span>
              <Icon className="MainHomePaginationRightIcon" path={mdiChevronRight} size={1.5}/>
            </div>
          </div>
        </div>
      </div>
  );
}