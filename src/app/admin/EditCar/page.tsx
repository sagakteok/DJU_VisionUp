"use client";

import styles from './EditCar.module.scss';
import Image from "next/image";
import { Card, CardContent, Button, Modal, Box, TextField, IconButton } from "@mui/material";
import Icon from "@mdi/react";
import { mdiPencil, mdiClose } from "@mdi/js";
import { useState } from "react";
import { useRouter } from "next/navigation";

import AvanteNSide from "../assets/avanten_side.png"

const CarItems = [
  {
    brand_country: "대한민국",
    CarBrand: [
      {
        brand_id: 1,
        brand_name: "현대자동차",
        CarModel: [
          {
            id: 1,
            car_name: "아반떼 N",
            car_image: AvanteNSide,
            price: 33600000,
            liter_size: 1998,
            fuel_efficiency: 10.6,
            body_type: "세단",
            CarTrim: [
              {
                trim_id: 1,
                trim_name: "N",
                trim_price: 33600000,
                CarInteriorColor: [
                  {
                    interior_color_name: "블랙",
                    interior_color_hexcode: "#000000",
                    interior_color_price: 0
                  }
                ],
                CarExteriorColor: [
                  {
                    exterior_color_name: "퍼포먼스 블루",
                    exterior_color_hexcode: "#618CC1",
                    exterior_color_price: 0
                  },
                  {
                    exterior_color_name: "블랙",
                    exterior_color_hexcode: "#000000",
                    exterior_color_price: 0
                  },
                  {
                    exterior_color_name: "레드",
                    exterior_color_hexcode: "#620E0D",
                    exterior_color_price: 0
                  }
                ],
                CarOption: [
                  {
                    package_name: "N 현대 스마트 센스 I",
                    option_detail: "스마트 크루즈 컨트롤",
                    option_price: 1290000,
                  },
                  {
                    package_name: "N 현대 스마트 센스 II",
                    option_detail: "스마트 크루즈 컨트롤",
                    option_price: 1090000,
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export default function EditCar() { 
  const router = useRouter();

  const brand = CarItems[0].CarBrand[0];
  const model = brand.CarModel[0];
  const trim = model.CarTrim[0];

  const handleCancel = () => {
    const confirmResult = confirm("취소하시겠습니까? 작업은 되돌릴 수 없습니다.");
    if (confirmResult) {
      router.push("/admin");
    }
  };

  return (
    <div className={styles.EditCarStyle}>
      <div className={styles.EditCarContainer}>
        <div className={styles.EditCarContent}>
          <Card className={styles.EditCarCardStyle}>
            <CardContent style={{ height: '100%', overflowY: 'auto' }}>
              <div>
                <div className={styles.EditCarCardTitlesContainer}>
                  <span className={styles.EditCarCardMainTitle}>수정하기: {brand.CarModel[0].car_name}</span>
                  <span className={styles.EditCarCardSubTitle}>{brand.brand_name}</span>
                </div>
                <div className={styles.EditCarCardInfoContainer}>
                  <div className={styles.EditCarCardInfoImageContainer}>
                    <Image src={model.car_image} alt={model.car_name} className={styles.EditCarCardInfoImage}/>
                    <Button className={styles.EditCarCardInfoImageChangeButton}>변경하기</Button>
                  </div>
                  <div className={styles.EditCarCardInfoDetailsContainer}>
                    <span className={styles.EditCarCardInfoTitle}>차량 기본 정보</span>
                    <div className={styles.EditCarCardInfoDetailsTextWrapper}>
                      <span className={styles.EditCarCardInfoDetailsTitle}>차량 이름: </span>
                      <span className={styles.EditCarCardInfoDetailsItem}>{model.car_name}</span>
                      <IconButton className={styles.EditCarInfoDetailsEditButton}>
                        <Icon path={mdiPencil} size={0.7}/>
                      </IconButton>
                    </div>
                    <div className={styles.EditCarCardInfoDetailsTextWrapper}>
                      <span className={styles.EditCarCardInfoDetailsTitle}>시작 가격: </span>
                      <span className={styles.EditCarCardInfoDetailsItem}>{Math.floor(model.price / 10000)} 만원</span>
                      <IconButton className={styles.EditCarInfoDetailsEditButton}>
                        <Icon path={mdiPencil} size={0.7}/>
                      </IconButton>
                    </div>
                    <div className={styles.EditCarCardInfoDetailsTextWrapper}>
                      <span className={styles.EditCarCardInfoDetailsTitle}>최대 배기량: </span>
                      <span className={styles.EditCarCardInfoDetailsItem}>{model.liter_size.toLocaleString()} cc</span>
                      <IconButton className={styles.EditCarInfoDetailsEditButton}>
                        <Icon path={mdiPencil} size={0.7}/>
                      </IconButton>
                    </div>
                    <div className={styles.EditCarCardInfoDetailsTextWrapper}>
                      <span className={styles.EditCarCardInfoDetailsTitle}>최대 연비: </span>
                      <span className={styles.EditCarCardInfoDetailsItem}>{model.fuel_efficiency} km/l</span>
                      <IconButton className={styles.EditCarInfoDetailsEditButton}>
                        <Icon path={mdiPencil} size={0.7}/>
                      </IconButton>
                    </div>
                    <div className={styles.EditCarCardInfoDetailsTextWrapper}>
                      <span className={styles.EditCarCardInfoDetailsTitle}>바디 타입: </span>
                      <span className={styles.EditCarCardInfoDetailsItem}>{model.body_type ?? "세단"}</span>
                      <IconButton className={styles.EditCarInfoDetailsEditButton}>
                        <Icon path={mdiPencil} size={0.7}/>
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className={styles.EditCarCardDividerContainer}>
                  <div className={styles.EditCarCardDividerContentsContainer}>
                    <span className={styles.EditCarCardDividerTitle}>트림 목록</span>
                    <div className={styles.EditCarTrimActionGroup}>
                      <span className={styles.EditCarTrimActionButton} onClick={() => console.log("생성 클릭")}>생성하기</span>
                      <span className={styles.EditCarTrimActionButton} onClick={() => console.log("수정 클릭")}>수정하기</span>
                      <span className={styles.EditCarTrimActionButton} onClick={() => console.log("삭제 클릭")}>삭제하기</span>
                    </div>
                  </div>
                  <div className={styles.EditCarCardDivider}/>
                </div>
                <div className={styles.EditCarCardTrimList}>
                  {model.CarTrim.map((trim) => (
                    <div key={trim.trim_id} className={styles.EditCarCardTrimContent}>
                      <span className={styles.EditCarCardTrimName}>{trim.trim_name}</span>
                      <div className={styles.EditCarCardTrimPriceContainer}>
                        <span className={styles.EditCarCardTrimPriceTitle}>기본 가격: </span>
                        <span className={styles.EditCarCardTrimPrice}>{Math.floor(trim.trim_price / 10000)} 만원</span>
                      </div>
                      <span className={styles.EditCarCardTrimOptionsTitle}>외장 색상</span>
                      <div className={styles.EditCarCardTrimColorsList}>
                        <div className={styles.EditCarCardTrimColorsItemsList}>
                          {trim.CarExteriorColor.map((color, idx) => (
                            <div key={idx} className={styles.EditCarCardTrimColorsContent}>
                              <div className={styles.EditCarCardTrimColorsInnerContainer}>
                                <div className={styles.EditCarCardTrimColor} style={{ backgroundColor: color.exterior_color_hexcode }}/>
                                <div className={styles.EditCarCardTrimColorsTitleWrapper}>
                                  <span className={styles.EditCarCardTrimColorsMainTitle}>{color.exterior_color_name}</span>
                                  <div className={styles.EditCarCardTrimColorsPriceContainer}>
                                    <span className={styles.EditCarCardTrimColorsPriceTitle}>색상 가격:</span>
                                    <span className={styles.EditCarCardTrimColorsPrice}> {color.exterior_color_price.toLocaleString()}원</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={styles.EditCarCardTrimOptionsButtonWrapper}>
                          <Button className={styles.EditCarCardTrimOptionsButton}>생성하기</Button>
                          <Button className={styles.EditCarCardTrimOptionsButton}>수정하기</Button>
                          <Button className={styles.EditCarCardTrimOptionsButton}>삭제하기</Button>
                        </div>
                      </div>
                      <span className={styles.EditCarCardTrimOptionsTitle}>실내 색상</span>
                      <div className={styles.EditCarCardTrimColorsList}>
                        <div className={styles.EditCarCardTrimColorsItemsList}>
                          {trim.CarInteriorColor.map((color, idx) => (
                            <div key={idx} className={styles.EditCarCardTrimColorsContent}>
                              <div className={styles.EditCarCardTrimColorsInnerContainer}>
                                <div className={styles.EditCarCardTrimColor} style={{ backgroundColor: color.interior_color_hexcode }}/>
                                <div className={styles.EditCarCardTrimColorsTitleWrapper}>
                                  <span className={styles.EditCarCardTrimColorsMainTitle}>{color.interior_color_name}</span>
                                  <div className={styles.EditCarCardTrimColorsPriceContainer}>
                                    <span className={styles.EditCarCardTrimColorsPriceTitle}>색상 가격:</span>
                                    <span className={styles.EditCarCardTrimColorsPrice}> {color.interior_color_price.toLocaleString()}원</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={styles.EditCarCardTrimOptionsButtonWrapper}>
                          <Button className={styles.EditCarCardTrimOptionsButton}>생성하기</Button>
                          <Button className={styles.EditCarCardTrimOptionsButton}>수정하기</Button>
                          <Button className={styles.EditCarCardTrimOptionsButton}>삭제하기</Button>
                        </div>
                      </div>
                      <span className={styles.EditCarCardTrimOptionsTitle}>선택 옵션 구성</span>
                      <div className={styles.EditCarCardTrimOptionsList}>
                        {trim.CarOption.map((option, index) => (
                          <div key={index} className={styles.EditCarCardTrimOptionsContent}>
                            <span className={styles.EditCarCardOptionItemMainTitle}>{option.package_name}</span>
                            <div className={styles.EditCarCardOptionItemPriceContainer}>
                              <span className={styles.EditCarCardOptionItemPriceTitle}>옵션 가격: </span>
                              <span className={styles.EditCarCardOptionItemPrice}>{Math.floor(option.option_price / 10000)} 만원</span>
                            </div>
                            <span className={styles.EditCarCardOptionItemSubTitle}>옵션 내 품목</span>
                            <span className={styles.EditCarCardOptionItemDetails}>{option.option_detail}</span>
                          </div>
                        ))}
                        <div className={styles.EditCarCardTrimOptionsButtonWrapper}>
                          <Button className={styles.EditCarCardTrimOptionsButton}>생성하기</Button>
                          <Button className={styles.EditCarCardTrimOptionsButton}>수정하기</Button>
                          <Button className={styles.EditCarCardTrimOptionsButton}>삭제하기</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.EditCarBottomButtonWrapper}>
                  <Button className={styles.EditCarBottomCancelButton} onClick={handleCancel}>취소하기</Button>
                  <Button className={styles.EditCarBottomSubmitButton}>저장하기</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}