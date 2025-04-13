import { z } from "zod";
import { getUser } from "~/utils/sql";

const bodySchema = z.object({
    email: z.string(),
    password: z.string().min(8)
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse);

    if (!body.email || !body.password) {
        return {
            status: 400,
            message: 'Username and password are required.',
        };
    }

    const user = getUser(body.email);

    if (!user)
    {
        throw createError({
            status: 401,
            message: 'user does not exist'
        });
    }

    if (body.password === user.password) {
        await setUserSession(event,
        {
            user: {
                idUser: user.idUser,
                firstName: user.firstName,
                lastName: user.lastName,
                idRole: user.idRole,
                email: user.email
            }
        });
        return {};
    }
    throw createError({
        status: 401,
        message: 'Invalid username or password.',
    });
});