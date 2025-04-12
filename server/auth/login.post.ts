import { z } from "zod";

const bodySchema = z.object({
    username: z.string(),
    password: z.string().min(8)
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse);

    if (!body.username || !body.password) {
        return {
            status: 400,
            message: 'Username and password are required.',
        };
    }

    // Example: Replace this with your actual authentication logic
    if (body.username === 'admin' && body.password === 'password') {
        
        await setUserSession(event,
        {
            user: {
                name: "Dude"
            }
        });
        return {}
    }
    throw createError({
        status: 401,
        message: 'Invalid username or password.',
    });
});