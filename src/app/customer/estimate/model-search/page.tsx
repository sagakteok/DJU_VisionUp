"use client"; // 이 줄을 파일 최상단에 추가하세요.

import React, { useState } from 'react';
import styles from './ModelSearch.module.scss';
import Link from 'next/link';

export default function ModelSearchPage() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftArea}>
                <div className={styles.carImageWrapper}>
                    <img src="/palisade_side.png" alt="Palisade" />
                </div>
            </div>
            <div className={styles.rightArea}>
                <h2 className={styles.title}>모델 찾기</h2>
                <div className={styles.dropdown}>
                    <button className={styles.dropdownButton} onClick={toggleMenu}>
                        모델 선택 <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    <ul className={`${styles.modelList} ${isOpen ? styles.open : ''}`}>
                        <li>
                            <Link href="/model-detail/sedan" className={styles.listItem}>
                                세단 <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/suv" className={styles.listItem}>
                                SUV <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/mpv" className={styles.listItem}>
                                MPV <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/n" className={styles.listItem}>
                                N <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/electric-hydrogen" className={styles.listItem}>
                                수소/전기 <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/light-truck-taxi" className={styles.listItem}>
                                소형트럭&택시 <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/truck" className={styles.listItem}>
                                트럭 <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/model-detail/bus" className={styles.listItem}>
                                버스 <span className={styles.arrow}>&gt;</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}