"use client";

import styles from './MainHome.module.scss';
import Image from "next/image";
import { Card, CardContent, Drawer, Button, Modal, Box, TextField, IconButton } from "@mui/material";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { useState } from "react";

import AvanteNSide from "./assets/avanten_side.png"

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
            price: 3360,
            liter_size: 1998,
            fuel_efficiency: 10.6
          }
        ]
      },
      {
        brand_id: 2,
        brand_name: "기아",
        CarModel: [
          {
            id: 2,
            car_name: "K5",
            car_image: AvanteNSide,
            price: 2700,
            liter_size: 1999,
            fuel_efficiency: 11
          },
          {
            id: 3,
            car_name: "K8",
            car_image: AvanteNSide,
            price: 3300,
            liter_size: 2497,
            fuel_efficiency: 12
          },
          {
            id: 4,
            car_name: "K9",
            car_image: AvanteNSide,
            price: 5500,
            liter_size: 3348,
            fuel_efficiency: 9
          }
        ]
      },
      {
        brand_id: 3,
        brand_name: "쉐보레",
      },
    ]
  },
  {
    brand_country: "독일",
    CarBrand: [
      {
        brand_id: 4,
        brand_name: "KG 모빌리티",
      },
      {
        brand_id: 5,
        brand_name: "BMW",
      },
      {
        brand_id: 6,
        brand_name: "메르세데스-벤츠",
      },
      {
        brand_id: 7,
        brand_name: "폭스바겐",
      },
      {
        brand_id: 8,
        brand_name: "아우디",
      }
    ]
  },
  {
    brand_country: "일본",
    CarBrand: [
      {
        brand_id: 9,
        brand_name: "토요타",
      },
      {
        brand_id: 10,
        brand_name: "마쯔다",
      }
    ]
  }
];

export default function MainHomeDesktop() {
  const [activeBrandId, setActiveBrandId] = useState<number>(CarItems[0].CarBrand[0].brand_id);

  const [brandName, setBrandName] = useState("");
  const [brandCountry, setBrandCountry] = useState("");

  const [openAddBrandModal, setOpenAddBrandModal] = useState(false);
  const handleOpenAddBrandModal = () => setOpenAddBrandModal(true);
  const handleCloseAddBrandModal = () => setOpenAddBrandModal(false);

  const [openEditBrandModal, setOpenEditBrandModal] = useState(false);
  const handleOpenEditBrandModal = () => setOpenEditBrandModal(true);
  const handleCloseEditBrandModal = () => setOpenEditBrandModal(false);

  const [openAddCarModal, setOpenAddCarModal] = useState(false);
  const handleOpenAddCarModal = () => setOpenAddCarModal(true);
  const handleCloseAddCarModal = () => setOpenAddCarModal(false);

  return (
    <div className={styles.MainHomeStyle}>
      <div className={styles.MainHomeContainer}>
        <div className={styles.MainHomeContent}>
          <Card className={styles.MainHomeCardStyle}>
            <Drawer variant="permanent" anchor="left" PaperProps={{ style: {position: "absolute", height: "100%", width: "180px", overflowY: "auto", border: "none", boxShadow: "none", }}}>
              <span className={styles.MainHomeLeftContentTitle}>대시보드</span>
              <div className={styles.MainHomeLeftContentItemContainer}>
                {CarItems.flatMap(country => country.CarBrand.map(brand => (
                    <span key={brand.brand_id} className={`${styles.MainHomeLeftContentItem} ${activeBrandId === brand.brand_id ? styles.active : ''}`} onClick={() => setActiveBrandId(brand.brand_id)}>{brand.brand_name}</span>
                  ))
                )}
              </div>
              <Button variant="contained" className={styles.MainHomeLeftContentBottomButton} onClick={handleOpenAddBrandModal}>브랜드 추가</Button>
            </Drawer>
            <CardContent style={{ height: '100%', overflowY: 'auto', marginLeft: '180px'}}>
              <div>
                {CarItems.flatMap(country =>
                  country.CarBrand
                    .filter(brand => activeBrandId === null || activeBrandId === brand.brand_id)
                    .map(brand => (
                      <div className={styles.MainHomeCardTitlesContainer} key={brand.brand_id}>
                        <span className={styles.MainHomeCardMainTitle}>{brand.brand_name}</span>
                        <span className={styles.MainHomeCardSubTitle}>국가: {country.brand_country}</span>
                      </div>
                    ))
                )}
              </div>
              <div className={styles.MainHomeCardDividerContainer}>
                <span className={styles.MainHomeCardDividerTitle}>차량 목록</span>
                <div className={styles.MainHomeCardDivider}/>
              </div>
              <div className={styles.MainHomeCardCarList}>
                {CarItems.flatMap(country =>
                  country.CarBrand.flatMap(brand =>
                    brand.CarModel?.filter(() =>
                      activeBrandId === null || activeBrandId === brand.brand_id
                    )?.map(car => (
                      <div key={car.id} className={styles.MainHomeCardCarInfoStyle}>
                        <Image
                          className={styles.MainHomeCardCarInfoCarImage}
                          src={car.car_image}
                          alt={car.car_name}
                        />
                        <div className={styles.MainHomeCardCarInfoContainer}>
                          <div className={styles.MainHomeCardCarInfoTitleContent}>
                            <span className={styles.MainHomeCardCarInfoCarName}>{car.car_name}</span>
                          </div>
                          <span className={styles.MainHomeCardCarInfoCarPrice}>{car.price}만원 ~</span>
                          <span className={styles.MainHomeCardCarInfoCarSpec}>배기량: ~ {car.liter_size}cc</span>
                          <span className={styles.MainHomeCardCarInfoCarSpec}>연비: ~ {car.fuel_efficiency} km/l</span>
                        </div>
                        <div className={styles.MainHomeCardCarInfoSelectButtonGroupStyle}>
                          <Button className={styles.MainHomeCardCarInfoSelectButton}>수정하기</Button>
                          <Button className={styles.MainHomeCardCarInfoSelectButton}>삭제하기</Button>
                        </div>
                      </div>
                    ))
                  )
                )}
                <div className={styles.MainHomeCardCarAddButtonWrapper}>
                  <Button className={styles.MainHomeCardBrandDeleteButton}>브랜드 삭제</Button>
                  <Button className={styles.MainHomeCardBrandEditButton} onClick={handleOpenEditBrandModal}>브랜드 정보 수정</Button>
                  <Button className={styles.MainHomeCardCarAddButton} onClick={handleOpenAddCarModal}>차량 추가하기</Button>
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
              <Icon path={mdiClose} size={1} />
            </IconButton>
          </div>
          <div className={styles.MainHomeModalBoxTextFieldWrapper}>
            <input className={styles.MainHomeModalBoxTextField} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="브랜드 명을 입력해주세요."/>
            <input className={styles.MainHomeModalBoxTextField} value={brandCountry} onChange={(e) => setBrandCountry(e.target.value)} placeholder="브랜드 국가를 입력해주세요."/>
            <Button className={styles.MainHomeModalBoxSaveButton} variant="contained" onClick={() => console.log(brandName, brandCountry)}>저장하기</Button>
          </div>
        </Box>
      </Modal>
      <Modal open={openEditBrandModal} onClose={handleCloseEditBrandModal}>
        <Box className={styles.MainHomeModalBoxStyle}>
          <div className={styles.MainHomeModalBoxTitleWrapper}>
            <span className={styles.MainHomeModalBoxMainTitle}>브랜드 정보 수정</span>
            <IconButton onClick={handleCloseEditBrandModal}>
              <Icon path={mdiClose} size={1} />
            </IconButton>
          </div>
          <div className={styles.MainHomeModalBoxTextFieldWrapper}>
            <input className={styles.MainHomeModalBoxTextField} placeholder="변경할 브랜드 명을 입력해주세요."/>
            <input className={styles.MainHomeModalBoxTextField} placeholder="변경할 브랜드 국가를 입력해주세요."/>
            <Button className={styles.MainHomeModalBoxSaveButton} variant="contained">수정하기</Button>
          </div>
        </Box>
      </Modal>
      <Modal open={openAddCarModal} onClose={handleCloseAddCarModal}>
        <Box className={styles.MainHomeModalBoxStyle}>
          <div className={styles.MainHomeModalBoxTitleWrapper}>
            <span className={styles.MainHomeModalBoxMainTitle}>차량 추가</span>
            <IconButton onClick={handleCloseAddCarModal}>
              <Icon path={mdiClose} size={1} />
            </IconButton>
          </div>
          <div className={styles.MainHomeModalBoxTextFieldWrapper}>
            <input className={styles.MainHomeModalBoxTextField} placeholder="차량명을 입력해주세요."/>
            <input className={styles.MainHomeModalBoxTextField} placeholder="시작 가격을 입력해주세요."/>
            <input className={styles.MainHomeModalBoxTextField} placeholder="배기량을 정수로 입력해주세요."/>
            <input className={styles.MainHomeModalBoxTextField} placeholder="연비를 소수점 한 자리까지 입력해주세요."/>
            <input className={styles.MainHomeModalBoxTextField} placeholder="바디 타입을 입력해주세요."/>
            <Button className={styles.MainHomeModalBoxSaveButton} variant="contained">추가하기</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}