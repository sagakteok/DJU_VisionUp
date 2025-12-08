'use client';

import React from "react";
import { Card, CardContent, Button } from "@mui/material";
import Image from "next/image";
import styles from "./result.module.scss";
import AvanteNSide from "../../../assets/hyundai/sedan/avanten_side.png";

// ◆ 더미 데이터
const CarItems = [
  {
    brand_name: "현대자동차",
    car_name: "아반떼 N",
    trim_name: "N",
    base_price: 34000000,
    
    CarExteriorColor: [
      {
        exterior_color_name: "퍼포먼스 블루",
        exterior_color_price: 0
      }
    ],
    CarInteriorColor: [
      {
        interior_color_name: "블랙",
        interior_color_price: 0
      }
    ],
    CarOption: [
      {
        package_name: "N 현대 스마트 센스 I",
        option_price: 1290000
      },
      {
        package_name: "N 현대 스마트 센스 II",
        option_price: 1090000
      }
    ]
  }
];

export default function MatchOptionsResultResult() {
  const car = CarItems[0];

  // 총 가격 계산
  const totalPrice =
    car.base_price +
    car.CarExteriorColor.reduce((sum, c) => sum + c.exterior_color_price, 0) +
    car.CarInteriorColor.reduce((sum, c) => sum + c.interior_color_price, 0) +
    car.CarOption.reduce((sum, opt) => sum + opt.option_price, 0);

  // 숫자 포맷 (#,###)
  const formatPrice = (price: number) =>
    price.toLocaleString("ko-KR");

  return (
    <div className={styles.MatchOptionsResultStyle}>
      <div className={styles.MatchOptionsResultContainer}>

        {/* 제목 */}
        <div className={styles.MatchOptionsResultTopContent}>
          <span className={styles.MatchOptionsResultMainTitle}>최종 견적</span>
          <span className={styles.MatchOptionsResultSubTitle}>
            고객님이 맞추신 차량의 견적입니다.
          </span>
        </div>

        <div className={styles.MatchOptionsResultMidContent}>
          {/* LEFT - 차량 이미지 & 기본 정보 */}
          <div className={styles.MatchOptionsResultLeftImageContainer}>
            <Image
              src={AvanteNSide}
              alt="차량이미지"
              className={styles.MatchOptionsResultCarImage}
            />
            <div className={styles.MatchOptionsResultCarTitleWrapper}>
              <span className={styles.MatchOptionsResultCarMainTitle}>
                {car.car_name}
              </span>
              <span className={styles.MatchOptionsResultCarSubTitle}>
                {car.brand_name}
              </span>
            </div>
          </div>

          {/* RIGHT 카드 */}
          <Card className={styles.MatchOptionsResultRightCardStyle}>
            <CardContent className={styles.MatchOptionsResultRightCardContainer}>
              
              {/* 트림 */}
              <span className={styles.MatchOptionsResultRightCardTitle}>선택한 트림</span>
              <div className={styles.MatchOptionsResultRightCardTitleDivider} />
              <div className={styles.MatchOptionsResultOptionsItemTextWrapper}>
                <span className={styles.MatchOptionsResultOptionsTitle}>
                  {car.trim_name}
                </span>
              </div>
              <div style={{marginTop: '30px'}}/>

              {/* 외장 색상 */}
              <span className={styles.MatchOptionsResultRightCardTitle}>선택한 색상</span>
              <div className={styles.MatchOptionsResultRightCardTitleDivider} />

              {car.CarExteriorColor.map((item, index) => (
                <div key={index} className={styles.MatchOptionsResultOptionsItemTextWrapper}>
                  <span className={styles.MatchOptionsResultOptionsTitle}>
                    실외 - {item.exterior_color_name}
                  </span>
                  <span className={styles.MatchOptionsResultOptionsPrice}>
                    {formatPrice(item.exterior_color_price)} 원
                  </span>
                </div>
              ))}

              {/* 내장 색상 */}
              {car.CarInteriorColor.map((item, index) => (
                <div key={index} className={styles.MatchOptionsResultOptionsItemTextWrapper}>
                  <span className={styles.MatchOptionsResultOptionsTitle}>
                    실내 - {item.interior_color_name}
                  </span>
                  <span className={styles.MatchOptionsResultOptionsPrice}>
                    {formatPrice(item.interior_color_price)} 원
                  </span>
                </div>
              ))}
              <div style={{marginTop: '30px'}}/>

              {/* 옵션 */}
              <span className={styles.MatchOptionsResultRightCardTitle}>선택한 옵션</span>
              <div className={styles.MatchOptionsResultRightCardTitleDivider} />

              {car.CarOption.map((opt, index) => (
                <div key={index} className={styles.MatchOptionsResultOptionsItemTextWrapper}>
                  <span className={styles.MatchOptionsResultOptionsTitle}>
                    {opt.package_name}
                  </span>
                  <span className={styles.MatchOptionsResultOptionsPrice}>
                    {formatPrice(opt.option_price)} 원
                  </span>
                </div>
              ))}
              <div style={{marginTop: '30px'}}/>

              {/* 총 가격 */}
              <div className={styles.MatchOptionsResultAllPriceTextWrapper}>
                <span className={styles.MatchOptionsResultAllPriceTitle}>
                  총 차량 가격
                </span>
                <span className={styles.MatchOptionsResultAllPrice}>
                  {formatPrice(totalPrice)} 원
                </span>
              </div>

              {/* 버튼 */}
              <div className={styles.MatchOptionsResultButtonsContainer}>
                <Button className={styles.MatchOptionsResultButton}>견적 저장</Button>
                <Button className={styles.MatchOptionsResultButton}>견적 인쇄하기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}