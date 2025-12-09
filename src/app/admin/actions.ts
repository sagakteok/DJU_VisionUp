'use server'

import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function createBrand(brandName: string, brandCountry: string) {
    if (!brandName || !brandCountry) {
        return {success: false, message: "브랜드 명과 국가를 모두 입력해주세요."};
    }

    try {
        await prisma.carBrand.create({
            data: {
                brand_name: brandName,
                brand_country: brandCountry,
            },
        });

        revalidatePath('/admin');

        return {success: true, message: "브랜드가 추가되었습니다."};
    } catch (error) {
        console.error("Failed to create brand:", error);
        return {success: false, message: "브랜드 추가 중 오류가 발생했습니다."};
    }
}

export async function deleteBrand(brandId: number) {
    if (!brandId) {
        return {success: false, message: "삭제할 브랜드 정보가 없습니다."};
    }

    try {
        //트랜잭션으로 관련 차량 모델 선 삭제, 후 브랜드 삭제
        await prisma.$transaction(async (tx) => {
            await tx.carModel.deleteMany({
                where: {brand_id: brandId},
            });

            await tx.carBrand.delete({
                where: {id: brandId},
            });
        });

        revalidatePath('/admin');
        return {success: true, message: "브랜드가 삭제되었습니다."};
    } catch (error) {
        console.error("Failed to delete brand:", error);
        return {success: false, message: "브랜드 삭제 중 오류가 발생했습니다. (소속된 차량이나 견적 데이터가 있을 수 있습니다.)"};
    }
}

export async function updateBrand(brandId: number, newName: string, newCountry: string) {
    if (!brandId || !newName || !newCountry) {
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
    } catch (error) {
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
                brand: {
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
    } catch (error) {
        console.error("Failed to create car model:", error);
        return {success: false, message: "차량 추가 중 오류가 발생했습니다."}
    }
}

export async function deleteCarModel(carId: number) {
    if (!carId) {
        return {success: false, message: "삭제할 차량 정보가 없습니다."};
    }

    try {
        await prisma.carModel.delete({
            where: {id: carId},
        });

        revalidatePath('/admin');
        return {success: true, message: "차량이 삭제되었습니다."};
    } catch (error) {
        console.error("Failed to delete car model:", error);
        return {success: false, message: "차량 삭제 중 오류가 발생했습니다. (견적 등 다른 테이블에서 이 차를 참조중이면 삭제 안됨)"};
    }
}

export async function updateCarModel(
    carId: number,
    carData: {
        car_name: string;
        price: number;
        liter_size: number;
        fuel_efficiency: number;
        body_type: string;
    }
) {
    if (!carId) return {success: false, message: "차량 ID가 없습니다."};

    try {
        await prisma.carModel.update({
            where: {id: carId},
            data: {
                car_name: carData.car_name,
                price: Number(carData.price),
                liter_size: Number(carData.liter_size),
                fuel_efficiency: Number(carData.fuel_efficiency),
                body_type: carData.body_type,
            },
        });

        revalidatePath('/admin/EditCar');
        revalidatePath('/admin');
        return {success: true, message: "차량 정보가 수정되었습니다."};
    } catch (error) {
        console.error("Failed to update car model:", error);
        return {success: false, message: "차량 수정 중 오류가 발생했습니다."};
    }
}

export async function createTrim(carModelId: number, trimName: string, trimPrice: number) {
    if (!carModelId || !trimName) return {success: false, message: "정보를 모두 입력해주세요."};

    try {
        await prisma.carTrim.create({
            data: {
                car_model_id: carModelId,
                trim_name: trimName,
                trim_price: trimPrice,
            },
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "트림이 추가되었습니다."};
    } catch (error) {
        console.error("Failed to create trim:", error);
        return {success: false, message: "트림 추가에 실패했습니다."};
    }
}

export async function updateTrim(trimId: number, trimName: string, trimPrice: number) {
    try {
        await prisma.carTrim.update({
            where: {id: trimId},
            data: {
                trim_name: trimName,
                trim_price: trimPrice,
            },
        });
        return {success: true, message: "트림이 수정되었습니다."};
    } catch (error) {
        console.error("Failed to update trim:", error);
        return {success: false, message: "트림 수정에 실패했습니다."};
    }
}

export async function deleteTrim(trimId: number) {
    try {
        await prisma.carTrim.delete({
            where: {id: trimId},
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "트림이 삭제되었습니다."}
    } catch (error) {
        console.error("Failed to delete trim:", error);
        return {success: false, message: "트림 삭제에 실패했습니다."};
    }
}

export async function createExteriorColor(trimId: number, name: string, hex: string, price: number) {
    try {
        await prisma.carExteriorColor.create({
            data: {
                trim_id: trimId,
                exterior_color_name: name,
                exterior_color_hexcode: hex,
                exterior_color_price: price,
            }
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "외장 색상이 추가되었습니다."};
    } catch (error) {
        console.error(error);
        return {success: false, message: "추가 실패"};
    }
}

export async function deleteExteriorColor(id: number) {
    try {
        await prisma.carExteriorColor.delete({where: {id}});
        revalidatePath('/admin/EditCar');
        return {success: true, message: "삭제되었습니다."};
    } catch (e) {
        return {success: false, message: "삭제 실패"};
    }
}

export async function createInteriorColor(trimId: number, name: string, hex: string, price: number) {
    try {
        await prisma.carInteriorColor.create({
            data: {
                trim_id: trimId,
                interior_color_name: name,
                interior_color_hexcode: hex,
                interior_color_price: price,
            }
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "내장 색상이 추가되었습니다."};
    } catch (error) {
        return {success: false, message: "추가 실패"};
    }
}

export async function deleteInteriorColor(id: number) {
    try {
        await prisma.carInteriorColor.delete({where: {id}});
        revalidatePath('/admin/EditCar');
        return {success: true, message: "삭제되었습니다."};
    } catch (e) {
        return {success: false, message: "삭제 실패"};
    }
}

export async function createOption(trimId: number, pkgName: string, detail: string, price: number) {
    try {
        await prisma.carOption.create({
            data: {
                trim_id: trimId,
                package_name: pkgName,
                option_detail: detail,
                option_price: price,
            }
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "옵션이 추가되었습니다."};
    } catch (error) {
        return {success: false, message: "추가 실패"};
    }
}

export async function deleteOption(id: number) {
    try {
        await prisma.carOption.delete({where: {id}});
        revalidatePath('/admin/EditCar');
        return {success: true, message: "삭제되었습니다."};
    } catch (e) {
        return {success: false, message: "삭제 실패"};
    }
}

export async function updateExteriorColor(id: number, name: string, hex: string, price: number) {
    try {
        await prisma.carExteriorColor.update({
            where: {id},
            data: {
                exterior_color_name: name,
                exterior_color_hexcode: hex,
                exterior_color_price: price,
            }
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "수정되었습니다."};
    } catch (error) {
        return {success: false, message: "수정 실패"};
    }
}

export async function updateInteriorColor(id: number, name: string, hex: string, price: number) {
    try {
        await prisma.carInteriorColor.update({
            where: {id},
            data: {
                interior_color_name: name,
                interior_color_hexcode: hex,
                interior_color_price: price,
            }
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "수정되었습니다."};
    } catch (error) {
        return {success: false, message: "수정 실패"};
    }
}

export async function updateOption(id: number, pkgName: string, detail: string, price: number) {
    try {
        await prisma.carOption.update({
            where: {id},
            data: {
                package_name: pkgName,
                option_detail: detail,
                option_price: price,
            }
        });
        revalidatePath('/admin/EditCar');
        return {success: true, message: "수정되었습니다."};
    } catch (error) {
        return {success: false, message: "수정 실패"};
    }
}