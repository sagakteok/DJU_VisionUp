import {prisma} from "@/lib/prisma";
import EditCarClient from "@/app/admin/EditCar/EditCarClient";
import {redirect} from "next/navigation";

interface EditCarPageProps{
    searchParams: Promise<{id?: string}>;
}

export default async function EditCarPage({searchParams}: EditCarPageProps){
    const {id} = await searchParams;

    if (!id){
        redirect('/admin');
    }

    const carData = await prisma.carModel.findUnique({
        where: {id: parseInt(id)},
        include: {
            brand: true,
            trims: {
                include: {
                    exteriorColors: true,
                    interiorColors: true,
                    options: true,
                },
                orderBy: {id: 'asc'}
            }
        }
    });

    if (!carData){
        return <div>존재하지 않는 차량입니다.</div>;
    }

    return <EditCarClient carData={carData}/>;
}