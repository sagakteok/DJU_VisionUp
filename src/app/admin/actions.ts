'use server'

import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function createBrand(brandName: string, brandCountry: string){
    if (!brandName || !brandCountry){
        return {success: false, message: "브랜드 명과 국가를 모두 입력해주세요."};
    }

    try {
        await prisma.carBrand.create({
            data:{
                brand_name: brandName,
                brand_country: brandCountry,
            },
        });

        revalidatePath('/admin');

        return {success: true, message: "브랜드가 추가되었습니다."};
    } catch (error){
        console.error("Failed to create brand:", error);
        return {success: false, message: "브랜드 추가 중 오류가 발생했습니다."};
    }
}

export async function deleteBrand(brandId: number){
    if (!brandId){
        return {success: false, message: "삭제할 브랜드 정보가 없습니다."};
    }

    try {
        //트랜잭션으로 관련 차량 모델 선 삭제, 후 브랜드 삭제
        await prisma.$transaction(async (tx)=>{
            await tx.carModel.deleteMany({
                where: {brand_id: brandId},
            });

            await tx.carBrand.delete({
                where: {id: brandId},
            });
        });

        revalidatePath('/admin');
        return {success: true, message: "브랜드가 삭제되었습니다."};
    } catch (error){
        console.error("Failed to delete brand:", error);
        return {success: false, message: "브랜드 삭제 중 오류가 발생했습니다. (소속된 차량이나 견적 데이터가 있을 수 있습니다.)"};
    }
}

export async function updateBrand(brandId: number, newName: string, newCountry: string){
    if (!brandId || !newName || !newCountry){
        return {success: false, message: "수정할 정보를 모두 입력해주세요."};
    }

    try {
        await prisma.carBrand.update({
            where: {id: brandId},
            data: {
                brand_name: newName,
                brand_country: newCountry,
            },
        });

        revalidatePath('/admin');
        return {success: true, message: "브랜드 정보가 수정되었습니다."};
    } catch (error){
        console.error("Failed to update brand:", error);
        return {success: false, message: "브랜드 정보 수정 중 오류가 발생했습니다."};
    }
}

export async function createCarModel(
    brandId: number,
    carData: {
        car_name: string;
        price: number;
        liter_size: number;
        fuel_efficiency: number;
        body_type: string;
    }
) {
    if (!brandId) return {success: false, message: "브랜드가 선택되지 않았습니다."};
    if (!carData.car_name) return {success: false, message: "차량명을 입력해주세요."};

    try {
        await prisma.carModel.create({
            data: {
                brand:{
                    connect: {
                        id: brandId
                    }
                },
                car_name: carData.car_name,
                price: Number(carData.price),
                liter_size: Number(carData.liter_size),
                fuel_efficiency: Number(carData.fuel_efficiency),
                body_type: carData.body_type,
            },
        });

        revalidatePath('/admin');
        return {success: true, message: "차량이 성공적으로 추가되었습니다."};
    } catch (error){
        console.error("Failed to create car model:", error);
        return {success: false, message: "차량 추가 중 오류가 발생했습니다."}
    }
}

export async function deleteCarModel(carId: number){
    if (!carId){
        return {success: false, message: "삭제할 차량 정보가 없습니다."};
    }

    try {
        await prisma.carModel.delete({
            where: {id: carId},
        });

        revalidatePath('/admin');
        return {success: true, message: "차량이 삭제되었습니다."};
    } catch (error){
        console.error("Failed to delete car model:", error);
        return {success: false, message: "차량 삭제 중 오류가 발생했습니다. (견적 등 다른 테이블에서 이 차를 참조중이면 삭제 안됨)"};
    }
}