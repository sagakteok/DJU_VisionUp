import styles from './EditCar.module.scss';
import { Card, CardContent, Button } from "@mui/material";

export default function MainHomeDesktop() {
  return (
    <div className={styles.MainHomeStyle}>
      <div className={styles.MainHomeContainer}>
        <div className={styles.MainHomeContent}>
          <Card className={styles.MainHomeCardStyle}>
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}