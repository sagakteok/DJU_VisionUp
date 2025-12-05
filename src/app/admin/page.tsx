import styles from './MainHome.module.scss';
import { Card, CardContent, Drawer, Typography, Button } from "@mui/material";

const brandItems = [
  { id: 1, name: "현대자동차" },
  { id: 2, name: "기아" },
  { id: 3, name: "쉐보레" },
  { id: 4, name: "KG 모빌리티" },
  { id: 5, name: "BMW" }
];

export default function MainHomeDesktop() {
  return (
    <div className={styles.MainHomeStyle}>
      <div className={styles.MainHomeContainer}>
        <div className={styles.MainHomeContent}>
          <Card className={styles.MainHomeCardStyle}>
            <Drawer variant="permanent" anchor="left" PaperProps={{ style: {position: "absolute", height: "100%", width: "180px" }}}>
              <span className={styles.MainHomeLeftContentTitle}>대시보드</span>
              <div className={styles.MainHomeLeftContentItemContainer}>
                {brandItems.map(item => (
                  <span key={item.id} className={styles.MainHomeLeftContentItem}>
                    {item.name}
                  </span>
                ))}
              </div>
              <Button variant="contained" className={styles.MainHomeLeftContentBottomButton}>브랜드 추가</Button>
            </Drawer>
            <CardContent style={{ marginLeft: "180px" }}>
              <Typography>
                여기에 메인 콘텐츠가 들어갑니다.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}