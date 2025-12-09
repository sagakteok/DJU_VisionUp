import {searchCarsByModel} from "@/app/customer/cars/actions";
import Link from 'next/link';
import {Button, Paper, Typography, Box, Chip} from '@mui/material';

interface SearchProps{
    searchParams: Promise<{model?: string}>;
}

/*const CARS = [
    {id: 1, name: "현대 더 뉴 아이오닉 6"},
    {id: 2, name: "현대 디 올 뉴 넥쏘"},
    {id: 3, name: "현대 아이오닉5"},
    {id: 4, name: "현대 코나 Electric"},
    {id: 5, name: "현대 아이오닉 9"},
    {id: 6, name: "현대 ST1"},
    {id: 7, name: "현대 포터 II Electric"},
    {id: 8, name: "현대 포터 II Electric 특장차"},
    {id: 9, name: "2026 캐스퍼 일렉트릭"},
    {id: 11, name: "현대 아이오닉 6 N"},
    {id: 12, name: "현대 아이오닉 5 N"},
    {id: 13, name: "현대 아반떼 N"},
    {id: 14, name: "현대 쏘나타 디 엣지"},
    {id: 15, name: "현대 쏘나타 디 엣지 Hybrid"},
    {id: 16, name: "현대 그랜저"},
    {id: 17, name: "현대 그랜저 Hybrid"},
    {id: 18, name: "현대 아반떼"},
    {id: 19, name: "현대 아반떼 Hybrid"},
    {id: 20, name: "현대 싼타페"},
    {id: 21, name: "현대 싼타페 Hybrid"},
    {id: 22, name: "현대 투싼"},
    {id: 23, name: "현대 투싼 Hybrid"},
    {id: 24, name: "현대 코나"},
    {id: 25, name: "현대 코나 Hybrid"},
    {id: 26, name: "현대 베뉴"},
    {id: 27, name: "현대 디 올 뉴 팰리세이드"},
    {id: 28, name: "현대 디 올 뉴 팰리세이드 Hybrid"},
    {id: 29, name: "현대 2026 캐스퍼"},
    {id: 30, name: "현대 스타리아 라운지"},
    {id: 31, name: "현대 스타리아 라운지 Hybrid"},
    {id: 32, name: "현대 스타리아"},
    {id: 33, name: "현대 스타리아 Hybrid"},
    {id: 34, name: "현대 스타리아 킨더"},
    {id: 35, name: "현대 스타리아 라운지 캠퍼 Hybrid"},
    {id: 36, name: "현대 스타리아 라운지 리무진 Hybrid"},
    {id: 37, name: "현대 그랜저 택시"},
    {id: 38, name: "현대 쏘나타 택시"},
    {id: 39, name: "현대 스타리아 라운지 모빌리티"},
    {id: 40, name: "현대 스타리아 라운지 모빌리티 Hybrid"},
    {id: 41, name: "현대 포터 II"},
    {id: 42, name: "현대 포터 II 특장차"},
    {id: 43, name: "현대 더 뉴 마이티"},
    {id: 44, name: "현대 더 뉴 파비스"},
    {id: 45, name: "현대 뉴파워트럭"},
    {id: 46, name: "현대 더 뉴 엑시언트"},
    {id: 47, name: "현대 엑시언트 수소전기트럭"},
    {id: 48, name: "현대 쏠라티"},
    {id: 49, name: "현대 카운티"},
    {id: 50, name: "현대 카운티 일렉트릭"},
    {id: 51, name: "현대 일렉시티 타운"},
    {id: 52, name: "현대 뉴 슈퍼에어로시티"},
    {id: 53, name: "현대 일렉시티"},
    {id: 54, name: "현대 일렉시티 수소전기버스"},
    {id: 55, name: "현대 일렉시티 이층버스"},
    {id: 56, name: "현대 유니버스"},
    {id: 57, name: "현대 유니버스 수소전기버스"},
    {id: 58, name: "현대 유니버스 모바일 오피스"},
    {id: 59, name: "BMW E92M3"},
];
*/

export default async function CarsPage({searchParams}: SearchProps){
    const resolvedParams = await searchParams;
    const query = resolvedParams.model || "";

    const cars = await searchCarsByModel(query);

    return (
        <div style={{padding: '100px 20px', maxWidth: '1000px', margin: '0 auto'}}>
            <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
                검색 결과
            </Typography>

            <Typography variant="body1" sx={{mb: 4, color: '#666'}}>
                "{query}" 검색 결과: 총 {cars.length}건
            </Typography>

            {cars.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {cars.map((car)=>(
                        <Paper
                        key={car.id}
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'box-shadow 0.2s',
                            '&:hover': {boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}
                        }}
                        >
                            <div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                                    {car.brand && (
                                        <Chip label={car.brand.brand_name} size="small" color="primary" variant="outlined"/>
                                    )}
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>{car.car_name}</Typography>
                                </div>
                                <Typography variant="body2" color="textSecondary">
                                    {car.trim?.trim_name} | {car.body_type} | {car.fuel_efficiency}km/l
                                </Typography>
                            </div>

                            <div style={{textAlign: 'right', minWidth: '120px'}}>
                                <Typography variant="h6" color="primary" sx={{fontWeight:'bold', mb: 1}}>
                                    {car.price.toLocaleString()} 만원~
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        backgroundColor: '#e8f4fd',
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        borderWidth: '1.5px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                        '&:hover': {
                                            backgroundColor: '#d1e9fc',
                                            borderColor: 'primary.dark',
                                            borderWidth: '1.5px',
                                        }
                                    }}
                                    component={Link}
                                    href={`/customer/estimate?carId=${car.id}`}
                                >
                                    견적내기
                                </Button>
                            </div>
                        </Paper>
                    ))}
                </div>
            ) : (
                <Paper sx={{p:6, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px dashed #ddd'}}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        검색된 차량이 없습니다.
                    </Typography>

                    <Typography variant="body2" color="#888">
                        입력하신 검색어: <strong>{query}</strong><br/>
                        철자나 띄어쓰기를 확인하거나, 다른 차종으로 검색해주세요.
                    </Typography>
                    <Button variant="outlined" component={Link} href="/customer" sx={{mt:3}}>
                        메인으로 돌아가기
                    </Button>
                </Paper>
            )}
        </div>
    );
}