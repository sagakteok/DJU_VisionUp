'use client';

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, Button} from "@mui/material";
import Image from "next/image";
import styles from "./MatchOptions.module.scss";

import AvanteNSide from "../../assets/hyundai/sedan/avanten_side.png";

interface ExteriorColor {
    exterior_color_name: string;
    exterior_color_hexcode: string;
    exterior_color_price: number;
}

interface InteriorColor {
    interior_color_name: string;
    interior_color_hexcode: string;
    interior_color_price: number;
}

interface CarOption {
    package_name: string;
    option_detail: string;
    option_price: number;
}

interface CarTrim {
    trim_id: number;
    trim_name: string;
    trim_price: number;
    CarInteriorColor: InteriorColor[];
    CarExteriorColor: ExteriorColor[];
    CarOption: CarOption[];
}

interface CarModel {
    id: number;
    car_name: string;
    car_image: any;
    price: number;
    liter_size: number;
    fuel_efficiency: number;
    body_type: string;
    CarTrim: CarTrim[];
}

interface CarBrand {
    brand_id: number;
    brand_name: string;
    CarModel: CarModel[];
}

interface CarItem {
    brand_country: string;
    CarBrand: CarBrand[];
}

const CarItems: CarItem[] = [
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

export default function MatchOptions() {
    const router = useRouter(); // 2. 라우터 훅 사용
    const model: CarModel = CarItems[0].CarBrand[0].CarModel[0];

    const [selectedTrim, setSelectedTrim] = useState<CarTrim>(model.CarTrim[0]);
    const [selectedExteriorColor, setSelectedExteriorColor] = useState<ExteriorColor>(selectedTrim.CarExteriorColor[0]);
    const [selectedInteriorColor, setSelectedInteriorColor] = useState<InteriorColor>(selectedTrim.CarInteriorColor[0]);
    const [selectedOptions, setSelectedOptions] = useState<CarOption[]>([]);

    const handleOptionToggle = (option: CarOption) => {
        const exists = selectedOptions.includes(option);

        if (exists) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const totalPrice =
        selectedTrim.trim_price +
        selectedExteriorColor.exterior_color_price +
        selectedInteriorColor.interior_color_price +
        selectedOptions.reduce((sum, opt) => sum + opt.option_price, 0);

    // 완성하기 버튼 클릭 핸들러
    const handleComplete = () => {

        router.push("/customer/estimate/MatchOptions/result");
    };

    return (
        <div className={styles.MatchOptionsStyle}>
            <div className={styles.MatchOptionsContainer}>
                <div className={styles.MatchOptionsTopContent}>
                    <span className={styles.MatchOptionsMainTitle}>옵션 맞추기</span>
                    <span className={styles.MatchOptionsSubTitle}>차량의 트림과 옵션을 선택해보세요.</span>
                </div>

                <div className={styles.MatchOptionsMidContent}>

                    <div className={styles.MatchOptionsLeftImageContainer}>
                        <Image src={model.car_image} alt={model.car_name} className={styles.MatchOptionsCarImage}/>
                        <div className={styles.MatchOptionsCarTitleWrapper}>
              <span className={styles.MatchOptionsCarTitle}>
                {model.car_name} - {selectedTrim.trim_name}
              </span>
                            <span className={styles.MatchOptionsCarSubTitle}>
                총 차량 가격: {totalPrice.toLocaleString()}원
              </span>
                        </div>
                    </div>
                    <Card className={styles.MatchOptionsRightCardStyle}>
                        <CardContent className={styles.MatchOptionsRightCardContainer}>

                            <span className={styles.MatchOptionsRightCardTitle}>트림</span>
                            <div className={styles.MatchOptionsTrimSelectContent}>
                                {model.CarTrim.map((trim) => (
                                    <button
                                        key={trim.trim_id}
                                        className={`${styles.MatchOptionsTrimSelectButton} ${
                                            selectedTrim.trim_id === trim.trim_id ? styles.active : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedTrim(trim);
                                            setSelectedExteriorColor(trim.CarExteriorColor[0]);
                                            setSelectedInteriorColor(trim.CarInteriorColor[0]);
                                            setSelectedOptions([]);
                                        }}
                                    >
                                        {trim.trim_name}
                                    </button>
                                ))}
                            </div>

                            <span className={styles.MatchOptionsRightCardTitle}>외장 색상</span>
                            <div className={styles.MatchOptionsTrimColorsList}>
                                <div className={styles.MatchOptionsTrimColorsItemsList}>
                                    {selectedTrim.CarExteriorColor.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className={`${styles.MatchOptionsTrimColorsContent} ${
                                                selectedExteriorColor === color ? styles.active : ""
                                            }`}
                                            onClick={() => setSelectedExteriorColor(color)}
                                        >
                                            <div className={styles.MatchOptionsTrimColorsInnerContainer}>
                                                <div
                                                    className={styles.MatchOptionsTrimColor}
                                                    style={{backgroundColor: color.exterior_color_hexcode}}
                                                />
                                                <div className={styles.MatchOptionsTrimColorsTitleWrapper}>
                          <span className={styles.MatchOptionsTrimColorsMainTitle}>
                            {color.exterior_color_name}
                          </span>
                                                    <div className={styles.MatchOptionsTrimColorsPriceContainer}>
                            <span className={styles.MatchOptionsTrimColorsPrice}>
                              + {color.exterior_color_price.toLocaleString()}원
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className={styles.MatchOptionsRightCardTitle}>내장 색상</span>
                            <div className={styles.MatchOptionsTrimColorsList}>
                                <div className={styles.MatchOptionsTrimColorsItemsList}>
                                    {selectedTrim.CarInteriorColor.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className={`${styles.MatchOptionsTrimColorsContent} ${
                                                selectedInteriorColor === color ? styles.active : ""
                                            }`}
                                            onClick={() => setSelectedInteriorColor(color)}
                                        >
                                            <div className={styles.MatchOptionsTrimColorsInnerContainer}>
                                                <div
                                                    className={styles.MatchOptionsTrimColor}
                                                    style={{backgroundColor: color.interior_color_hexcode}}
                                                />
                                                <div className={styles.MatchOptionsTrimColorsTitleWrapper}>
                          <span className={styles.MatchOptionsTrimColorsMainTitle}>
                            {color.interior_color_name}
                          </span>
                                                    <div className={styles.MatchOptionsTrimColorsPriceContainer}>
                            <span className={styles.MatchOptionsTrimColorsPrice}>
                              + {color.interior_color_price.toLocaleString()}원
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <span className={styles.MatchOptionsRightCardTitle}>옵션</span>
                            <div className={styles.MatchOptionsTrimOptionsList}>
                                {selectedTrim.CarOption.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.MatchOptionsTrimOptionsContent} ${
                                            selectedOptions.includes(option) ? styles.active : ""
                                        }`}
                                        onClick={() => handleOptionToggle(option)}
                                    >
                                        <span
                                            className={styles.MatchOptionsOptionItemMainTitle}>{option.package_name}</span>
                                        <span className={styles.MatchOptionsOptionItemPrice}>
                      + {(option.option_price).toLocaleString()}원
                    </span>
                                        <span className={styles.MatchOptionsOptionItemSubTitle}>옵션 내 품목</span>
                                        <span
                                            className={styles.MatchOptionsOptionItemDetails}>{option.option_detail}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.MatchOptionsRightCardButtonWrapper}>
                                <Button
                                    className={styles.MatchOptionsRightCardSubmitButton}
                                    onClick={handleComplete}
                                >
                                    완성하기
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}