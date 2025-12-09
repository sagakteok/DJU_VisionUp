'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardActions, Typography, IconButton, Collapse, Button } from "@mui/material";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import styles from "./Estimate.module.scss";

import AvanteSide from "../assets/hyundai/sedan/avante_side.png"
import AvanteNSide from "../assets/hyundai/sedan/avanten_side.png"
import SonataSide from "../assets/hyundai/sedan/sonata_side.png"
import GrandeurSide from "../assets/hyundai/sedan/grandeur_side.png"
import VenueSide from "../assets/hyundai/SUV/venue_side.png"
import KonaSide from "../assets/hyundai/SUV/kona_side.png"
import TucsonSide from "../assets/hyundai/SUV/tucson_side.png"
import SantafeSide from "../assets/hyundai/SUV/santafe_side.png"
import PalisadeSide from "../assets/hyundai/SUV/palisade_side.png"
import StariaSide from "../assets/hyundai/MPV/staria_side.png"
import KonaEVSide from "../assets/hyundai/EV/konaev_side.png"
import NexoSide from "../assets/hyundai/EV/nexo_side.png"
import Ioniq5Side from "../assets/hyundai/EV/Ioniq5_side.png"
import Ioniq5NSide from "../assets/hyundai/EV/Ioniq5n_side.png"
import Ioniq6Side from "../assets/hyundai/EV/Ioniq6_side.png"
import Ioniq9Side from "../assets/hyundai/EV/Ioniq9_side.png"

export default function Estimate() {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const handleToggle = () => setExpanded((prev) => !prev);

    const carData = [
        {
            country: "대한민국",
            brands: [
                {
                    name: "현대자동차",
                    categories: [
                        {
                            name: "세단",
                            cars: [
                                {
                                    name: "Avante",
                                    segment: "준중형 세단",
                                    price: 2034,
                                    displacement: 1598,
                                    efficiency: "15.0 km/l",
                                    image: AvanteSide,
                                },
                                {
                                    name: "Avante N",
                                    segment: "준중형 세단",
                                    price: 3360,
                                    displacement: 1998,
                                    efficiency: "10.6 km/l",
                                    image: AvanteNSide,
                                },
                                {
                                    name: "Sonata",
                                    segment: "중형 세단",
                                    price: 2788,
                                    displacement: 1999,
                                    efficiency: "19.4 km/l",
                                    image: SonataSide,
                                },
                                {
                                    name: "Grandeur",
                                    segment: "준대형 세단",
                                    price: 3798,
                                    displacement: 3478,
                                    efficiency: "18.0 km/l",
                                    image: GrandeurSide,
                                },
                            ],
                        },
                        {
                            name: "SUV",
                            cars: [
                                {
                                    name: "Venue",
                                    segment: "소형 SUV",
                                    price: 1956,
                                    displacement: 1598,
                                    efficiency: "13.7 km/l",
                                    image: VenueSide,
                                },
                                {
                                    name: "Kona",
                                    segment: "소형 SUV",
                                    price: 2446,
                                    displacement: 1999,
                                    efficiency: "19.8 km/l",
                                    image: KonaSide,
                                },
                                {
                                    name: "Tucson",
                                    segment: "준중형 SUV",
                                    price: 2729,
                                    displacement: 1998,
                                    efficiency: "16.2 km/l",
                                    image: TucsonSide,
                                },
                                {
                                    name: "Santa Fe",
                                    segment: "중형 SUV",
                                    price: 3492,
                                    displacement: 2497,
                                    efficiency: "15.5 km/l",
                                    image: SantafeSide,
                                },
                                {
                                    name: "Palisade",
                                    segment: "준대형 SUV",
                                    price: 4383,
                                    displacement: 2497,
                                    efficiency: "14.1 km/l",
                                    image: PalisadeSide,
                                },
                            ],
                        },
                        {
                            name: "MPV",
                            cars: [
                                {
                                    name: "Staria",
                                    segment: "대형 MPV",
                                    price: 2847,
                                    displacement: 3470,
                                    efficiency: "13.0 km/l",
                                    image: StariaSide,
                                },
                            ],
                        },
                        {
                            name: "전기차",
                            cars: [
                                {
                                    name: "Kona Electric",
                                    segment: "소형 SUV",
                                    price: 4152,
                                    displacement: 0,
                                    efficiency: "5.5 km/kWh",
                                    image: KonaEVSide,
                                },
                                {
                                    name: "Nexo",
                                    segment: "준중형 SUV",
                                    price: 7643,
                                    displacement: 0,
                                    efficiency: "107.6 km/kg",
                                    image: NexoSide,
                                },
                                {
                                    name: "Ioniq 5",
                                    segment: "준중형 SUV",
                                    price: 4740,
                                    displacement: 0,
                                    efficiency: "5.2 km/kWh",
                                    image: Ioniq5Side,
                                },
                                {
                                    name: "Ioniq 5 N",
                                    segment: "준중형 SUV",
                                    price: 7700,
                                    displacement: 0,
                                    efficiency: "3.7 km/kWh",
                                    image: Ioniq5NSide,
                                },
                                {
                                    name: "Ioniq 6",
                                    segment: "중형 세단",
                                    price: 4695,
                                    displacement: 0,
                                    efficiency: "3.7 km/kWh",
                                    image: Ioniq6Side,
                                },
                                {
                                    name: "Ioniq 9",
                                    segment: "준대형 SUV",
                                    price: 6715,
                                    displacement: 0,
                                    efficiency: "4.3 km/kWh",
                                    image: Ioniq9Side,
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "KIA",
                    categories: [
                        {
                            name: "세단",
                            cars: [

                            ],
                        },
                        {
                            name: "SUV",
                            cars: [

                            ],
                        },
                        {
                            name: "MPV",
                            cars: [

                            ],
                        },
                        {
                            name: "전기차",
                            cars: [
                                
                            ],
                        },
                    ],
                },
            ],
        },
        {
            country: "독일",
            brands: [
                {
                    name: "BMW",
                    categories: [
                        {
                            name: "세단",
                            cars: [

                            ],
                        },
                        {
                            name: "SUV",
                            cars: [

                            ],
                        },
                        {
                            name: "MPV",
                            cars: [

                            ],
                        },
                        {
                            name: "전기차",
                            cars: [
                                
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const [selectedCategory, setSelectedCategory] = useState("세단");
    const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
    const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);

    const selectedCountry = carData[selectedCountryIndex];
    const selectedBrand = selectedCountry.brands[selectedBrandIndex];
    const carCategories = selectedBrand.categories.map((c) => c.name);
    const selectedCars = selectedBrand.categories.find((c) => c.name === selectedCategory)?.cars || [];

    return (
        <main className={styles.EstimateStyle}>
            <div className={styles.EstimateContainer}>
                <div className={styles.EstimateTopContent}>
                    <div><span className={styles.EstimateTitle}>차종 선택</span></div>
                    <div><span className={styles.EstimateSubTitle}>원하는 브랜드의 차량을 선택해보세요.</span></div>
                </div>
                <div className={styles.EstimateCountryContent}>
                    <div>
                        <span className={styles.EstimateCountryContentTitle}>국가 별</span>
                        <div className={styles.EstimateCountryContentDivideLine}/>
                    </div>
                    {carData.map((country, i) => (
                        <span key={country.country} onClick={() => {setSelectedCountryIndex(i); setSelectedBrandIndex(0);}} className={`${styles.EstimateCountryContentItemText} ${i === selectedCountryIndex ? styles.active : ""}`}>{country.country}</span>
                    ))}
                </div>
                <div className={styles.EstimateMidContent}>
                    <Card className={styles.EstimateCardStyle}>
                        <CardActions disableSpacing>
                            <span className={styles.EstimateCardTitle}>{selectedBrand.name}</span>
                            <IconButton onClick={handleToggle}>
                                <Icon path={expanded ? mdiChevronUp : mdiChevronDown} size={1} />
                            </IconButton>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent style={{height: "400px", overflowY: "auto"}}>
                                <div className={styles.EstimateCardCategoryTabWrapper}>
                                    {carCategories.map((category) => (
                                        <button key={category} className={`${styles.EstimateCardCategoryTabItem} ${selectedCategory === category ? styles.active : ""}`} onClick={() => setSelectedCategory(category)}>{category}</button>
                                    ))}
                                </div>

                                <div className={styles.EstimateCardCarList}>
                                    {selectedCars.length > 0 ? (
                                        selectedCars.map((car, index) => (
                                            <div key={index} className={styles.EstimateCardCarInfoStyle}>
                                                <Image className={styles.EstimateCardCarInfoCarImage} src={car.image} alt={car.name}/>
                                                <div className={styles.EstimateCardCarInfoContainer}>
                                                    <div className={styles.EstimateCardCarInfoTitleContent}>
                                                        <span className={styles.EstimateCardCarInfoCarName}>{car.name}</span>
                                                        <span className={styles.EstimateCardCarInfoCarSegment}>{car.segment}</span>
                                                    </div>
                                                    <span className={styles.EstimateCardCarInfoCarPrice}>{car.price.toLocaleString()}만원 ~</span>
                                                    <span className={styles.EstimateCardCarInfoCarSpec}>배기량: ~ {car.displacement.toLocaleString()}cc</span>
                                                    <span className={styles.EstimateCardCarInfoCarSpec}>연비: ~ {car.efficiency}</span>
                                                </div>
                                                <Button className={styles.EstimateCardCarInfoSelectButton} onClick={() => router.push("/customer/estimate/MatchOptions")}>선택</Button>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography variant="body2" sx={{ mt: 2 }}>선택한 카테고리에 해당하는 차량이 없습니다.</Typography>
                                    )}
                                </div>
                            </CardContent>
                        </Collapse>
                    </Card>
                </div>
            </div>
        </main>
    );
}