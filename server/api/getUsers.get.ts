import { getUsers } from "~/utils/sql";

export default defineEventHandler(() => {
    try 
    {
        const data = getUsers();
        return ({
            success: true,
            data
        })
    }
    catch(err)
    {
        console.log(err);
        throw createError({
            status: 500,
            message: 'Something went wrong',
            data: { success: false }
        })
    }
});