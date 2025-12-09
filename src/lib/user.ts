import {prisma} from "./prisma";

export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({where: {email}});
};

export const createUser = async ({
                                     email,
                                     name,
                                     password,
                                 }: {
    email: string;
    name: string;
    password: string;
}) => {
    return await prisma.user.create({
        data: {
            email,
            name,
            password,
        },
    });
};