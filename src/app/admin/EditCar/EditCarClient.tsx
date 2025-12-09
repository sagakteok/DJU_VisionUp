"use client"

import styles from './EditCar.module.scss';
import Image from "next/image";
import {
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment
} from "@mui/material";
import Icon from "@mdi/react";
import {mdiPencil} from "@mdi/js";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {
    updateCarModel, createTrim, updateTrim, deleteTrim,
    createExteriorColor, deleteExteriorColor,
    createInteriorColor, deleteInteriorColor,
    createOption, deleteOption, updateExteriorColor, updateInteriorColor, updateOption
} from "@/app/admin/actions";
import AvanteNSide from "../assets/avanten_side.png"

interface EditCarClientProps {
    carData: any;
}

export default function EditCarClient({carData}: EditCarClientProps) {
    const router = useRouter();

    if (!carData) return <div>차량 정보를 불러올 수 없습니다.</div>;

    // --- State 관리 ---
    const [carName, setCarName] = useState(carData.car_name ?? "");
    const [price, setPrice] = useState(String(carData.price ?? ""));
    const [literSize, setLiterSize] = useState(String(carData.liter_size ?? ""));
    const [fuelEfficiency, setFuelEfficiency] = useState(String(carData.fuel_efficiency ?? ""));
    const [bodyType, setBodyType] = useState(carData.body_type ?? "");

    const [openTrimModal, setOpenTrimModal] = useState(false);
    const [editingTrimId, setEditingTrimId] = useState<number | null>(null);
    const [trimName, setTrimName] = useState("");
    const [trimPrice, setTrimPrice] = useState("");

    // 하위 아이템 모달 State
    const [openSubItemModal, setOpenSubItemModal] = useState(false);
    const [subItemType, setSubItemType] = useState<"EXTERIOR" | "INTERIOR" | "OPTION">("EXTERIOR");
    const [targetTrimId, setTargetTrimId] = useState<number | null>(null);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemHex, setItemHex] = useState("");
    const [itemDetail, setItemDetail] = useState("");

    // 선택 상태 관리
    const [selectedTrimId, setSelectedTrimId] = useState<number | null>(null);
    const [selectedExtId, setSelectedExtId] = useState<number | null>(null);
    const [selectedIntId, setSelectedIntId] = useState<number | null>(null);
    const [selectedOptId, setSelectedOptId] = useState<number | null>(null);

    //하위 아이템 수정 모드인지 확인하기 위한 State
    const [editingSubItemId, setEditingSubItemId] = useState<number | null>(null);


    const handleCancel = () => {
        if (confirm("취소하시겠습니까? 변경 사항은 저장되지 않습니다.")) {
            router.push("/admin");
        }
    };

    const handleSave = async () => {
        if (!confirm("차량 정보를 수정하시겠습니까?")) return;
        const result = await updateCarModel(carData.id, {
            car_name: carName,
            price: parseInt(price, 10) || 0,
            liter_size: parseInt(literSize, 10) || 0,
            fuel_efficiency: parseFloat(fuelEfficiency) || 0,
            body_type: bodyType
        });
        if (result.success) {
            alert(result.message);
            router.refresh();
            router.push("/admin");
        } else {
            alert(result.message);
        }
    };

    const handleSelectTrimCard = (id: number) => {
        setSelectedTrimId(prev => prev === id ? null : id);
    };

    const handleHeaderEditTrim = () => {
        if (!selectedTrimId) return alert("수정할 트림을 선택해주세요.");
        const t = carData.trims.find((x: any) => x.id === selectedTrimId);
        if (t) handleOpenEditTrim(t);
    };

    const handleHeaderDeleteTrim = () => {
        if (!selectedTrimId) return alert("삭제할 트림을 선택해주세요.");
        handleDeleteTrim(selectedTrimId);
    };

    const handleOpenCreateTrim = () => {
        setEditingTrimId(null);
        setTrimName("");
        setTrimPrice("");
        setOpenTrimModal(true);
    };
    const handleOpenEditTrim = (trim: any) => {
        setEditingTrimId(trim.id);
        setTrimName(trim.trim_name);
        setTrimPrice(String(trim.trim_price));
        setOpenTrimModal(true);
    };

    const handleSaveTrim = async () => {
        if (!trimName) return alert("트림명을 입력해주세요.");
        const priceInt = parseInt(trimPrice, 10) || 0;
        let result;
        if (editingTrimId) result = await updateTrim(editingTrimId, trimName, priceInt);
        else result = await createTrim(carData.id, trimName, priceInt);

        if (result.success) {
            alert(result.message);
            setOpenTrimModal(false);
            router.refresh();
            setSelectedTrimId(null);
        } else {
            alert(result.message);
        }
    };

    const handleDeleteTrim = async (trimId: number) => {
        if (confirm("정말 이 트림을 삭제하시겠습니까?")) {
            const result = await deleteTrim(trimId);
            if (result.success) {
                alert(result.message);
                router.refresh();
                setSelectedTrimId(null);
            } else {
                alert(result.message);
            }
        }
    };

    const handleSelectSubItem = (id: number, type: "EXTERIOR" | "INTERIOR" | "OPTION") => {
        if (type === "EXTERIOR") setSelectedExtId(prev => prev === id ? null : id);
        else if (type === "INTERIOR") setSelectedIntId(prev => prev === id ? null : id);
        else setSelectedOptId(prev => prev === id ? null : id);
    };

    const handleOpenSubModal = (trimId: number, type: any) => {
        setTargetTrimId(trimId);
        setSubItemType(type);
        setEditingSubItemId(null); // 수정 모드 해제
        setItemName("");
        setItemPrice("");
        setItemHex("");
        setItemDetail("");
        setOpenSubItemModal(true);
    };

    const handleSaveSubItem = async () => {
        const priceInt = parseInt(itemPrice, 10) || 0;
        let result;

        if (editingSubItemId) {
            // --- 수정 모드 ---
            if (subItemType === "EXTERIOR") {
                result = await updateExteriorColor(editingSubItemId, itemName, itemHex, priceInt);
            } else if (subItemType === "INTERIOR") {
                result = await updateInteriorColor(editingSubItemId, itemName, itemHex, priceInt);
            } else {
                result = await updateOption(editingSubItemId, itemName, itemDetail, priceInt);
            }
        } else {
            // --- 생성 모드 ---
            if (!targetTrimId) return; // 생성일 땐 trimId 필수
            if (subItemType === "EXTERIOR") {
                result = await createExteriorColor(targetTrimId, itemName, itemHex, priceInt);
            } else if (subItemType === "INTERIOR") {
                result = await createInteriorColor(targetTrimId, itemName, itemHex, priceInt);
            } else {
                result = await createOption(targetTrimId, itemName, itemDetail, priceInt);
            }
        }

        if (result.success) {
            alert(result.message);
            setOpenSubItemModal(false);
            router.refresh();
            // 수정 완료 후 선택 해제 (선택 사항)
            setEditingSubItemId(null);
        } else {
            alert("실패했습니다.");
        }
    };

    const handleDeleteSubItem = async (id: number, type: any) => {
        if (!confirm("삭제하시겠습니까?")) return;
        let result;
        if (type === "EXTERIOR") result = await deleteExteriorColor(id);
        else if (type === "INTERIOR") result = await deleteInteriorColor(id);
        else result = await deleteOption(id);
        if (result.success) {
            alert("삭제되었습니다.");
            router.refresh();
        } else {
            alert("삭제 실패");
        }
    };

    const handleBottomDeleteSubItem = async (type: "EXTERIOR" | "INTERIOR" | "OPTION") => {
        let idToDelete: number | null = null;
        if (type === "EXTERIOR") idToDelete = selectedExtId;
        else if (type === "INTERIOR") idToDelete = selectedIntId;
        else idToDelete = selectedOptId;

        if (!idToDelete) return alert("삭제할 항목을 선택해주세요.");
        if (!confirm("선택한 항목을 삭제하시겠습니까?")) return;

        let result;
        if (type === "EXTERIOR") result = await deleteExteriorColor(idToDelete);
        else if (type === "INTERIOR") result = await deleteInteriorColor(idToDelete);
        else result = await deleteOption(idToDelete);

        if (result.success) {
            alert("삭제되었습니다.");
            if (type === "EXTERIOR") setSelectedExtId(null);
            else if (type === "INTERIOR") setSelectedIntId(null);
            else setSelectedOptId(null);
            router.refresh();
        } else {
            alert("삭제 실패");
        }
    };

    const handleBottomUpdateSubItem = (type: "EXTERIOR" | "INTERIOR" | "OPTION") => {
        let selectedId = null;
        let targetData = null;

        // 1. 현재 선택된 ID 확인
        if (type === "EXTERIOR") selectedId = selectedExtId;
        else if (type === "INTERIOR") selectedId = selectedIntId;
        else selectedId = selectedOptId;

        if (!selectedId) return alert("수정할 항목을 선택해주세요.");

        // 2. 전체 데이터에서 선택된 ID에 해당하는 객체 찾기 (조금 비효율적이지만 확실한 방법)
        // carData.trims 배열을 순회하며 찾습니다.
        for (const trim of carData.trims) {
            if (type === "EXTERIOR") {
                targetData = trim.exteriorColors.find((c: any) => c.id === selectedId);
            } else if (type === "INTERIOR") {
                targetData = trim.interiorColors.find((c: any) => c.id === selectedId);
            } else {
                targetData = trim.options.find((o: any) => o.id === selectedId);
            }
            if (targetData) break; // 찾았으면 루프 종료
        }

        if (!targetData) return alert("데이터를 찾을 수 없습니다.");

        // 3. 찾은 데이터로 State 채우기 (프리필)
        setTargetTrimId(null); // 수정 시엔 trimId가 굳이 필요 없지만(Update쿼리는 id만 쓰니까), 형식상 유지
        setSubItemType(type);
        setEditingSubItemId(selectedId); // 수정 모드 활성화

        if (type === "OPTION") {
            setItemName(targetData.package_name);
            setItemDetail(targetData.option_detail);
            setItemPrice(String(targetData.option_price));
        } else {
            // 외장/내장 색상
            setItemName(type === "EXTERIOR" ? targetData.exterior_color_name : targetData.interior_color_name);
            setItemHex(type === "EXTERIOR" ? targetData.exterior_color_hexcode : targetData.interior_color_hexcode);
            setItemPrice(type === "EXTERIOR" ? String(targetData.exterior_color_price) : String(targetData.interior_color_price));
        }

        setOpenSubItemModal(true);
    };

    // --- 스타일 정의 ---
    const inputStyle = {
        width: '180px',
        '& .MuiInputBase-input': {
            textAlign: 'left',
            fontWeight: 'bold',
            color: '#414B6A',
            fontSize: '16px',
        },
        '& .MuiTypography-root': {
            fontWeight: 'bold',
            color: '#414B6A',
            fontSize: '14px',
        }
    };

    const blueButtonStyle = {
        minWidth: '70px', height: '32px', backgroundColor: '#97ABD4',
        borderRadius: '8px', boxShadow: 'none', fontSize: '11px', color: '#FFFFFF', padding: '0 15px',
        '&:hover': {backgroundColor: '#7d96c4', boxShadow: 'none'},
        '&:disabled': {backgroundColor: '#E0E0E0', color: '#999'}
    };

    const headerButtonStyle = {
        fontFamily: 'SpoqaHanSansNeo-Medium',
        fontSize: '12px',
        color: '#C3B3A9',
        minWidth: 'auto',
        padding: '4px 8px',
        cursor: 'pointer',
        '&:hover': {backgroundColor: 'transparent', color: '#E9B89C'},
        '&:disabled': {color: '#E0E0E0'}
    };

    return (
        <div className={styles.EditCarStyle}>
            <div className={styles.EditCarContainer}>
                <div className={styles.EditCarContent}>
                    <Card className={styles.EditCarCardStyle}>
                        <CardContent style={{height: '100%', overflowY: 'auto'}}>
                            <div>
                                <div className={styles.EditCarCardTitlesContainer}>
                                    <span className={styles.EditCarCardMainTitle}>수정하기: {carData.car_name}</span>
                                    <span
                                        className={styles.EditCarCardSubTitle}>{carData.brand?.brand_name} ({carData.brand?.brand_country})</span>
                                </div>
                                <div className={styles.EditCarCardInfoContainer}>
                                    <div className={styles.EditCarCardInfoImageContainer}>
                                        <Image src={carData.car_image || AvanteNSide} alt={carData.car_name}
                                               className={styles.EditCarCardInfoImage} width={300} height={150}/>
                                        <Button className={styles.EditCarCardInfoImageChangeButton}>변경하기</Button>
                                    </div>
                                    <div className={styles.EditCarCardInfoDetailsContainer}>
                                        <span className={styles.EditCarCardInfoTitle}>차량 기본 정보</span>
                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}
                                                  style={{width: '100px'}}>차량 이름: </span>
                                            <TextField variant="standard" value={carName}
                                                       onChange={(e) => setCarName(e.target.value)}
                                                       InputProps={{disableUnderline: true}} sx={inputStyle}/>
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>
                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}
                                                  style={{width: '100px'}}>시작 가격: </span>
                                            <TextField variant="standard" type="number" value={price}
                                                       onChange={(e) => setPrice(e.target.value)} InputProps={{
                                                disableUnderline: true,
                                                endAdornment: <InputAdornment position="end">만원</InputAdornment>
                                            }} sx={inputStyle}/>
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>
                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}
                                                  style={{width: '100px'}}>최대 배기량: </span>
                                            <TextField variant="standard" type="number" value={literSize}
                                                       onChange={(e) => setLiterSize(e.target.value)} InputProps={{
                                                disableUnderline: true,
                                                endAdornment: <InputAdornment position="start">cc</InputAdornment>
                                            }} sx={inputStyle}/>
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>
                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}
                                                  style={{width: '100px'}}>최대 연비: </span>
                                            <TextField variant="standard" type="number" value={fuelEfficiency}
                                                       onChange={(e) => setFuelEfficiency(e.target.value)} InputProps={{
                                                disableUnderline: true,
                                                endAdornment: <InputAdornment position="end">km/l</InputAdornment>
                                            }} sx={inputStyle}/>
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>
                                        <div className={styles.EditCarCardInfoDetailsTextWrapper}
                                             style={{alignItems: 'center'}}>
                                            <span className={styles.EditCarCardInfoDetailsTitle}
                                                  style={{width: '100px'}}>바디 타입: </span>
                                            <TextField variant="standard" value={bodyType}
                                                       onChange={(e) => setBodyType(e.target.value)}
                                                       InputProps={{disableUnderline: true}} sx={inputStyle}/>
                                            <IconButton className={styles.EditCarInfoDetailsEditButton}><Icon
                                                path={mdiPencil} size={0.7}/></IconButton>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.EditCarCardDividerContainer}>
                                    <div className={styles.EditCarCardDividerContentsContainer}>
                                        <span className={styles.EditCarCardDividerTitle}>트림 목록</span>
                                        <div style={{marginLeft: 'auto', display: 'flex', gap: '10px'}}>
                                            <Button onClick={handleOpenCreateTrim} sx={headerButtonStyle}>생성하기</Button>
                                            <Button onClick={handleHeaderEditTrim} sx={headerButtonStyle}
                                                    disabled={!selectedTrimId}>수정하기</Button>
                                            <Button onClick={handleHeaderDeleteTrim} sx={headerButtonStyle}
                                                    disabled={!selectedTrimId}>삭제하기</Button>
                                        </div>
                                    </div>
                                    <div className={styles.EditCarCardDivider}/>
                                </div>

                                <div className={styles.EditCarCardTrimList}>
                                    {carData.trims && carData.trims.length > 0 ? (
                                        carData.trims.map((trim: any) => {
                                            const isTrimSelected = selectedTrimId === trim.id;
                                            return (
                                                <div
                                                    key={trim.id}
                                                    className={styles.EditCarCardTrimContent}
                                                    onClick={() => handleSelectTrimCard(trim.id)}
                                                    style={{
                                                        marginBottom: '20px', padding: '20px', borderRadius: '15px',
                                                        backgroundColor: isTrimSelected ? '#F0F7FF' : '#F9F9F9',
                                                        border: isTrimSelected ? '2px solid #97ABD4' : '1px solid #eee',
                                                        cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <span className={styles.EditCarCardTrimName} style={{
                                                            fontSize: '1.2rem',
                                                            fontWeight: 'bold',
                                                            color: '#E9B89C'
                                                        }}>{trim.trim_name}</span>
                                                    </div>
                                                    <div className={styles.EditCarCardTrimPriceContainer}>
                                                        <span
                                                            className={styles.EditCarCardTrimPriceTitle}>기본 가격: </span>
                                                        <span
                                                            className={styles.EditCarCardTrimPrice}>{Math.floor(trim.trim_price / 10000).toLocaleString()}만원</span>
                                                    </div>

                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        {/* 외장 색상 */}
                                                        <div style={{marginTop: '30px'}}>
                                                            <div style={{marginBottom: '15px'}}><span
                                                                className={styles.EditCarCardTrimOptionsTitle}>외장 색상</span>
                                                            </div>
                                                            <div style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                                gap: '15px'
                                                            }}>
                                                                {trim.exteriorColors?.map((color: any) => {
                                                                    const isSelected = selectedExtId === color.id;
                                                                    return (
                                                                        <div key={color.id}
                                                                             onClick={() => handleSelectSubItem(color.id, "EXTERIOR")}
                                                                             style={{
                                                                                 background: '#fff',
                                                                                 padding: '15px',
                                                                                 borderRadius: '10px',
                                                                                 display: 'flex',
                                                                                 alignItems: 'center',
                                                                                 gap: '10px',
                                                                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                                                 border: isSelected ? '2px solid #97ABD4' : '1px solid transparent',
                                                                                 cursor: 'pointer'
                                                                             }}
                                                                        >
                                                                            <div style={{
                                                                                width: 30,
                                                                                height: 30,
                                                                                backgroundColor: color.exterior_color_hexcode,
                                                                                borderRadius: '50%',
                                                                                border: '1px solid #ddd'
                                                                            }}/>
                                                                            <div style={{flex: 1}}>
                                                                                <div style={{
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: '13px'
                                                                                }}>{color.exterior_color_name}</div>
                                                                                <div style={{
                                                                                    fontSize: '11px',
                                                                                    color: '#888'
                                                                                }}>{color.exterior_color_price > 0 ? `+${color.exterior_color_price.toLocaleString()}` : "0"}원
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end',
                                                                gap: '8px',
                                                                marginTop: '15px'
                                                            }}>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleOpenSubModal(trim.id, "EXTERIOR")}>생성하기</Button>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleBottomUpdateSubItem("EXTERIOR")}>수정하기</Button>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleBottomDeleteSubItem("EXTERIOR")}>삭제하기</Button>
                                                            </div>
                                                        </div>

                                                        {/* 내장 색상 */}
                                                        <div style={{marginTop: '30px'}}>
                                                            <div style={{marginBottom: '15px'}}><span
                                                                className={styles.EditCarCardTrimOptionsTitle}>실내 색상</span>
                                                            </div>
                                                            <div style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                                gap: '15px'
                                                            }}>
                                                                {trim.interiorColors?.map((color: any) => {
                                                                    const isSelected = selectedIntId === color.id;
                                                                    return (
                                                                        <div key={color.id}
                                                                             onClick={() => handleSelectSubItem(color.id, "INTERIOR")}
                                                                             style={{
                                                                                 background: '#fff',
                                                                                 padding: '15px',
                                                                                 borderRadius: '10px',
                                                                                 display: 'flex',
                                                                                 alignItems: 'center',
                                                                                 gap: '10px',
                                                                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                                                 border: isSelected ? '2px solid #97ABD4' : '1px solid transparent',
                                                                                 cursor: 'pointer'
                                                                             }}
                                                                        >
                                                                            <div style={{
                                                                                width: 30,
                                                                                height: 30,
                                                                                backgroundColor: color.interior_color_hexcode,
                                                                                borderRadius: '50%',
                                                                                border: '1px solid #ddd'
                                                                            }}/>
                                                                            <div style={{flex: 1}}>
                                                                                <div style={{
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: '13px'
                                                                                }}>{color.interior_color_name}</div>
                                                                                <div style={{
                                                                                    fontSize: '11px',
                                                                                    color: '#888'
                                                                                }}>{color.interior_color_price > 0 ? `+${color.interior_color_price.toLocaleString()}` : "0"}원
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end',
                                                                gap: '8px',
                                                                marginTop: '15px'
                                                            }}>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleOpenSubModal(trim.id, "INTERIOR")}>생성하기</Button>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleBottomUpdateSubItem("INTERIOR")}>수정하기</Button>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleBottomDeleteSubItem("INTERIOR")}>삭제하기</Button>
                                                            </div>
                                                        </div>

                                                        {/* 옵션 */}
                                                        <div style={{marginTop: '30px'}}>
                                                            <div style={{marginBottom: '15px'}}><span
                                                                className={styles.EditCarCardTrimOptionsTitle}>선택 옵션 구성</span>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '10px'
                                                            }}>
                                                                {trim.options?.map((opt: any) => {
                                                                    const isSelected = selectedOptId === opt.id;
                                                                    return (
                                                                        <div key={opt.id}
                                                                             onClick={() => handleSelectSubItem(opt.id, "OPTION")}
                                                                             style={{
                                                                                 background: '#fff',
                                                                                 padding: '15px',
                                                                                 borderRadius: '10px',
                                                                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                                                 position: 'relative',
                                                                                 border: isSelected ? '2px solid #97ABD4' : '1px solid transparent',
                                                                                 cursor: 'pointer'
                                                                             }}
                                                                        >
                                                                            <div style={{
                                                                                fontWeight: 'bold',
                                                                                fontSize: '15px',
                                                                                color: '#333'
                                                                            }}>{opt.package_name}</div>
                                                                            <div style={{
                                                                                fontSize: '12px',
                                                                                color: '#666',
                                                                                marginTop: '5px'
                                                                            }}>{opt.option_detail}</div>
                                                                            <div style={{
                                                                                marginTop: '8px',
                                                                                fontWeight: 'bold',
                                                                                color: '#414B6A'
                                                                            }}>옵션
                                                                                가격: {opt.option_price.toLocaleString()}원
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end',
                                                                gap: '8px',
                                                                marginTop: '15px'
                                                            }}>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleOpenSubModal(trim.id, "OPTION")}>생성하기</Button>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleBottomUpdateSubItem("OPTION")}>수정하기</Button>
                                                                <Button sx={blueButtonStyle}
                                                                        onClick={() => handleBottomDeleteSubItem("OPTION")}>삭제하기</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p style={{padding: '20px', color: '#999', textAlign: 'center'}}>등록된 트림이 없습니다.
                                            트림을 추가해주세요.</p>
                                    )}
                                </div>

                                <div className={styles.EditCarBottomButtonWrapper}>
                                    <Button className={styles.EditCarBottomCancelButton}
                                            onClick={handleCancel}>취소하기</Button>
                                    <Button className={styles.EditCarBottomSubmitButton}
                                            onClick={handleSave}>저장하기</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={openTrimModal} onClose={() => setOpenTrimModal(false)}>
                <DialogTitle>{editingTrimId ? "트림 수정" : "트림 추가"}</DialogTitle>
                <DialogContent sx={{
                    width: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    paddingTop: '10px !important'
                }}>
                    <TextField label="트림 명" variant="outlined" fullWidth value={trimName}
                               onChange={(e) => setTrimName(e.target.value)}/>
                    <TextField label="트림 가격 (원)" type="number" variant="outlined" fullWidth value={trimPrice}
                               onChange={(e) => setTrimPrice(e.target.value)} helperText="예: 33600000"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTrimModal(false)}>취소</Button>
                    <Button onClick={handleSaveTrim} sx={blueButtonStyle}>저장</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSubItemModal} onClose={() => setOpenSubItemModal(false)}>
                <DialogTitle>
                    {editingSubItemId ? "수정" : "추가"}:
                    {subItemType === "EXTERIOR" && "외장 색상 추가"}
                    {subItemType === "INTERIOR" && "실내 색상 추가"}
                    {subItemType === "OPTION" && "옵션 추가"}
                </DialogTitle>
                <DialogContent sx={{
                    width: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    paddingTop: '10px !important'
                }}>
                    <TextField label={subItemType === "OPTION" ? "패키지 명" : "색상 명"} fullWidth value={itemName}
                               onChange={(e) => setItemName(e.target.value)}/>
                    <TextField label="가격 (원)" type="number" fullWidth value={itemPrice}
                               onChange={(e) => setItemPrice(e.target.value)}/>
                    {(subItemType === "EXTERIOR" || subItemType === "INTERIOR") && (
                        <TextField label="색상 코드 (예: #FFFFFF)" fullWidth value={itemHex}
                                   onChange={(e) => setItemHex(e.target.value)}/>
                    )}
                    {subItemType === "OPTION" && (
                        <TextField label="상세 설명 (구성 품목)" fullWidth multiline rows={3} value={itemDetail}
                                   onChange={(e) => setItemDetail(e.target.value)}/>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSubItemModal(false)}>취소</Button>
                    <Button onClick={handleSaveSubItem} sx={blueButtonStyle}>저장</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}