"use client"

import styles from './EditCar.module.scss';
import Image from "next/image";
import {Card, CardContent, Button, TextField, IconButton} from "@mui/material";
import Icon from "@mdi/react";
import {mdiPencil} from "@mdi/js";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {updateCarModel} from "@/app/admin/actions";

import AvanteNSide from "../assets/avanten_side.png"

interface EditCarClientProps{
    carData: any;
}

export default function EditCarClient({carData}: EditCarClientProps){
    const router = useRouter();

    if (!carData) return <div>차량 정보를 불러올 수 없습니다.</div>;

    const [carName, setCarName] = useState(carData.car_name ?? "");
    const [price, setPrice] = useState(String(carData.price ?? ""));
    const [literSize, setLiterSize] = useState(String(carData.liter_size ?? ""));
    const [fuelEfficiency, setFuelEfficiency] = useState(String(carData.fuel_efficiency ?? ""));
    const [bodyType, setBodyType] = useState(carData.body_type ?? "");

    const handleCancel = () =>{
        if (confirm("취소하시겠습니까? 변경 사항은 저장되지 않습니다.")){
            router.push("/admin");
        }
    };

    const handleSave = async ()=>{
        if (!confirm("차량 정보를 수정하시겠습니까?")) return;

        const result = await updateCarModel(carData.id, {
            car_name: carName,
            price: parseInt(price, 10) || 0,
            liter_size: parseInt(literSize, 10) || 0,
            fuel_efficiency: parseFloat(fuelEfficiency) || 0,
            body_type: bodyType
        });

        if (result.success){
            alert(result.message);
            router.refresh();
            router.push("/admin");
        } else {
            alert(result.message);
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
                                    <span className={styles.EditCarCardMainTitle}>수정하기: {carData.car_name}</span>
                                    <span className={styles.EditCarCardSubTitle}>{carData.brand?.brand_name} ({carData.brand?.brand_country})</span>
                                </div>

                                <div className={styles.EditCarCardInfoContainer}>
                                    <div className={styles.EditCarCardInfoImageContainer}>
                                        <Image src={carData.car_image || AvanteNSide} alt={carData.car_name} className={styles.EditCarCardInfoImage} width={300} height={150}/>
                                        <Button className={styles.EditCarCardInfoImageChangeButton}>변경하기</Button>
                                    </div>

                                    <div className={styles.EditCarCardInfoDetailsContainer}>
                                        <span className={styles.EditCarCardInfoTitle}>차량 기본 정보</span>

                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}>차량 이름: </span>
                                            <TextField
                                                variant="standard"
                                                value={carName}
                                                onChange={(e)=> setCarName(e.target.value)}
                                                sx={{input: {textAlign: 'right', fontWeight: 'bold'}}}/>
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>

                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}>시작 가격: </span>
                                            <TextField
                                                variant="standard"
                                                type="number"
                                                value={price}
                                                onChange={(e)=> setPrice(e.target.value)}
                                                InputProps={{
                                                    endAdornment: <span
                                                        style={{fontSize: '0.8rem', width: '40px'}}>만원</span>
                                                }}
                                                sx={{input: {textAlign: 'right', fontWeight: 'bold'}}}
                                            />
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>

                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}>최대 배기량: </span>
                                            <TextField
                                                variant="standard"
                                                type="number"
                                                value={literSize}
                                                onChange={(e)=> setLiterSize(e.target.value)}
                                                InputProps={{
                                                    endAdornment: <span
                                                        style={{fontSize: '0.8rem', width: '40px'}}>cc</span>
                                                }}
                                                sx={{input: {textAlign: 'right', fontWeight: 'bold'}}}
                                            />
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>

                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}>최대 연비: </span>
                                            <TextField
                                                variant="standard"
                                                type="number"
                                                value={fuelEfficiency}
                                                onChange={(e)=> setFuelEfficiency(e.target.value)}
                                                InputProps={{
                                                    endAdornment: <span
                                                        style={{fontSize: '0.8rem', width: '40px'}}>km/l</span>
                                                }}
                                                sx={{input: {textAlign: 'right', fontWeight: 'bold'}}}
                                            />
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>

                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}>바디 타입: </span>
                                            <TextField
                                                variant="standard"
                                                value={bodyType}
                                                onChange={(e)=> setBodyType(e.target.value)}
                                                sx={{input: {textAlign: 'right', fontWeight: 'bold'}}}
                                            />
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon path={mdiPencil} size={0.7}/></IconButton>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.EditCarCardDividerContainer}>
                                    <div className={styles.EditCarCardDividerContentsContainer}>
                                        <span className={styles.EditCarCardDividerTitle}>트림 목록</span>
                                        <div className={styles.EditCarTrimActionGroup}>
                                            <span className={styles.EditCarTrimActionButton}
                                                  onClick={() => console.log("생성 클릭")}>생성하기</span>
                                            <span className={styles.EditCarTrimActionButton}
                                                  onClick={() => console.log("수정 클릭")}>수정하기</span>
                                            <span className={styles.EditCarTrimActionButton} onClick={() => console.log("삭제 클릭")}>삭제하기</span>
                                        </div>
                                    </div>
                                    <div className={styles.EditCarCardDivider}/>
                                </div>

                                <div className={styles.EditCarCardTrimList}>
                                    //차량 기본정보 수정 테스트 후 구현

                                </div>

                                <div className={styles.EditCarBottomButtonWrapper}>
                                    <Button className={styles.EditCarBottomCancelButton} onClick={handleCancel}>취소하기</Button>
                                    <Button className={styles.EditCarBottomSubmitButton} onClick={handleSave}>저장하기</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}