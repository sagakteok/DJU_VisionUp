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