'use client';

import React, { useRef } from "react";
import { Card, CardContent, Button } from "@mui/material";
import Image from "next/image";
import styles from "./result.module.scss";
import AvanteNSide from "../../../assets/hyundai/sedan/avanten_side.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CarItems = [
  {
    brand_name: "현대자동차",
    car_name: "아반떼 N",
    trim_name: "N",
    base_price: 34000000,
    CarExteriorColor: [{ exterior_color_name: "퍼포먼스 블루", exterior_color_price: 0 }],
    CarInteriorColor: [{ interior_color_name: "블랙", interior_color_price: 0 }],
    CarOption: [
      { package_name: "N 현대 스마트 센스 I", option_price: 1290000 },
      { package_name: "N 현대 스마트 센스 II", option_price: 1090000 }
    ]
  }
];

export default function MatchOptionsResultResult() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const car = CarItems[0];

  const totalPrice =
      car.base_price +
      car.CarExteriorColor.reduce((sum, c) => sum + c.exterior_color_price, 0) +
      car.CarInteriorColor.reduce((sum, c) => sum + c.interior_color_price, 0) +
      car.CarOption.reduce((sum, opt) => sum + opt.option_price, 0);

  const formatPrice = (price: number) => price.toLocaleString("ko-KR");

  // 견적 저장 버튼 핸들러
  const handleSave = () => {
    alert("견적이 저장되었습니다.");
  };

  const handlePrint = async () => {
    if (!pdfRef.current) return;


    const textElements = pdfRef.current.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6');
    const originalColors: string[] = [];

    textElements.forEach((el) => {
      const element = el as HTMLElement;
      originalColors.push(element.style.color);
      element.style.color = '#000000';
    });

    try {

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${car.car_name}_최종견적서.pdf`);

    } catch (error) {
      console.error("PDF 저장 실패", error);
      alert("PDF 저장 중 오류가 발생했습니다.");
    } finally {
      // ★ 3. 캡처 후: 원래 색상으로 복구
      textElements.forEach((el, index) => {
        const element = el as HTMLElement;
        element.style.color = originalColors[index];
      });
    }
  };

  return (
      <div className={styles.MatchOptionsResultStyle}>
        <div className={styles.MatchOptionsResultContainer} ref={pdfRef}>

          <div className={styles.MatchOptionsResultTopContent}>
            <span className={styles.MatchOptionsResultMainTitle}>최종 견적</span>
            <span className={styles.MatchOptionsResultSubTitle}>
            고객님이 맞추신 차량의 견적입니다.
          </span>
          </div>

          <div className={styles.MatchOptionsResultMidContent}>
            <div className={styles.MatchOptionsResultLeftImageContainer}>
              <Image
                  src={AvanteNSide}
                  alt="차량이미지"
                  className={styles.MatchOptionsResultCarImage}
                  priority
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

            <Card className={styles.MatchOptionsResultRightCardStyle}>
              <CardContent className={styles.MatchOptionsResultRightCardContainer}>

                <span className={styles.MatchOptionsResultRightCardTitle}>선택한 트림</span>
                <div className={styles.MatchOptionsResultRightCardTitleDivider} />
                <div className={styles.MatchOptionsResultOptionsItemTextWrapper}>
                <span className={styles.MatchOptionsResultOptionsTitle}>
                  {car.trim_name}
                </span>
                </div>
                <div style={{marginTop: '30px'}}/>

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

                <div className={styles.MatchOptionsResultAllPriceTextWrapper}>
                <span className={styles.MatchOptionsResultAllPriceTitle}>
                  총 차량 가격
                </span>
                  <span className={styles.MatchOptionsResultAllPrice}>
                  {formatPrice(totalPrice)} 원
                </span>
                </div>

                <div
                    className={styles.MatchOptionsResultButtonsContainer}
                    data-html2canvas-ignore="true"
                >
                  <Button
                      className={styles.MatchOptionsResultButton}
                      onClick={handleSave}
                  >
                    견적 저장
                  </Button>
                  <Button className={styles.MatchOptionsResultButton} onClick={handlePrint}>
                    견적 인쇄하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}