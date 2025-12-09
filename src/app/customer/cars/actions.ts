'use server'

import {prisma} from "@/lib/prisma";

export async function getCarNamesForAutocomplete(keyword: string) {
    if (!keyword) return [];

    try {
        const cars = await prisma.carModel.findMany({
            where: {
                car_name: {
                    contains: keyword,
                    mode: 'insensitive',
                },
            },
            select: {
                car_name: true,
            },
            distinct: ['car_name'],
            take: 10,
        });

        return cars.map((car) => car.car_name);
    } catch (error) {
        console.error("Error fetching car names:", error);
        return [];
    }
}

export async function searchCarsByModel(modelName: string) {
    if (!modelName) return [];

    try {
        const cars = await prisma.carModel.findMany({
            where: {
                car_name: {
                    contains: modelName,
                    mode: 'insensitive',
                },
            },
            include: {
                brand: true,
                trims: true,
            },
            orderBy: {
                price: 'asc'
            },
        });
        return cars;
    } catch (error) {
        console.error("Error searching cars:", error);
        return [];
    }
}