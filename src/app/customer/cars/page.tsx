'use client';

import {useSearchParams} from 'next/navigation';
import {Suspense} from 'react';
import Link from 'next/link';
import {Button, Paper, Typography, Box} from '@mui/material';

const CARS = [
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

function CarSearchResults(){
    const searchParams = useSearchParams();
    const query = searchParams.get('model') || "";

    const filteredCars = query
    ? CARS.filter(car => car.name.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')))
    : [];

    return(
        <div style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                검색 결과
            </Typography>

            <Typography variant="body1" sx={{mb: 3, color: '#666'}}>
                "{query}" 검색 결과: 총 {filteredCars.length}건
            </Typography>

            {filteredCars.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredCars.map((car)=>(
                        <Paper key={car.id} elevation={1} sx={{p: 2, border: '1px solid #eee'}}>
                            <Typography variant="h6">{car.name}</Typography>
                        </Paper>
                    ))}
                </div>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6" color="textSecondary">
                        검색된 차량이 없습니다.
                    </Typography>
                    <Typography variant="body2" sx={{mt: 1}}>
                        다른 키워드로 검색해보세요. (예: k5)
                    </Typography>
                </Paper>
            )}

            <Box sx={{mt:4}}>
                <Button variant="outlined" component={Link} href="/customer">
                    메인으로 돌아가기
                </Button>
            </Box>
        </div>
    );
}

export default function CarsPage(){
    return(
        <Suspense fallback={<div style={{padding: '100px'}}>검색 정보 불러오는 중...</div>}>
            <CarSearchResults/>
        </Suspense>
    );
}