import * as z from 'zod';
// Form Schema defined
export const FormSchema = z.object({
    prompt: z.string().min(1,{
        message: "Promt is required"
    }),
});