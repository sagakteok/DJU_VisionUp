import {prisma} from "@/lib/prisma";
import AdminClient from "@/app/admin/AdminClient";

export default async function AdminPage() {
    const allBrands = await prisma.carBrand.findMany({
        include: {
            models: true,
        },
        orderBy: {
            brand_country: 'asc',
        }
    });

    const groupedData = allBrands.reduce((acc: any[], brand) => {
        const existingGroup = acc.find((group) => group.brand_country === brand.brand_country);

        const formattedBrand = {
            brand_id: brand.id,
            brand_name: brand.brand_name,
            CarModel: brand.models.map(model => ({
                id: model.id,
                car_name: model.car_name,
                price: model.price,
                liter_size: model.liter_size,
                fuel_efficiency: model.fuel_efficiency,
                car_image: null
            }))
        };

        if (existingGroup) {
            existingGroup.CarBrand.push(formattedBrand);
        } else {
            acc.push({
                brand_country: brand.brand_country,
                CarBrand: [formattedBrand]
            });
        }
        return acc;
    }, []);

    return <AdminClient initialData={groupedData}/>;
}