'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import styles from "../estimate/Estimate.module.scss";

import AvanteNImg from "../assets/hyundai/sedan/avanten_side.png";
import SonataImg from "../assets/hyundai/sedan/sonata_side.png";

const initialQuotes = [
    {
        id: 1,
        carName: "Avante N",
        segment: "준중형 세단",
        price: "3,856 만원",
        trimName: "N (A/T)",
        dealerName: "정수민",
        image: AvanteNImg,
        details: {
            exterior: "퍼포먼스 블루",
            interior: "원톤 블랙",
            options: "N 현대 스마트 센스 I, 컨비니언스, 선루프"
        }
    },
    {
        id: 2,
        carName: "Sonata",
        segment: "중형 세단",
        price: "3,650 만원",
        trimName: "Inspiration 1.6 Turbo",
        dealerName: "강현민",
        image: SonataImg,
        details: {
            exterior: "세레니티 화이트 펄",
            interior: "카멜/그레이 투톤",
            options: "빌트인 캠 2, BOSE 프리미엄 사운드"
        }
    }
];

export default function MyEstimatePage() {
    const router = useRouter();
    const [quotes, setQuotes] = useState(initialQuotes);

    const handleDelete = (id: number) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            setQuotes(prev => prev.filter(q => q.id !== id));
        }
    };

    const handleConsult = (dealerName: string) => {
        alert(`${dealerName} 딜러님과의 상담 페이지로 이동합니다.`);
    };

    return (
        <main className={styles.EstimateStyle}>
            <div className={styles.EstimateContainer}>
                <div className={styles.EstimateTopContent}>
                    <div><span className={styles.EstimateTitle}>나의 견적</span></div>
                    <div><span className={styles.EstimateSubTitle}>저장한 견적들을 확인해보세요.</span></div>
                </div>

                <div className={styles.EstimateCountryContent} style={{ marginTop: '50px' }}>
                    <div>
                        <span className={styles.EstimateCountryContentTitle}>견적 리스트</span>
                        <div className={styles.EstimateCountryContentDivideLine} style={{ width: '100%' }} />
                    </div>
                </div>

                <div className={styles.EstimateMidContent}>
                    <div className={styles.EstimateCardStyle} style={{ paddingBottom: '30px' }}>
                        <div className={styles.EstimateCardCarList} style={{ marginTop: '20px' }}>
                            {quotes.length > 0 ? (
                                quotes.map((quote) => (
                                    <div key={quote.id} className={styles.EstimateCardCarInfoStyle}>
                                        <Image
                                            className={styles.EstimateCardCarInfoCarImage}
                                            src={quote.image}
                                            alt={quote.carName}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <div className={styles.EstimateCardCarInfoContainer}>
                                            <div className={styles.EstimateCardCarInfoTitleContent}>
                                                <span className={styles.EstimateCardCarInfoCarName}>
                                                    {quote.carName}
                                                </span>
                                                <span className={styles.EstimateCardCarInfoCarSegment}>
                                                    {quote.segment}
                                                </span>
                                            </div>

                                            <span className={styles.EstimateCardCarInfoCarPrice}>
                                                {quote.price}
                                            </span>

                                            <span className={styles.EstimateCardCarInfoCarSpec}>
                                                트림명: {quote.trimName} | 외장: {quote.details.exterior} | 내장: {quote.details.interior}
                                            </span>
                                            <span className={styles.EstimateCardCarInfoCarSpec} style={{ marginTop: '2px' }}>
                                                옵션: {quote.details.options}
                                            </span>

                                            <span className={styles.EstimateCardCarInfoCarSpec}
                                                  style={{ color: '#60a5fa', marginTop: '4px' }}>
                                                담당 딜러: {quote.dealerName}
                                            </span>
                                        </div>

                                        <div style={{
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            gap: '8px',
                                            marginRight: '15px'
                                        }}>
                                            <Button
                                                className={styles.EstimateCardCarInfoSelectButton}
                                                style={{ margin: 0, backgroundColor: '#97ABD4', minWidth: '60px' }}
                                                onClick={() => handleConsult(quote.dealerName)}
                                            >
                                                상담
                                            </Button>
                                            <Button
                                                className={styles.EstimateCardCarInfoSelectButton}
                                                style={{ margin: 0, backgroundColor: '#9ca3af', minWidth: '60px' }}
                                                onClick={() => handleDelete(quote.id)}
                                            >
                                                삭제
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ textAlign: 'center', color: '#aaa', mt: 5 }}>
                                    저장된 견적이 없습니다.
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
