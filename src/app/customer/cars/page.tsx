'use client';

import {useSearchParams} from 'next/navigation';
import {Suspense} from 'react';
import Link from 'next/link';
import {Button, Paper, Typography, Box} from '@mui/material';

const CARS = [
    {id: 1, name: "현대 아반떼"},
    {id: 2, name: "현대 소나타"},
    {id: 3, name: "현대 그랜저"},
    {id: 4, name: "현대 k2"},
    {id: 5, name: "현대 k2c1"},
    {id: 6, name: "현대 k5"},
    {id: 7, name: "현대 k8"},
    {id: 8, name: "현대 k9"},
    {id: 9, name: "현대 k10"},
    {id: 10, name: "BMW e92m3"},
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