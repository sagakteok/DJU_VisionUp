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