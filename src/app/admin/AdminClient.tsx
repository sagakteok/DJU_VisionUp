"use client";

import styles from './MainHome.module.scss';
import Image from "next/image";
import {Card, CardContent, Drawer, Button, Modal, Box, IconButton, TextField} from "@mui/material";
import Icon from "@mdi/react"
import {mdiClose} from "@mdi/js";
import {useState, useEffect, use} from "react";
import {useRouter} from "next/navigation";
import {createBrand, deleteBrand, updateBrand, createCarModel, deleteCarModel} from "@/app/admin/actions";

import AvanteNSide from "./assets/avanten_side.png";

interface CarModel {
    id: number;
    car_name: string;
    price: number;
    liter_size: number;
    fuel_efficiency: number;
    car_image?: any;
}

interface CarBrand {
    brand_id: number;
    brand_name: string;
    CarModel: CarModel[];
}

interface CountryGroup {
    brand_country: string;
    CarBrand: CarBrand[];
}

interface AdminClientProps {
    initialData: CountryGroup[];
}

export default function AdminClient({initialData}: AdminClientProps) {
    const router = useRouter();

    const firstBrandId = initialData[0]?.CarBrand[0]?.brand_id || 0;
    const [activeBrandId, setActiveBrandId] = useState<number>(firstBrandId);

    const [brandName, setBrandName] = useState("");
    const [brandCountry, setBrandCountry] = useState("");
    const [editBrandName, setEditBrandName] = useState("");
    const [editBrandCountry, setEditBrandCountry] = useState("");

    const [openAddBrandModal, setOpenAddBrandModal] = useState(false);
    const handleOpenAddBrandModal = () => setOpenAddBrandModal(true);
    const handleCloseAddBrandModal = () => setOpenAddBrandModal(false);

    const [openEditBrandModal, setOpenEditBrandModal] = useState(false);
    const handleOpenEditBrandModal = () => {
        const currentBrand = initialData
            .flatMap(g => g.CarBrand)
            .find(b => b.brand_id === activeBrandId);

        if (currentBrand) {
            setEditBrandName(currentBrand.brand_name);

            const parentGroup = initialData.find(group =>
                group.CarBrand.some(b => b.brand_id === activeBrandId)
            );
            setEditBrandCountry(parentGroup?.brand_country || "");
            setOpenEditBrandModal(true);
        }
    };
    const handleCloseEditBrandModal = () => setOpenEditBrandModal(false);

    const [openAddCarModal, setOpenAddCarModal] = useState(false);
    const handleOpenAddCarModal = () => setOpenAddCarModal(true);
    const handleCloseAddCarModal = () => setOpenAddCarModal(false);

    const [newCarName, setNewCarName] = useState("");
    const [newCarPrice, setNewCarPrice] = useState("");
    const [newCarLiter, setNewCarLiter] = useState("");
    const [newCarFuel, setNewCarFuel] = useState("");
    const [newCarBody, setNewCarBody] = useState("");

    const handleSaveBrand = async () => {
        const result = await createBrand(brandName, brandCountry);

        if (result.success) {
            alert(result.message);
            setBrandName("");
            setBrandCountry("");
            handleCloseAddBrandModal();
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDeleteBrand = async () => {
        if (!activeBrandId) return;

        const currentBrand = initialData
            .flatMap(g => g.CarBrand)
            .find(b => b.brand_id === activeBrandId);

        if (!confirm(`'${currentBrand?.brand_name}' 브랜드를 정말 삭제하시겠습니까?\n소속된 모든 차량 정보도 함께 삭제됩니다.`)) {
            return;
        }

        const result = await deleteBrand(activeBrandId);

        if (result.success) {
            alert(result.message);
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleUpdateBrand = async () => {
        if (!activeBrandId) return;

        const result = await updateBrand(activeBrandId, editBrandName, editBrandCountry);

        if (result.success) {
            alert(result.message);
            handleCloseEditBrandModal();
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleSaveCar = async () => {
        if (!activeBrandId) {
            alert("브랜드를 선택해주세요.");
            return;
        }

        const priceInt = parseInt(newCarPrice, 10);
        const literInt = parseInt(newCarLiter, 10);
        const fuelFloat = parseFloat(newCarFuel);

        if (!newCarName || isNaN(priceInt) || isNaN(literInt) || isNaN(fuelFloat)) {
            alert("모든 정보를 올바르게 입력해주세요. (숫자 필드 확인)");
            return;
        }

        const result = await createCarModel(activeBrandId, {
            car_name: newCarName,
            price: priceInt,
            liter_size: literInt,
            fuel_efficiency: fuelFloat,
            body_type: newCarBody
        });

        if (result.success) {
            alert(result.message);
            setNewCarName("");
            setNewCarPrice("");
            setNewCarLiter("");
            setNewCarFuel("");
            setNewCarBody("");

            handleCloseAddCarModal();
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDeleteCar = async (carId: number, carName: string) => {
        if (!confirm(`'${carName}' 차량을 정말 삭제하시겠습니까?`)) {
            return;
        }

        const result = await deleteCarModel(carId);

        if (result.success) {
            alert(result.message);
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    useEffect(() => {
        const allBrands = initialData.flatMap(group => group.CarBrand);
        const isValid = allBrands.some(brand => brand.brand_id === activeBrandId);

        if (!isValid && allBrands.length > 0) {
            setActiveBrandId(allBrands[0].brand_id);
        }
    }, [initialData, activeBrandId]);

    return (
        <div className={styles.MainHomeStyle}>
            <div className={styles.MainHomeContainer}>
                <div className={styles.MainHomeContent}>
                    <Card className={styles.MainHomeCardStyle}>
                        <Drawer variant="permanent" anchor="left" PaperProps={{
                            style: {
                                position: "absolute",
                                height: "100%",
                                width: "180px",
                                overflowY: "auto",
                                border: "none",
                                boxShadow: "none",
                            }
                        }}>
                            <span className={styles.MainHomeLeftContentTitle}>대시보드</span>
                            <div className={styles.MainHomeLeftContentItemContainer}>
                                {initialData.flatMap(country => country.CarBrand.map(brand => (
                                        <span
                                            key={brand.brand_id}
                                            className={`${styles.MainHomeLeftContentItem} ${activeBrandId === brand.brand_id ? styles.active : ''}`}
                                            onClick={() => setActiveBrandId(brand.brand_id)}
                                        >
                                            {brand.brand_name}
                                        </span>
                                    ))
                                )}
                            </div>
                            <Button variant="contained" className={styles.MainHomeLeftContentBottomButton}
                                    onClick={handleOpenAddBrandModal}>브랜드 추가</Button>
                        </Drawer>
                        <CardContent style={{height: '100%', overflowY: 'auto', marginLeft: '180px'}}>
                            <div>
                                {initialData.flatMap(country =>
                                    country.CarBrand
                                        .filter(brand => activeBrandId === null || activeBrandId === brand.brand_id)
                                        .map(brand => (
                                            <div className={styles.MainHomeCardTitlesContainer} key={brand.brand_id}>
                                                <span className={styles.MainHomeCardMainTitle}>{brand.brand_name}</span>
                                                <span
                                                    className={styles.MainHomeCardSubTitle}>국가: {country.brand_country}</span>
                                            </div>
                                        ))
                                )}
                            </div>
                            <div className={styles.MainHomeCardDividerContainer}>
                                <span className={styles.MainHomeCardDividerTitle}>차량 목록</span>
                                <div className={styles.MainHomeCardDivider}/>
                            </div>
                            <div className={styles.MainHomeCardCarList}>
                                {initialData.flatMap(country =>
                                    country.CarBrand.flatMap(brand =>
                                        brand.CarModel?.filter(() =>
                                            activeBrandId === 0 || activeBrandId === brand.brand_id
                                        )?.map(car => (
                                            <div key={car.id} className={styles.MainHomeCardCarInfoStyle}>
                                                <Image
                                                    className={styles.MainHomeCardCarInfoCarImage}
                                                    src={car.car_image || AvanteNSide}
                                                    alt={car.car_name}
                                                />
                                                <div className={styles.MainHomeCardCarInfoContainer}>
                                                    <div className={styles.MainHomeCardCarInfoTitleContent}>
                                                        <span
                                                            className={styles.MainHomeCardCarInfoCarName}>{car.car_name}</span>
                                                    </div>
                                                    <span
                                                        className={styles.MainHomeCardCarInfoCarPrice}>{car.price}만원 ~</span>
                                                    <span
                                                        className={styles.MainHomeCardCarInfoCarSpec}>배기량: ~ {car.liter_size}cc</span>
                                                    <span
                                                        className={styles.MainHomeCardCarInfoCarSpec}>연비: ~ {car.fuel_efficiency} km/l</span>
                                                </div>
                                                <div className={styles.MainHomeCardCarInfoSelectButtonGroupStyle}>
                                                    <Button className={styles.MainHomeCardCarInfoSelectButton}
                                                            onClick={() => router.push(`/admin/EditCar?id=${car.id}`)}>수정하기</Button>
                                                    <Button className={styles.MainHomeCardCarInfoSelectButton}
                                                            onClick={() => handleDeleteCar(car.id, car.car_name)}>삭제하기</Button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                                <div className={styles.MainHomeCardCarAddButtonWrapper}>
                                    <Button className={styles.MainHomeCardBrandDeleteButton}
                                            onClick={handleDeleteBrand}>브랜드 삭제</Button>
                                    <Button className={styles.MainHomeCardBrandEditButton}
                                            onClick={handleOpenEditBrandModal}>브랜드 정보 수정</Button>
                                    <Button className={styles.MainHomeCardCarAddButton} onClick={handleOpenAddCarModal}>차량
                                        추가하기</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Modal open={openAddBrandModal} onClose={handleCloseAddBrandModal}>
                <Box className={styles.MainHomeModalBoxStyle}>
                    <div className={styles.MainHomeModalBoxTitleWrapper}>
                        <span className={styles.MainHomeModalBoxMainTitle}>브랜드 추가</span>
                        <IconButton onClick={handleCloseAddBrandModal}>
                            <Icon path={mdiClose} size={1}/>
                        </IconButton>
                    </div>
                    <div className={styles.MainHomeModalBoxTextFieldWrapper}>
                        <input className={styles.MainHomeModalBoxTextField} value={brandName}
                               onChange={(e) => setBrandName(e.target.value)} placeholder="브랜드 명을 입력해주세요."/>
                        <input className={styles.MainHomeModalBoxTextField} value={brandCountry}
                               onChange={(e) => setBrandCountry(e.target.value)} placeholder="브랜드 국가를 입력해주세요."/>
                        <Button className={styles.MainHomeModalBoxSaveButton} variant="contained"
                                onClick={handleSaveBrand}>저장하기</Button>
                    </div>
                </Box>
            </Modal>
            <Modal open={openEditBrandModal} onClose={handleCloseEditBrandModal}>
                <Box className={styles.MainHomeModalBoxStyle}>
                    <div className={styles.MainHomeModalBoxTitleWrapper}>
                        <span className={styles.MainHomeModalBoxMainTitle}>브랜드 정보 수정</span>
                        <IconButton onClick={handleCloseEditBrandModal}>
                            <Icon path={mdiClose} size={1}/>
                        </IconButton>
                    </div>
                    <div className={styles.MainHomeModalBoxTextFieldWrapper}>
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="변경할 브랜드 명을 입력해주세요."
                            value={editBrandName}
                            onChange={(e) => setEditBrandName(e.target.value)}
                        />
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="변경할 브랜드 국가를 입력해주세요."
                            value={editBrandCountry}
                            onChange={(e) => setEditBrandCountry(e.target.value)}
                        />
                        <Button className={styles.MainHomeModalBoxSaveButton} variant="contained"
                                onClick={handleUpdateBrand}>수정하기</Button>
                    </div>
                </Box>
            </Modal>
            <Modal open={openAddCarModal} onClose={handleCloseAddCarModal}>
                <Box className={styles.MainHomeModalBoxStyle}>
                    <div className={styles.MainHomeModalBoxTitleWrapper}>
                        <span className={styles.MainHomeModalBoxMainTitle}>차량 추가</span>
                        <IconButton onClick={handleCloseAddCarModal}>
                            <Icon path={mdiClose} size={1}/>
                        </IconButton>
                    </div>
                    <div className={styles.MainHomeModalBoxTextFieldWrapper}>
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="차량명을 입력해주세요."
                            value={newCarName}
                            onChange={(e) => setNewCarName(e.target.value)}
                        />
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="시작 가격을 입력해주세요. (단위: 만원)"
                            type="number"
                            value={newCarPrice}
                            onChange={(e) => setNewCarPrice(e.target.value)}
                        />
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="배기량을 정수로 입력해주세요. (cc)"
                            type="number"
                            value={newCarLiter}
                            onChange={(e) => setNewCarLiter(e.target.value)}
                        />
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="연비를 소수점 한 자리까지 입력해주세요. (km/l)"
                            type="number"
                            step="0.1"
                            value={newCarFuel}
                            onChange={(e) => setNewCarFuel(e.target.value)}
                        />
                        <input
                            className={styles.MainHomeModalBoxTextField}
                            placeholder="바디 타입을 입력해주세요. (세단, SUV 등)"
                            value={newCarBody}
                            onChange={(e) => setNewCarBody(e.target.value)}
                        />
                        <Button className={styles.MainHomeModalBoxSaveButton} variant="contained"
                                onClick={handleSaveCar}>추가하기</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

