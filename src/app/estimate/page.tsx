import styles from './Estimate.module.scss';

export default function Estimate() {
    return (
        <div className="MainHomeStyle">
            <div className="MainHomeContainer">
                <section className="estimate">
                    <div className="leftArea">
                        <p className={styles.subHeading}>PALISADE 견적내기</p>
                        <p className={styles.description}>내가 타고 싶은 나만의 차를 만들어보세요.</p>
                        <a className={styles.modelSearchLink} href="#">모델 찾기 &gt;</a>
                    </div>
                    <div className={styles.carImageWrapper}>
                        <img src="/palisade_side.png" alt="Palisade" />
                    </div>
                    <div className={styles.rightMenu}>
                        <p>바디타입 &gt;</p>
                        <p>구동방식 &gt;</p>
                        <p>모델 비교 &gt;</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
